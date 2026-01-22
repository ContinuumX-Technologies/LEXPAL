
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { House, Search, Sparkles, MessageCircle, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { NotificationProvider } from '../../context/NotificationContext';

export default function DashboardLayout() {
    const { theme } = useTheme();

    return (
        <NotificationProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 20,
                        marginHorizontal: 80,
                        elevation: 0,
                        backgroundColor: 'transparent',
                        borderRadius: 30,
                        height: 60,
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 15,
                        paddingBottom: 0, // Centered vertically
                    },
                    tabBarBackground: () => (
                        <View style={{ borderRadius: 30, overflow: 'hidden', height: 60, width: '100%' }}>
                            <BlurView
                                intensity={60}
                                style={{
                                    flex: 1,
                                    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                                }}
                                tint={theme === 'dark' ? 'dark' : 'light'}
                            />
                        </View>
                    ),
                    tabBarShowLabel: false, // Cleaner look for dynamic island
                    tabBarActiveTintColor: theme === 'dark' ? '#0A84FF' : '#007AFF', // Apple Blue (Light/Dark variants)
                    tabBarInactiveTintColor: theme === 'dark' ? '#98989D' : '#8E8E93', // Apple Gray (Light/Dark variants)
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <View style={{ top: Platform.OS === 'ios' ? 10 : 0 }}><House size={24} color={color} strokeWidth={2} /></View>,
                    }}
                    listeners={{
                        tabPress: () => Haptics.selectionAsync(),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        href: null, // Hidden for now
                        title: 'Search',
                        tabBarIcon: ({ color }) => <View style={{ top: Platform.OS === 'ios' ? 10 : 0 }}><Search size={24} color={color} strokeWidth={2.5} /></View>,
                    }}
                    listeners={{
                        tabPress: () => Haptics.selectionAsync(),
                    }}
                />
                <Tabs.Screen
                    name="ai-chat"
                    options={{
                        title: 'Lexpal AI',
                        tabBarLabelStyle: {
                            fontWeight: '600',
                            color: '#007AFF'
                        },
                        tabBarIcon: ({ focused }) => (
                            <View className={`w-10 h-10 items-center justify-center rounded-full ${focused ? (theme === 'dark' ? 'bg-[#0A84FF] shadow-sm' : 'bg-[#007AFF] shadow-md') : (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')}`} style={{ top: Platform.OS === 'ios' ? 10 : 0 }}>
                                <Sparkles size={20} color={focused ? 'white' : (theme === 'dark' ? '#9CA3AF' : '#666')} strokeWidth={2} />
                            </View>
                        ),
                    }}
                    listeners={{
                        tabPress: () => Haptics.selectionAsync(),
                    }}
                />
                <Tabs.Screen
                    name="messages/index"
                    options={{
                        title: 'Messages',
                        tabBarIcon: ({ color }) => <View style={{ top: Platform.OS === 'ios' ? 10 : 0 }}><MessageCircle size={24} color={color} strokeWidth={2} /></View>,
                    }}
                    listeners={{
                        tabPress: () => Haptics.selectionAsync(),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        href: null, // Hidden for now
                        title: 'Profile',
                        tabBarIcon: ({ color }) => <View style={{ top: Platform.OS === 'ios' ? 10 : 0 }}><User size={24} color={color} strokeWidth={2} /></View>,
                    }}
                    listeners={{
                        tabPress: () => Haptics.selectionAsync(),
                    }}
                />
                <Tabs.Screen
                    name="messages/[id]"
                    options={{
                        href: null,
                        tabBarStyle: { display: 'none' },
                    }}
                />
                <Tabs.Screen
                    name="notifications"
                    options={{
                        href: null,
                        title: 'Notifications',
                        tabBarStyle: { display: 'none' },
                    }}
                />
            </Tabs>
        </NotificationProvider>
    );
}
