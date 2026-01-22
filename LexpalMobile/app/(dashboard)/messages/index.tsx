import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search, Edit } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { UserService } from '../../../services/user';
import { ChatListItem } from '../../../components/dashboard/MessagesWidget';

export default function MessagesScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const [chats, setChats] = useState<ChatListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchChats = useCallback(async (isPolling = false) => {
        try {
            const res = await UserService.getChatList();
            if (res.data) {
                // Determine if we should show loading or just update
                setChats(res.data);
            }
        } catch (error) {
            console.log("Failed to fetch chats", error);
        } finally {
            if (!isPolling) setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchChats(); // Fetch on focus

            const interval = setInterval(() => {
                fetchChats(true); // Poll every 5s
            }, 5000);

            return () => clearInterval(interval);
        }, [fetchChats])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchChats();
    };

    const handleChatClick = (userId: string) => {
        router.push(`/(dashboard)/messages/${userId}` as any);
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: 'short' });
        return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
    };

    const renderItem = ({ item }: { item: ChatListItem }) => {
        const hasUnread = item.unreadCount > 0;
        return (
            <TouchableOpacity
                onPress={() => handleChatClick(item.userId)}
                className="flex-row items-center pl-4 bg-white dark:bg-black active:bg-gray-100 dark:active:bg-[#1c1c1e]"
            >
                {/* Avatar */}
                <View className="relative mr-3">
                    {item.profile_pic ? (
                        <Image source={{ uri: item.profile_pic }} className="w-[52px] h-[52px] rounded-full bg-gray-200" />
                    ) : (
                        <View className="w-[52px] h-[52px] rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
                            <Text className="text-xl font-medium text-gray-500 dark:text-gray-300">
                                {(item.first_name?.[0] || "")}{(item.last_name?.[0] || "")}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Content with Separator */}
                <View className="flex-1 pr-4 py-3 border-b border-gray-100 dark:border-white/10 justify-center min-h-[76px]">
                    <View className="flex-row justify-between items-baseline mb-0.5">
                        <Text className="text-[17px] font-semibold text-black dark:text-white numberOfLines={1}">
                            {item.first_name} {item.last_name}
                        </Text>
                        <Text className={`text-[14px] ${hasUnread ? 'text-[#007AFF]' : 'text-gray-400 dark:text-gray-500'}`}>
                            {formatTime(item.lastMessageAt)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text numberOfLines={2} className={`text-[15px] flex-1 mr-2 leading-[20px] ${hasUnread ? 'text-black dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.lastMessage || "No messages yet"}
                        </Text>
                        {hasUnread && (
                            <View className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#007AFF] items-center justify-center">
                                <Text className="text-xs font-bold text-white">
                                    {item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            {/* Header */}
            <View className="px-4 pt-2 pb-2 flex-row items-center justify-between bg-white dark:bg-black">
                <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight">Messages</Text>
                <TouchableOpacity className="w-9 h-9 items-center justify-center bg-gray-100 dark:bg-[#1c1c1e] rounded-full">
                    <Edit size={20} color={theme === 'dark' ? '#007AFF' : '#007AFF'} />
                </TouchableOpacity>
            </View>

            {/* Search Bar Stub */}
            <View className="px-4 pb-2">
                <View className="flex-row items-center bg-gray-100 dark:bg-[#1c1c1e] h-10 rounded-xl px-3">
                    <Search size={18} color="#8E8E93" />
                    <Text className="ml-2 text-[17px] text-[#8E8E93]">Search</Text>
                </View>
            </View>

            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={item => item.userId}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme === 'dark' ? '#white' : '#000'} />}
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center py-20 px-6">
                            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No messages</Text>
                            <Text className="text-gray-500 text-center">New messages will appear here.</Text>
                        </View>
                    ) : (
                        <View>
                            {[1, 2, 3, 4, 5].map(i => (
                                <View key={i} className="flex-row items-center pl-4 py-3">
                                    <View className="w-[52px] h-[52px] rounded-full bg-gray-200 dark:bg-[#1c1c1e] animate-pulse mr-3" />
                                    <View className="flex-1 pr-4 gap-2">
                                        <View className="h-4 w-32 bg-gray-200 dark:bg-[#1c1c1e] rounded animate-pulse" />
                                        <View className="h-3 w-48 bg-gray-200 dark:bg-[#1c1c1e] rounded animate-pulse" />
                                    </View>
                                </View>
                            ))}
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}
