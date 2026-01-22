import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationsScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');

    const { notifications, markAllRead } = useNotifications();

    const filteredNotifications = activeTab === 'All'
        ? notifications
        : notifications.filter(n => !n.read);

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F7] dark:bg-black" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 flex-row items-center justify-between z-10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] items-center justify-center shadow-sm"
                >
                    <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">Notifications</Text>
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] items-center justify-center shadow-sm"
                    onPress={markAllRead}
                >
                    <MaterialIcons name="done-all" size={22} color={theme === 'dark' ? 'white' : '#3b82f6'} />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View className="flex-row px-5 mb-4 gap-3">
                {['All', 'Unread'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab as any)}
                        className={`px-5 py-2 rounded-full border ${activeTab === tab
                            ? 'bg-black dark:bg-white border-transparent'
                            : 'bg-transparent border-gray-300 dark:border-gray-700'
                            }`}
                    >
                        <Text className={`font-semibold ${activeTab === tab
                            ? 'text-white dark:text-black'
                            : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notifications List */}
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {filteredNotifications.length === 0 ? (
                    <View className="items-center justify-center mt-20">
                        <View className="w-20 h-20 bg-gray-100 dark:bg-[#1C1C1E] rounded-full items-center justify-center mb-4">
                            <Ionicons name="notifications-off-outline" size={40} color="gray" />
                        </View>
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">No new notifications</Text>
                    </View>
                ) : (
                    filteredNotifications.map((note) => (
                        <TouchableOpacity
                            key={note.id}
                            activeOpacity={0.7}
                            className={`mb-3 p-4 rounded-2xl border ${note.read
                                ? 'bg-transparent border-transparent'
                                : 'bg-white dark:bg-[#1C1C1E] border-gray-100 dark:border-white/5 shadow-sm'
                                }`}
                        >
                            <View className="flex-row gap-4">
                                {/* Icon */}
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center"
                                    style={{ backgroundColor: `${note.color}20` }}
                                >
                                    <MaterialIcons name={note.icon as any} size={24} color={note.color} />
                                </View>

                                {/* Content */}
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start mb-1">
                                        <Text className={`text-base font-semibold ${note.read ? 'text-gray-600 dark:text-gray-400' : 'text-slate-900 dark:text-white'}`}>
                                            {note.title}
                                        </Text>
                                        <Text className="text-xs text-gray-400">{note.time}</Text>
                                    </View>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400 leading-5">
                                        {note.message}
                                    </Text>
                                </View>

                                {/* Unread Indicator */}
                                {!note.read && (
                                    <View className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
