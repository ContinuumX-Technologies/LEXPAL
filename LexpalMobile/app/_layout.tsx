
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme, View, Image, Animated, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../context/ThemeContext';
import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            // We defer SplashScreen.hideAsync() to InnerLayout when Auth is also ready
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <CustomThemeProvider>
            <RootLayoutNav />
        </CustomThemeProvider>
    );
}


function InnerLayout() {
    const { theme } = useTheme();
    const { isLoading } = useAuth();
    const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync().then(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setSplashAnimationFinished(true);
                });
            });
        }
    }, [isLoading]);

    return (
        <SafeAreaProvider>
            <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
                <View style={{ flex: 1, backgroundColor: '#000000' }}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(dashboard)" />
                        <Stack.Screen name="(lawyer-dashboard)" />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                    {!splashAnimationFinished && (
                        <Animated.View
                            pointerEvents="none"
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    backgroundColor: '#000000',
                                    opacity: fadeAnim,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 99999,
                                },
                            ]}>
                            <MaterialIcons name="balance" size={80} color="#ffffff" />
                            <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white', letterSpacing: 1, textTransform: 'uppercase', marginTop: 16 }}>LEXPAL</Text>
                        </Animated.View>
                    )}
                </View>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

function RootLayoutNav() {
    return (
        <AuthProvider>
            <InnerLayout />
        </AuthProvider>
    );
}
