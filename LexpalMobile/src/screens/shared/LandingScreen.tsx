import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen() {
  const navigation = useNavigation<any>();
  const [userType, setUserType] = useState<'lawyer' | 'client'>('lawyer');

  const theme = userType === 'lawyer' 
    ? { bg: 'bg-slate-900', text: 'text-white', accent: 'bg-blue-600', sub: 'text-slate-300' }
    : { bg: 'bg-teal-50', text: 'text-slate-900', accent: 'bg-teal-600', sub: 'text-teal-800' };

  return (
    <SafeAreaView className={`flex-1 ${theme.bg}`}>
      <StatusBar barStyle={userType === 'lawyer' ? 'light-content' : 'dark-content'} />
      <View className="flex-1 px-6 pt-10">
        
        {/* Header Switcher */}
        <View className="flex-row justify-between items-center mb-10">
          <View className="flex-row items-center gap-2">
            <Ionicons name="briefcase" size={24} color={userType === 'lawyer' ? '#fff' : '#0f766e'} />
            <Text className={`text-xl font-bold ${theme.text}`}>Lexpal</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setUserType(t => t === 'lawyer' ? 'client' : 'lawyer')}
            className="px-4 py-2 bg-white/10 rounded-full border border-white/20"
          >
            <Text className={theme.text}>For {userType === 'lawyer' ? 'Clients' : 'Lawyers'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Content */}
        <View className="flex-1 justify-center">
          <Text className={`text-4xl font-extrabold mb-4 ${theme.text}`}>
            {userType === 'lawyer' ? 'Manage Cases.\nWin More.' : 'Find Justice.\nFast & Simple.'}
          </Text>
          <Text className={`text-lg mb-8 ${theme.sub}`}>
            {userType === 'lawyer' 
              ? 'AI-powered drafting, case tracking, and client management.' 
              : 'Connect with verified lawyers and track your case in real-time.'}
          </Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login', { userType })}
            className={`w-full py-4 rounded-xl items-center shadow-lg ${theme.accent}`}
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}