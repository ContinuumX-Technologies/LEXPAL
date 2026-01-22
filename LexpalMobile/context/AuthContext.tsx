
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

type UserType = 'client' | 'lawyer' | null;

interface AuthState {
    user: any | null;
    userType: UserType;
    isLoading: boolean;
    signIn: (type: 'client' | 'lawyer', token: string, userData: any) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
    user: null,
    userType: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [userType, setUserType] = useState<UserType>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const token = await SecureStore.getItemAsync('auth_token');
                const storedUser = await SecureStore.getItemAsync('user_data');
                const storedType = await SecureStore.getItemAsync('user_type');

                if (token && storedUser && storedType) {
                    setUser(JSON.parse(storedUser));
                    setUserType(storedType as UserType);
                    // Optional: Validate token with backend here
                }
            } catch (e) {
                console.error('Failed to load session', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, []);

    const signIn = async (type: 'client' | 'lawyer', token: string, userData: any) => {
        try {
            if (token && typeof token === 'string') {
                await SecureStore.setItemAsync('auth_token', token);
            } else {
                console.warn("AuthContext: No valid token provided to signIn");
            }

            if (userData) {
                await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
                setUser(userData);
            }

            await SecureStore.setItemAsync('user_type', type);
            setUserType(type);
        } catch (error) {
            console.error("Sign in error", error);
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync('auth_token');
            await SecureStore.deleteItemAsync('user_data');
            await SecureStore.deleteItemAsync('user_type');
            setUser(null);
            setUserType(null);
            // Navigation must be handled by the component calling signOut
        } catch (e) {
            console.error('Sign out error', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userType, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
