
import React, { createContext, useState, useContext, useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'nativewind';

// Enable LayoutAnimation on Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [theme, setTheme] = useState<Theme>((colorScheme as Theme) || 'light');

    useEffect(() => {
        // Load persisted theme preference
        const loadTheme = async () => {
            const savedTheme = await SecureStore.getItemAsync('user_theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setTheme(savedTheme);
                setColorScheme(savedTheme);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setColorScheme(newTheme);
        await SecureStore.setItemAsync('user_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
