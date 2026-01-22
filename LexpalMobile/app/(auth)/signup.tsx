
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { stateCityMap } from '../../constants/signupData';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
    const router = useRouter();
    const { signIn } = useAuth();

    // Using individual state variables for better control
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [state, setState] = useState(''); // Restore if needed
    // const [city, setCity] = useState('');   // Restore if needed

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Adjust payload to match your backend expectations
            const payload = {
                firstName,
                lastName,
                email,
                password,
                // state, 
                // city
            };

            const response = await api.post('/api/auth/user-signup', payload);

            // If API returns token immediately
            if (response.data.token) {
                const { token, user } = response.data;
                await signIn('client', token, user);
                router.replace('/(dashboard)');
            } else {
                // Determine flow: login or verify email?
                // For now, assume login redirect
                router.replace('/(auth)/login');
            }

        } catch (err: any) {
            console.error("Signup Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
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
                    <View className="flex-row items-center justify-between mb-8 mt-2">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="balance" size={24} color="#1d1d1f" />
                            <Text className="text-base font-bold text-slate-900 tracking-tight uppercase">LEXPAL</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/')}>
                            <Text className="text-gray-500 font-medium uppercase text-xs tracking-wider">Exit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Join the</Text>
                        <Text className="text-4xl font-bold text-transparent bg-clip-text text-slate-400 mb-3 tracking-tight">Revolution.</Text>
                        <Text className="text-gray-500 text-base leading-relaxed">
                            Create your account to access top-tier legal management tools.
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="w-full mx-auto">
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <TextInput
                                    label="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View className="flex-1">
                                <TextInput
                                    label="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>

                        <TextInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* State/City - Temporarily removed or simplified if needed, keeping simple for now */}

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {error && (
                            <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
                        )}

                        <View className="mt-6 gap-4">
                            <Button
                                title={loading ? "Creating Account..." : "Sign Up"}
                                onPress={handleSignup}
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
                                title="Sign up with Google"
                                onPress={() => console.log('Google Auth')}
                                variant="secondary"
                                icon={<FontAwesome name="google" size={18} color="#EA4335" />}
                                className="h-14 rounded-xl border-gray-300"
                                textClassName="text-gray-700 text-base font-medium"
                            />

                            <Text className="text-xs text-center text-gray-400 mt-2">
                                By signing up, you agree to our Terms of Service & Privacy Policy.
                            </Text>
                        </View>

                        {/* Footer Link */}
                        <View className="mt-10 mb-8 items-center">
                            <TouchableOpacity onPress={() => router.push('/(auth)/lawyer-signup')}>
                                <Text className="text-gray-500 font-medium">
                                    Are you a Lawyer? <Text className="text-slate-900 font-semibold">Register here →</Text>
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-4">
                                <Text className="text-gray-500 font-medium">
                                    Already a member? <Text className="text-blue-600 font-semibold">Log in</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
