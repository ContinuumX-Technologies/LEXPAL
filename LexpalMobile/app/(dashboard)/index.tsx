import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, RefreshControl, View, Alert, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
    StickyHeader,
    GreetingText,
    AIWidget,
    QuickActionsWidget,
    SavedLawyersWidget,
    FeaturedLawyersWidget,
    RecentAIWidget,
    AllCasesWidget,
    Lawyer
} from '../../components/dashboard/DashboardWidgets';
import { MessagesWidget, ChatListItem } from '../../components/dashboard/MessagesWidget';

import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/user';
import { LawyerService } from '../../services/lawyer';
import { AIService } from '../../services/ai';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardHome() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { signOut, user } = useAuth();
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    // Data State
    const [firstName, setFirstName] = useState(user?.first_name || user?.name || "Client");
    const [savedLawyers, setSavedLawyers] = useState<Lawyer[]>([]);
    const [featuredLawyers, setFeaturedLawyers] = useState<Lawyer[]>([]);
    const [recentAIChats, setRecentAIChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<ChatListItem[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    // const [loading, setLoading] = useState(true); // Removed as we don't show global loader

    const fetchData = useCallback(async () => {
        try {
            // Using Promise.all for parallel fetching
            // Added AIService.getRecentConversations
            const [savedRes, featuredRes, aiChatsRes, messagesRes] = await Promise.all([
                UserService.getSavedLawyers().catch(err => ({ data: { saved_lawyers: [] } })),
                LawyerService.getAllLawyers({ limit: 5 }).catch(err => ({ data: { lawyers: [] } })),
                AIService.getRecentConversations().catch(err => ({ data: { conversations: [] } })),
                UserService.getChatList().catch((err: any) => ({ data: [] })) // Adjust depending on API response structure
            ]);

            // 1. Saved Lawyers & User Info
            if (savedRes.data) {
                setSavedLawyers(savedRes.data.saved_lawyers || []);
                // If the backend returns user name here, update it
                if (savedRes.data.name) setFirstName(savedRes.data.name);
            }

            // 2. Featured Lawyers
            if (featuredRes.data) {
                const mappedFeatured = (featuredRes.data.lawyers || []).map((l: any) => ({
                    _id: l.id || l._id,
                    name: `${l.first_name} ${l.last_name}`,
                    speciality: l.specialities?.[0] || 'Legal Expert',
                    rating: l.avg_rating || 5.0,
                    review_count: l.review_count || 0,
                    img: l.profile_picture,
                    title: l.title || 'Legal Professional',
                    quote: l.quote || 'Ready to help with your legal needs.'
                }));
                setFeaturedLawyers(mappedFeatured);
            }

            // 3. Recent AI Chats
            if (aiChatsRes.data) {
                // Adjust based on your actual API response structure for AI chats
                const chats = aiChatsRes.data.conversations || [];
                // Map to widget format if needed (Widget expects: _id, title, description, date)
                const mappedChats = chats.map((c: any) => ({
                    _id: c._id,
                    title: c.title,
                    description: c.last_message, // or description if available
                    date: 'Recently' // or format c.updatedAt
                }));
                setRecentAIChats(mappedChats);
            }

            // 4. Messages
            if (messagesRes.data) {
                setMessages(messagesRes.data);
            }
            setLoadingMessages(false);

        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (user?.first_name) setFirstName(user.first_name);
        else if (user?.name) setFirstName(user.name);
    }, [user]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const handleLawyerPress = (id: string) => {
        // Navigate to lawyer profile (mock)
        console.log("Open lawyer", id);
    };

    const handleAIChatContinue = (id: string) => {
        router.push({ pathname: '/(dashboard)/ai-chat', params: { convoId: id } });
    };

    const handleNewChat = () => {
        router.push('/(dashboard)/ai-chat');
    }

    const handleLogout = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F7] dark:bg-black" edges={['left', 'right']}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            {/* Sticky Dynamic Header */}
            <View className="absolute left-0 right-0 z-50" style={{ top: insets.top + 10 }}>
                <StickyHeader firstName={firstName} onLogout={handleLogout} />
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120, paddingTop: insets.top + 80 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
                }
            >
                {/* 1. Greeting Text (Scrolls) */}
                <GreetingText firstName={firstName} />

                {/* 2. AI Widget (Hero) */}
                <AIWidget onPress={handleNewChat} />

                {/* 3. Quick Actions Grid */}
                <QuickActionsWidget />

                {/* 4. Messages Section (NEW) */}
                <MessagesWidget chats={messages} loading={loadingMessages} />

                {/* 5. Saved Lawyers (Horizontal) */}
                <SavedLawyersWidget
                    lawyers={savedLawyers}
                    onLawyerPress={handleLawyerPress}
                />

                {/* 5. Recent AI Conversations List */}
                <RecentAIWidget
                    chats={recentAIChats}
                    onContinue={handleAIChatContinue}
                />

                {/* 6. All Cases (Mocked) */}
                <AllCasesWidget />

                {/* 7. Featured Lawyers */}
                <FeaturedLawyersWidget
                    lawyers={featuredLawyers}
                    onLawyerPress={handleLawyerPress}
                />

            </ScrollView>
        </SafeAreaView>
    );
}
