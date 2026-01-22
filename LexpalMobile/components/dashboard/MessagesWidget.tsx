import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Edit2, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export interface ChatListItem {
    userId: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    online?: boolean;
}

const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const MessagesWidget = ({ chats, loading }: { chats: ChatListItem[], loading: boolean }) => {
    const router = useRouter();
    const { theme } = useTheme();

    const handleSeeAll = () => {
        router.push('/(dashboard)/messages' as any);
    };

    const handleChatClick = (userId: string) => {
        router.push(`/(dashboard)/messages/${userId}` as any);
    };

    const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
    const isEmpty = !loading && chats.length === 0;

    return (
        <View className="mb-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4 px-1">
                <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 items-center justify-center rounded-xl bg-green-500 shadow-sm shadow-green-500/30">
                        <MessageSquare size={20} color="white" fill="white" />
                    </View>
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">Messages</Text>
                    {!loading && !isEmpty && totalUnread > 0 && (
                        <View className="bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                            <Text className="text-xs font-semibold text-green-600 dark:text-green-400">{totalUnread} new</Text>
                        </View>
                    )}
                </View>

                {!loading && !isEmpty && (
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 active:scale-95">
                            <Edit2 size={20} color={theme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSeeAll} className="flex-row items-center gap-1 pl-2 active:opacity-60">
                            <Text className="text-green-500 font-semibold text-sm">See All</Text>
                            <ChevronRight size={16} color="#22c55e" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Content */}
            <View className="bg-white dark:bg-[#1c1c1e] rounded-[24px] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
                {loading ? (
                    <View className="p-4 gap-4">
                        {[1, 2, 3].map(i => (
                            <View key={i} className="flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse" />
                                <View className="flex-1 gap-2">
                                    <View className="h-4 w-40 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                    <View className="h-3 w-60 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                </View>
                            </View>
                        ))}
                    </View>
                ) : isEmpty ? (
                    <View className="items-center justify-center py-8 px-6">
                        <View className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full items-center justify-center mb-3">
                            <MessageSquare size={24} color={theme === 'dark' ? '#555' : '#ccc'} />
                        </View>
                        <Text className="text-base font-semibold text-slate-900 dark:text-white mb-1">No chats</Text>
                        <TouchableOpacity onPress={() => router.push('/(dashboard)/messages' as any)} className="mt-2">
                            <Text className="text-green-500 font-medium">Start a chat</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        {chats.slice(0, 3).map((chat, index) => {
                            const hasUnread = chat.unreadCount > 0;
                            const isLast = index === Math.min(chats.length, 3) - 1;

                            return (
                                <TouchableOpacity
                                    key={chat.userId}
                                    onPress={() => handleChatClick(chat.userId)}
                                    className="flex-row items-center pl-4 bg-white dark:bg-[#1c1c1e] active:bg-gray-50 dark:active:bg-white/5"
                                >
                                    {/* Avatar */}
                                    <View className="relative mr-3 my-3">
                                        {chat.profile_pic ? (
                                            <Image source={{ uri: chat.profile_pic }} className="w-[50px] h-[50px] rounded-full bg-gray-200" />
                                        ) : (
                                            <View className="w-[50px] h-[50px] rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
                                                <Text className="text-lg font-medium text-gray-500 dark:text-gray-300">
                                                    {(chat.first_name?.[0] || "")}{(chat.last_name?.[0] || "")}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Content */}
                                    <View className={`flex-1 pr-4 py-3 justify-center min-h-[72px] ${!isLast ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                                        <View className="flex-row justify-between items-baseline mb-0.5">
                                            <Text className="text-[16px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                                                {chat.first_name} {chat.last_name}
                                            </Text>
                                            <Text className={`text-[12px] ${hasUnread ? 'text-[#007AFF]' : 'text-gray-400'}`}>
                                                {formatTime(chat.lastMessageAt)}
                                            </Text>
                                        </View>

                                        <View className="flex-row justify-between items-center">
                                            <Text numberOfLines={2} className={`text-[14px] flex-1 mr-2 leading-[18px] ${hasUnread ? 'text-black dark:text-gray-200' : 'text-gray-500'}`}>
                                                {chat.lastMessage || "No messages yet"}
                                            </Text>
                                            {hasUnread && (
                                                <View className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#007AFF] items-center justify-center">
                                                    <Text className="text-[10px] font-bold text-white">
                                                        {chat.unreadCount}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>
        </View>
    );
};
