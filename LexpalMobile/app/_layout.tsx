
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
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
            SplashScreen.hideAsync();
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

function RootLayoutNav() {
    const { theme } = useTheme();

    return (
        <AuthProvider>
            <SafeAreaProvider>
                <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(dashboard)" />
                        <Stack.Screen name="(lawyer-dashboard)" />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                </ThemeProvider>
            </SafeAreaProvider>
        </AuthProvider>
    );

}
