
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/auth/user-login', { email, password });

            // Assuming response structure: { token: "...", user: { ... } }
            // Adjust based on your actual server response
            const { token, user } = response.data;

            await signIn('client', token, user);
            router.replace('/(dashboard)');

        } catch (err: any) {
            console.error("Login Check:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">

                    {/* Nav */}
                    <View className="flex-row items-center justify-between mb-12 mt-2">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="balance" size={24} color="#1d1d1f" />
                            <Text className="text-base font-bold text-slate-900 tracking-tight uppercase">LEXPAL</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-gray-500 font-medium uppercase text-xs tracking-wider">Exit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Header */}
                    <View className="mb-10">
                        <Text className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Client Access</Text>
                        <View className="flex-row items-center gap-1">
                            <Text className="text-gray-500 text-base">New to Lexpal?</Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
                                <Text className="text-blue-600 font-medium text-base">Create an account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form */}
                    <View className="w-full max-w-md mx-auto">
                        <TextInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {error && (
                            <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
                        )}

                        <View className="mt-8 gap-4">
                            <Button
                                title={loading ? "Verifying..." : "Sign In"}
                                onPress={handleLogin}
                                variant="primary"
                                className="h-14 rounded-xl"
                                textClassName="text-lg"
                                disabled={loading}
                            />

                            <View className="flex-row items-center my-4">
                                <View className="flex-1 h-[1px] bg-gray-200" />
                                <Text className="mx-4 text-gray-400 text-xs uppercase tracking-wider">or</Text>
                                <View className="flex-1 h-[1px] bg-gray-200" />
                            </View>

                            <Button
                                title="Continue with Google"
                                onPress={() => console.log('Google Auth')}
                                variant="secondary"
                                icon={<FontAwesome name="google" size={18} color="#EA4335" />}
                                className="h-14 rounded-xl border-gray-300"
                                textClassName="text-gray-700 text-base font-medium"
                            />
                        </View>

                        {/* Footer Link */}
                        <View className="mt-12 items-center">
                            <TouchableOpacity onPress={() => router.push('/(auth)/lawyer-login')}>
                                <Text className="text-gray-500 font-medium">
                                    Are you a Lawyer? <Text className="text-slate-900 font-semibold">Login here →</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
