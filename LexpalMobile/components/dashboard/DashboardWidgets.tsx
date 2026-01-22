
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// === Greeting Header ===
// === Sticky Dynamic Island Header ===
// === Greeting Header ===
// === Sticky Dynamic Island Header ===
import { useNotifications } from '../../context/NotificationContext';

export const StickyHeader = ({ firstName = "Client", onLogout }: { firstName?: string, onLogout?: () => void }) => {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const { unreadCount } = useNotifications();

    return (
        <View className="mx-5 h-[60px] rounded-[30px] overflow-hidden shadow-sm" style={{ backgroundColor: 'transparent' }}>
            <BlurView
                intensity={60}
                tint={theme === 'dark' ? 'dark' : 'light'}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 24,
                    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
                }}
            >
                <TouchableOpacity onPress={toggleTheme}>
                    <Ionicons
                        name={theme === 'dark' ? "moon" : "moon-outline"}
                        size={24}
                        color={theme === 'dark' ? "white" : "#475569"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(dashboard)/search' as any)}>
                    <Ionicons name="search" size={24} color={theme === 'dark' ? 'white' : '#475569'} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="relative"
                    onPress={() => router.push('/(dashboard)/notifications' as any)}
                >
                    <Ionicons name="notifications-outline" size={24} color={theme === 'dark' ? 'white' : '#475569'} />
                    {unreadCount > 0 && (
                        <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center border border-white dark:border-black">
                            <Text className="text-[9px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(dashboard)/profile' as any)}>
                    <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center">
                        <Text className="text-white font-semibold text-xs">{firstName.charAt(0)}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={24} color={theme === 'dark' ? '#ef4444' : '#ef4444'} />
                </TouchableOpacity>
            </BlurView>
        </View>
    );
};

// === Greeting Text Section ===
export const GreetingText = ({ firstName = "Client" }: { firstName?: string }) => {
    const { theme } = useTheme();
    const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();

    return (
        <View className="mb-6 pt-4">
            <Text className="text-gray-400 font-medium text-xs mb-1 uppercase tracking-wider">{date}</Text>
            <Text className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Good Morning, <Text className="text-slate-900 dark:text-white">{firstName}</Text>
            </Text>
        </View>
    );
};

// === Base Card ===
export const DashboardCard = ({ children, className, onPress }: { children: React.ReactNode, className?: string, onPress?: () => void }) => {
    const Container = onPress ? TouchableOpacity : View;
    return (
        <Container
            onPress={onPress}
            activeOpacity={0.9}
            className={`bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 shadow-sm border border-gray-100 dark:border-white/10 mb-5 ${className}`}
        >
            {children}
        </Container>
    );
};

// === Lexpal AI Widget (Blue Theme) ===
export const AIWidget = ({ onPress }: { onPress?: () => void }) => {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <View className="mb-8">
            <View
                className="rounded-[32px] p-6 items-center border border-blue-100 dark:border-white/10 bg-[#eff6ff] dark:bg-black"
                style={{ minHeight: 280 }} // Estimate height provided in screenshot
            >
                {/* Icon Container with Glow */}
                <View className="w-20 h-20 rounded-[28px] bg-blue-600 items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <MaterialIcons name="auto-awesome" size={32} color="white" />
                </View>

                {/* Title */}
                <Text className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">Lexpal AI</Text>

                {/* Description */}
                <Text className="text-gray-500 dark:text-gray-400 text-center text-sm px-4 mb-6 leading-5">
                    Your intelligent legal assistant, powered by advanced AI
                </Text>

                {/* New Conversation Button */}
                <TouchableOpacity
                    onPress={onPress}
                    className="flex-row items-center bg-blue-600 w-full rounded-2xl p-1 pr-2 mb-6 shadow-md shadow-blue-500/20"
                >
                    <View className="bg-blue-500/30 w-12 h-12 rounded-xl items-center justify-center mr-3">
                        <MaterialIcons name="add" size={24} color="white" />
                    </View>
                    <Text className="flex-1 text-white font-semibold text-lg">New Conversation</Text>
                    <View className="bg-blue-500 p-2 rounded-lg">
                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                    </View>
                </TouchableOpacity>

                {/* Quick Prompts */}
                <View className="w-full gap-3">
                    {[
                        { icon: 'gavel', label: 'Legal advice' },
                        { icon: 'description', label: 'Document review' },
                        { icon: 'help-outline', label: 'General question' }
                    ].map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={onPress}
                            className="flex-row items-center justify-center bg-blue-100/50 dark:bg-slate-800/80 py-3 rounded-full border border-blue-200 dark:border-slate-700"
                        >
                            <MaterialIcons name={item.icon as any} size={18} color={theme === 'dark' ? '#60a5fa' : '#3b82f6'} className="mr-2" style={{ marginRight: 8 }} />
                            <Text className="text-blue-600 dark:text-blue-400 font-medium">{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

// === Quick Actions Grid ===
export const QuickActionsWidget = () => (
    <View className="mb-4">
        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</Text>
        <View className="flex-row gap-4 mb-4">
            {/* Find Lawyer */}
            <TouchableOpacity className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 items-center shadow-sm border border-gray-100 dark:border-white/10 h-40 justify-center">
                <View className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl items-center justify-center mb-3">
                    <MaterialIcons name="gavel" size={28} color="#3b82f6" />
                </View>
                <Text className="text-slate-900 dark:text-white font-semibold text-center">Find a Lawyer</Text>
            </TouchableOpacity>

            {/* Review Doc */}
            <TouchableOpacity className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 items-center shadow-sm border border-gray-100 dark:border-white/10 h-40 justify-center">
                <View className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl items-center justify-center mb-3">
                    <MaterialIcons name="description" size={28} color="#f97316" />
                </View>
                <Text className="text-slate-900 dark:text-white font-semibold text-center">Review Doc</Text>
            </TouchableOpacity>
        </View>

        <View className="flex-row gap-4">
            {/* My Cases */}
            <TouchableOpacity className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 items-center shadow-sm border border-gray-100 dark:border-white/10 h-40 justify-center">
                <View className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl items-center justify-center mb-3">
                    <View className="bg-green-100 dark:bg-green-900/40 p-1 rounded-lg">
                        <MaterialIcons name="folder-open" size={24} color="#22c55e" />
                    </View>
                </View>
                <Text className="text-slate-900 dark:text-white font-semibold text-center">My Cases</Text>
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 items-center shadow-sm border border-gray-100 dark:border-white/10 h-40 justify-center">
                <View className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="settings" size={28} color="#64748b" />
                </View>
                <Text className="text-slate-900 dark:text-white font-semibold text-center">Settings</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// === Recent AI Conversations Widget ===
export const RecentAIWidget = ({ chats = [], onContinue }: { chats?: any[], onContinue?: (id: string) => void }) => {
    // Mock if empty to show the UI design
    const displayChats = chats.length > 0 ? chats : [
        { _id: '1', title: "Fatherhood Responsibility Laws", description: "A father doesnt want to raise his children and denying his responsibilities...", date: "Recently" },
        { _id: '2', title: "Child Custody Legal Issues", description: "A father has left his underaged children with their maternal uncle...", date: "Recently" },
        { _id: '3', title: "Casual Greetings Exchange", description: "Hi", date: "Recently" },
    ];

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                    <MaterialIcons name="history" size={22} color="#94a3b8" />
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">Recent Conversations</Text>
                </View>
                <TouchableOpacity>
                    <View className="flex-row items-center">
                        <Text className="text-blue-600 font-medium text-sm mr-1">View All</Text>
                        <MaterialIcons name="chevron-right" size={18} color="#2563eb" />
                    </View>
                </TouchableOpacity>
            </View>

            {displayChats.slice(0, 3).map((chat, idx) => (
                <View key={idx} className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 dark:border-white/10">
                    <View className="flex-row justify-between mb-4">
                        <View className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl items-center justify-center">
                            <MaterialIcons name="chat-bubble-outline" size={20} color="#0f172a" />
                        </View>
                        <Text className="text-xs text-gray-400">{chat.date || 'Recently'}</Text>
                    </View>

                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">{chat.title || 'Untitled Chat'}</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5 mb-4" numberOfLines={3}>
                        {chat.description || chat.last_message || 'Start a conversation to see details here.'}
                    </Text>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="message" size={16} color="#94a3b8" />
                            <Text className="text-gray-400 text-xs">0 messages</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => onContinue && onContinue(chat._id)}
                            className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg flex-row items-center gap-2"
                        >
                            <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Continue</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#2563eb" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
};

// === All Cases Widget (Mocked for Visuals) ===
export const AllCasesWidget = () => {
    const cases = [
        { id: '#402-22', title: 'Civil Litigation', status: 'ACTIVE', progress: 65, color: '#3b82f6' },
        { id: '#105-23', title: 'Property Dispute', status: 'PENDING', progress: 15, color: '#f59e0b' },
        { id: '#309-21', title: 'Family Law', status: 'CLOSED', progress: 100, color: '#22c55e' },
    ];

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-slate-900 dark:text-white">All Cases</Text>
            </View>

            {cases.map((c, idx) => (
                <View key={idx} className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 dark:border-white/10">
                    <View className="flex-row justify-between items-start mb-2">
                        <View>
                            <Text className="text-base font-bold text-slate-900 dark:text-white mb-1">Case {c.id}</Text>
                            <Text className="text-gray-500 text-xs">{c.title}</Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${c.status === 'ACTIVE' ? 'bg-blue-100 dark:bg-blue-900/30' : c.status === 'PENDING' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                            <View className="flex-row items-center gap-1">
                                <View className={`w-1.5 h-1.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-blue-600' : c.status === 'PENDING' ? 'bg-orange-500' : 'bg-green-600'}`} />
                                <Text className={`text-[10px] font-bold ${c.status === 'ACTIVE' ? 'text-blue-700' : c.status === 'PENDING' ? 'text-orange-700' : 'text-green-700'}`}>{c.status}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mt-4">
                        <View className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                            <View
                                style={{ width: `${c.progress}%`, backgroundColor: c.color }}
                                className="h-full rounded-full"
                            />
                        </View>
                        <View className="flex-row justify-between mt-2">
                            <Text className="text-gray-400 text-xs">Progress</Text>
                            <Text className="text-gray-500 font-medium text-xs">{c.progress}%</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

// === Featured Lawyers Widget (Updated Card) ===
export interface Lawyer {
    _id: string;
    name: string;
    speciality?: string;
    profile_pic?: string;
    active?: boolean;
    rating?: number;
    review_count?: number;
    title?: string;
    quote?: string;
    img?: string;
}

export const FeaturedLawyersWidget = ({ lawyers = [], onLawyerPress }: { lawyers?: Lawyer[], onLawyerPress?: (id: string) => void }) => {
    const displayLawyers = lawyers.length > 0 ? lawyers : [
        { _id: 'f1', name: "Eleanor Vance", title: "Criminial Law", speciality: "Criminal Law", rating: 4.9, review_count: 0, img: "https://randomuser.me/api/portraits/women/44.jpg" },
        { _id: 'f2', name: "David Chen", title: "Corporate Law", speciality: "Business", rating: 4.8, review_count: 12, img: "https://randomuser.me/api/portraits/men/32.jpg" }
    ];

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">Featured Experts</Text>
                    <Text className="text-gray-500 text-sm">Connect with top-rated legal professionals</Text>
                </View>
                <View className="flex-row gap-2">
                    <TouchableOpacity className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                        <MaterialIcons name="chevron-left" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                        <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {displayLawyers.map((lawyer) => (
                    <TouchableOpacity
                        key={lawyer._id}
                        onPress={() => onLawyerPress && onLawyerPress(lawyer._id)}
                        activeOpacity={0.95}
                        className="w-[260px] mr-4 bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-white/10"
                    >
                        {/* Image Header with Badge */}
                        <View className="h-44 bg-gray-200 relative">
                            <Image
                                source={{ uri: lawyer.img || lawyer.profile_pic || 'https://via.placeholder.com/300' }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                            <View className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-full flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-green-400" />
                                <Text className="text-white text-[10px] font-semibold">Available Now</Text>
                            </View>

                            <TouchableOpacity className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full items-center justify-center">
                                <MaterialIcons name="bookmark" size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View className="p-4">
                            <Text className="text-slate-900 dark:text-white text-lg font-bold mb-1">{lawyer.name}</Text>
                            <Text className="text-gray-500 text-sm mb-3">{lawyer.title || lawyer.speciality}</Text>

                            <View className="flex-row items-center gap-1 mb-4">
                                <MaterialIcons name="star" size={16} color="black" />
                                <Text className="text-slate-900 dark:text-white font-bold">{lawyer.rating}</Text>
                                <Text className="text-gray-400 text-xs">({lawyer.review_count} reviews)</Text>
                            </View>

                            <View className="flex-row gap-2">
                                <TouchableOpacity className="flex-1 bg-blue-600 py-2.5 rounded-lg items-center flex-row justify-center gap-1">
                                    <MaterialIcons name="chat" size={16} color="white" />
                                    <Text className="text-white font-semibold text-xs">Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-gray-100 dark:bg-white/10 py-2.5 rounded-lg items-center flex-row justify-center gap-1">
                                    <MaterialIcons name="person" size={16} color="gray" />
                                    <Text className="text-gray-600 dark:text-gray-300 font-semibold text-xs">Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// === Saved Lawyers Widget (Simple Horizontal) ===
export const SavedLawyersWidget = ({ lawyers = [], onLawyerPress }: { lawyers?: Lawyer[], onLawyerPress: (id: string) => void }) => {
    if (!lawyers || lawyers.length === 0) return null;

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                    <View className="w-1 h-5 bg-yellow-400 rounded-full" />
                    <View>
                        <Text className="text-xl font-bold text-slate-900 dark:text-white">Saved</Text>
                        <Text className="text-2xl font-bold text-slate-900 dark:text-white -mt-1">Lawyers</Text>
                    </View>
                </View>

                <View className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full">
                    <Text className="text-orange-600 font-bold text-xs">{lawyers.length} saved</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#ea580c" style={{ marginLeft: 4 }} />
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {lawyers.map((lawyer, index) => (
                    <TouchableOpacity
                        key={lawyer._id || `saved-lawyer-${index}`}
                        onPress={() => onLawyerPress(lawyer._id)}
                        className="mr-4 items-center"
                    >
                        <View className="relative">
                            <Image
                                source={{ uri: lawyer.profile_pic || 'https://via.placeholder.com/150' }}
                                className="w-20 h-20 rounded-[24px] bg-gray-200 mb-2"
                            />
                            {/* Verified Badge */}
                            <View className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                                <MaterialIcons name="check-circle" size={16} color="#3b82f6" />
                            </View>
                        </View>
                        <Text className="text-slate-900 dark:text-white font-semibold text-sm w-20 text-center" numberOfLines={1}>{lawyer.name.split(' ')[0]}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
