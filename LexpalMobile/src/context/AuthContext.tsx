import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<'lawyer' | 'client'>('lawyer');

  // Check login status on app launch
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const type = await SecureStore.getItemAsync('userType');
        if (token) {
          setUserToken(token);
          if (type) setUserType(type as 'lawyer' | 'client');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async (token: string, type: 'lawyer' | 'client') => {
    setUserToken(token);
    setUserType(type);
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userType', type);
  };

  const logout = async () => {
    setUserToken(null);
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userType');
  };

  return (
    <AuthContext.Provider value={{ login, logout, userToken, userType, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};