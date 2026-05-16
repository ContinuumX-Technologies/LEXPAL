import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();

    // Mock settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    const handleLogout = () => {
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

    const SettingItem = ({ icon, label, value, type = 'arrow', color = '#64748b' }: any) => (
        <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 active:bg-gray-50 dark:active:bg-white/5 px-5"
            disabled={type === 'switch'}
        >
            <View className="flex-row items-center gap-4">
                <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 items-center justify-center">
                    <Ionicons name={icon} size={18} color={color} />
                </View>
                <Text className="text-base font-medium text-slate-900 dark:text-white">{label}</Text>
            </View>

            {type === 'switch' && (
                <Switch
                    value={value}
                    onValueChange={toggleTheme} // Specific logic for theme, generic for others
                    trackColor={{ false: '#767577', true: '#2563eb' }}
                    thumbColor={Platform.OS === 'android' ? '#f4f3f4' : ''}
                />
            )}

            {type === 'arrow' && (
                <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            )}
            {type === 'info' && (
                <Text className="text-gray-400 text-sm">{value}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F7] dark:bg-black" edges={['top', 'left', 'right']}>
            <View className="px-5 py-4 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm active:scale-95"
                >
                    <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">Settings</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1">
                {/* Profile Section */}
                <View className="items-center py-6">
                    <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <Text className="text-4xl font-bold text-white">{(user?.first_name || user?.name || "C").charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">{user?.first_name} {user?.last_name || ''}</Text>
                    <Text className="text-gray-500 text-sm">{user?.email || 'client@example.com'}</Text>
                    <View className="mt-3 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        <Text className="text-xxs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Premium Plan</Text>
                    </View>
                </View>

                {/* Settings Groups */}
                <View className="bg-white dark:bg-[#1C1C1E] mt-4 mb-4">
                    <Text className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">Preferences</Text>

                    <View className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 px-5">
                        <View className="flex-row items-center gap-4">
                            <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 items-center justify-center">
                                <Ionicons name="moon" size={18} color="#6366f1" />
                            </View>
                            <Text className="text-base font-medium text-slate-900 dark:text-white">Dark Mode</Text>
                        </View>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
                            thumbColor={'#fff'}
                        />
                    </View>

                    <View className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 px-5">
                        <View className="flex-row items-center gap-4">
                            <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 items-center justify-center">
                                <Ionicons name="notifications" size={18} color="#f59e0b" />
                            </View>
                            <Text className="text-base font-medium text-slate-900 dark:text-white">Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#e2e8f0', true: '#f59e0b' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>

                <View className="bg-white dark:bg-[#1C1C1E] mb-8">
                    <Text className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">Account</Text>
                    <SettingItem icon="person" label="Personal Details" type="arrow" color="#3b82f6" />
                    <SettingItem icon="lock-closed" label="Security" type="arrow" color="#ef4444" />
                    <SettingItem icon="document-text" label="Subscription" type="arrow" color="#10b981" />
                    <SettingItem icon="help-circle" label="Help & Support" type="arrow" color="#8b5cf6" />
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="container mx-auto mx-5 mb-10 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 py-4 rounded-xl items-center"
                >
                    <Text className="text-red-600 dark:text-red-400 font-bold">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-400 text-xs mb-8">v1.2.0 • Build 2405</Text>

            </ScrollView>
        </SafeAreaView>
    );
}
