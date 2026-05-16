
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, user, userType } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (userType === 'lawyer') {
          router.replace('/(lawyer-dashboard)');
        } else {
          router.replace('/(dashboard)');
        }
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, user, userType]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar style="light" />
    </View>
  );
}
