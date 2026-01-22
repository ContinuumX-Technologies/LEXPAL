
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LayoutDashboard, Calendar, Sparkles, Users, Folder } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LawyerDashboardLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={85}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        tint="extraLight"
                    />
                ),
                tabBarActiveTintColor: '#1e3a8a', // Deep Blue
                tabBarInactiveTintColor: '#64748b', // Slate Gray
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    href: '/(lawyer-dashboard)',
                    title: 'Workplace',
                    tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} strokeWidth={2} />,
                }}
                listeners={{
                    tabPress: () => Haptics.selectionAsync(),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    href: null,
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} strokeWidth={2} />,
                }}
                listeners={{
                    tabPress: () => Haptics.selectionAsync(),
                }}
            />
            <Tabs.Screen
                name="ai-assistant"
                options={{
                    href: null,
                    title: 'Co-Pilot',
                    tabBarLabelStyle: {
                        fontWeight: '600',
                        color: '#1e3a8a'
                    },
                    tabBarIcon: ({ focused }) => (
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${focused ? 'bg-[#1e3a8a] shadow-sm' : 'bg-slate-100'}`}>
                            <Sparkles size={20} color={focused ? 'white' : '#64748b'} strokeWidth={2} />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: () => Haptics.selectionAsync(),
                }}
            />
            <Tabs.Screen
                name="clients"
                options={{
                    href: null,
                    title: 'Clients',
                    tabBarIcon: ({ color }) => <Users size={24} color={color} strokeWidth={2} />,
                }}
                listeners={{
                    tabPress: () => Haptics.selectionAsync(),
                }}
            />
            <Tabs.Screen
                name="documents"
                options={{
                    href: null,
                    title: 'Docs',
                    tabBarIcon: ({ color }) => <Folder size={24} color={color} strokeWidth={2} />,
                }}
                listeners={{
                    tabPress: () => Haptics.selectionAsync(),
                }}
            />
        </Tabs>
    );
}
