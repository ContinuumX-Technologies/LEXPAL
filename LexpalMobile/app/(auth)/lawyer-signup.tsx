
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { languagesList, specialtiesList } from '../../constants/signupData';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LawyerSignup() {
    const router = useRouter();
    const { signIn } = useAuth();

    // Basic Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Added for validation

    // Professional Info
    const [experience, setExperience] = useState('');
    const [barNumber, setBarNumber] = useState('');
    const [about, setAbout] = useState('');

    // Selections
    const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggleSelection = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        currentSelection: string[],
        value: string,
        maxLimit?: number
    ) => {
        if (currentSelection.includes(value)) {
            setter(currentSelection.filter(item => item !== value));
        } else {
            if (maxLimit && currentSelection.length >= maxLimit) return;
            setter([...currentSelection, value]);
        }
    };

    const handleSignup = async () => {
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !experience || !barNumber || !about) {
            setError("Please fill in all required fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (selectedSpecialties.length === 0) {
            setError("Please select at least one specialty.");
            return;
        }
        if (selectedCourts.length === 0) {
            setError("Please select at least one court.");
            return;
        }
        if (selectedLanguages.length === 0) {
            setError("Please select at least one language.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                firstName,
                lastName,
                email,
                password,
                experience: parseInt(experience, 10), // Ensure experience is a number
                barNumber,
                about,
                courts: selectedCourts,
                languages: selectedLanguages,
                specialties: selectedSpecialties
            };

            const response = await api.post('/api/auth/lawyer-signup', payload);

            // If API returns token immediately
            if (response.data.token) {
                const { token, user } = response.data;
                await signIn('lawyer', token, user);
                router.replace('/(lawyer-dashboard)');
            } else {
                // If no token, maybe it's a pending verification or just redirects to login
                router.replace('/(auth)/lawyer-login');
            }

        } catch (err: any) {
            console.error("Lawyer Signup Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Registration failed. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    const MultiSelectSection = ({ title, options, currentSelection, setter, maxLimit }: { title: string, options: string[], currentSelection: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, maxLimit?: number }) => (
        <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-3">{title}</Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((opt) => {
                    const isSelected = currentSelection.includes(opt);
                    return (
                        <Pressable
                            key={opt}
                            onPress={() => handleToggleSelection(setter, currentSelection, opt, maxLimit)}
                            className={`px-3 py-2 rounded-lg border ${isSelected ? 'bg-blue-900 border-blue-900' : 'bg-white border-gray-200'}`}
                        >
                            <Text className={`${isSelected ? 'text-white' : 'text-gray-600'} text-sm font-medium`}>{opt}</Text>
                        </Pressable>
                    )
                })}
            </View>
        </View>
    );

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
                        <View className="flex-row items-center justify-between mb-8 mt-2">
                            <View className="flex-row items-center gap-2">
                                <MaterialIcons name="shield" size={24} color="#1e3a8a" />
                                <Text className="text-base font-bold text-slate-900 tracking-tight uppercase">LEXPAL PRO</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.push('/')}>
                                <Text className="text-gray-500 font-medium uppercase text-xs tracking-wider">Exit Console</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Header */}
                        <View className="mb-8">
                            <Text className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Advocate Registration.</Text>
                            <Text className="text-gray-500 text-base leading-relaxed">
                                Join the exclusive network of legal professionals.
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="w-full mx-auto pb-10">
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <TextInput label="First Name" value={firstName} onChangeText={setFirstName} />
                                </View>
                                <View className="flex-1">
                                    <TextInput label="Last Name" value={lastName} onChangeText={setLastName} />
                                </View>
                            </View>

                            <TextInput label="Professional Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
                                </View>
                                <View className="flex-1">
                                    <TextInput label="Confirm" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                                </View>
                            </View>

                            <TextInput label="Experience (Years)" value={experience} onChangeText={setExperience} keyboardType="numeric" />
                            <TextInput label="Bar License Number" value={barNumber} onChangeText={setBarNumber} />

                            <MultiSelectSection
                                title="Courts Practicing"
                                options={["District Court", "High Court", "Supreme Court"]}
                                currentSelection={selectedCourts}
                                setter={setSelectedCourts}
                            />

                            <MultiSelectSection
                                title="Languages"
                                options={languagesList.slice(0, 8)} // Show top 8
                                currentSelection={selectedLanguages}
                                setter={setSelectedLanguages}
                            />

                            <MultiSelectSection
                                title="Specialties (Max 3)"
                                options={specialtiesList}
                                currentSelection={selectedSpecialties}
                                setter={setSelectedSpecialties}
                                maxLimit={3}
                            />

                            <TextInput label="About You" value={about} onChangeText={setAbout} multiline numberOfLines={3} containerClassName="h-32" />

                            {error && <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>}

                            <Button
                                title={loading ? "Processing..." : "Submit Application"}
                                onPress={handleSignup}
                                className="bg-[#1e3a8a] h-14 rounded-xl mt-4"
                                textClassName="text-white text-lg font-semibold"
                                disabled={loading}
                            />

                            <View className="mt-8 items-center pb-8">
                                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                                    <Text className="text-gray-500 font-medium">
                                        Are you a Client? <Text className="text-slate-900 font-semibold">Register here →</Text>
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('/(auth)/lawyer-login')} className="mt-4">
                                    <Text className="text-gray-500 font-medium">
                                        Already have an account? <Text className="text-blue-800 font-semibold">Sign in</Text>
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
