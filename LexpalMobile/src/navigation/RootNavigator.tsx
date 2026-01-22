import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LandingScreen from '../screens/shared/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LawyerDashboard from '../screens/lawyer/Dashboard';
import ClientDashboard from '../screens/client/Dashboard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Auth Stack (Unprotected)
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}

// 2. Lawyer Tabs (Protected)
function LawyerTabs() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#334155' },
            tabBarActiveTintColor: '#3b82f6'
        }}>
            <Tab.Screen
                name="Dashboard"
                component={LawyerDashboard}
                options={{ tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} /> }}
            />
            <Tab.Screen
                name="Cases"
                component={LawyerDashboard} // Placeholder
                options={{ tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} /> }}
            />
        </Tab.Navigator>
    );
}

// 3. Client Tabs (Protected)
function ClientTabs() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#fff' },
            tabBarActiveTintColor: '#0d9488'
        }}>
            <Tab.Screen
                name="Home"
                component={ClientDashboard}
                options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }}
            />
            <Tab.Screen
                name="Find Lawyer"
                component={ClientDashboard} // Placeholder
                options={{ tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }}
            />
        </Tab.Navigator>
    );
}

// 4. Root Switcher
export default function RootNavigator() {
    const { userToken, userType } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {userToken ? (
                userType === 'lawyer' ? <LawyerTabs /> : <ClientTabs />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
}