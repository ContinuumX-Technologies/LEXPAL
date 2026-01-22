
import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, user, userType } = useAuth();
  const [isSplashAnimationDone, setIsSplashAnimationDone] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Enforce minimum 2.5 seconds splash time for branding
    const timer = setTimeout(() => {
      setIsSplashAnimationDone(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSplashAnimationDone && !isLoading) {
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
  }, [isSplashAnimationDone, isLoading, user, userType]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar style="dark" />
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', gap: 16 }}>
        <MaterialIcons name="balance" size={80} color="#1d1d1f" />
        <Text className="text-4xl font-bold text-slate-900 tracking-tight uppercase">LEXPAL</Text>
      </Animated.View>
    </View>
  );
}
