
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LawyerLogin() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Use your secure credentials to verify identity.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/auth/lawyer-login', { email, password });

            // Assuming response structure: { token: "...", lawyer: { ... } }
            const { token, lawyer } = response.data;

            await signIn('lawyer', token, lawyer);
            router.replace('/(lawyer-dashboard)');

        } catch (err: any) {
            console.error("Lawyer Login Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Authentication failed. Access denied.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="relative bg-white">

                    {/* Background Mesh Gradient - Subtle */}
                    <View className="absolute top-0 left-0 right-0 h-64 overflow-hidden -z-10 opacity-30">
                        <LinearGradient
                            colors={['rgba(30, 58, 138, 0.1)', 'rgba(255,255,255,0)']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={{ flex: 1 }}
                        />
                    </View>

                    <View className="px-6 py-4 flex-1">
                        {/* Nav */}
                        <View className="flex-row items-center justify-between mb-12 mt-2">
                            <View className="flex-row items-center gap-2">
                                <MaterialIcons name="shield" size={24} color="#1e3a8a" />
                                <Text className="text-base font-bold text-slate-900 tracking-tight uppercase">LEXPAL</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.push('/(auth)/' as any)}>
                                {/* Actually back to landing, or generic back */}
                                <Text className="text-gray-500 font-medium uppercase text-xs tracking-wider" onPress={() => router.push('/')}>Exit Console</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Header */}
                        <View className="mb-10">
                            <Text className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Advocate Access</Text>
                            <View className="flex-row items-center gap-1">
                                <Text className="text-gray-500 text-base">Workspace locked.</Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/lawyer-signup' as any)}>
                                    <Text className="text-blue-800 font-medium text-base">Request access</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form */}
                        <View className="w-full max-w-md mx-auto">
                            <TextInput
                                label="Professional Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                label="Secure Key (Password)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                error={error && !password ? "Key is required" : undefined}
                            />

                            {error && (
                                <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
                            )}

                            <View className="mt-8 gap-4">
                                <Button
                                    title={loading ? "Verifying..." : "Authenticate"}
                                    onPress={handleLogin}
                                    // Using a custom deep blue for lawyers
                                    className="bg-[#1e3a8a] h-14 rounded-xl"
                                    textClassName="text-white text-lg font-semibold"
                                    disabled={loading}
                                />

                                <View className="flex-row items-center my-4">
                                    <View className="flex-1 h-[1px] bg-gray-200" />
                                    <Text className="mx-4 text-gray-400 text-xs uppercase tracking-wider">or authenticate with</Text>
                                    <View className="flex-1 h-[1px] bg-gray-200" />
                                </View>

                                <Button
                                    title="Workplace Account"
                                    onPress={() => console.log('Google Auth')}
                                    variant="secondary"
                                    icon={<FontAwesome name="google" size={18} color="#EA4335" />}
                                    className="h-14 rounded-xl border-gray-300"
                                    textClassName="text-gray-700 text-base font-medium"
                                />
                            </View>

                            {/* Footer Link */}
                            <View className="mt-12 items-center">
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                    <Text className="text-gray-500 font-medium">
                                        Are you a Client? <Text className="text-slate-900 font-semibold">Login here →</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
