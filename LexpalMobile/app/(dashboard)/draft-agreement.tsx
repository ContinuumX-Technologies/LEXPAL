import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function DraftAgreementScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    // Form State
    const [agreementType, setAgreementType] = useState('');
    const [partyA, setPartyA] = useState('');
    const [partyB, setPartyB] = useState('');
    const [keyTerms, setKeyTerms] = useState('');

    const handleGenerate = () => {
        if (!agreementType.trim() || !partyA.trim() || !partyB.trim()) {
            Alert.alert("Missing Info", "Please fill in the agreement type and parties involved.");
            return;
        }

        const prompt = `Please draft a ${agreementType} between ${partyA} and ${partyB}. 
Key terms/clauses to include:
${keyTerms || "Standard standard terms for this type of agreement."}

Please format it professionally with clauses numbered.`;

        router.push({ pathname: '/(dashboard)/ai-chat', params: { initialPrompt: prompt } });
    };

    const suggestions = ["NDA", "Rental Agreement", "Employment Contract", "Service Agreement"];

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F7] dark:bg-black" edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <View className="px-5 py-4 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm active:scale-95"
                    >
                        <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">Draft Agreement</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View className="mb-8 items-center">
                        <View className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full items-center justify-center mb-4">
                            <MaterialIcons name="edit-document" size={40} color="#9333ea" />
                        </View>
                        <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center">AI Legal Drafter</Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 px-6">
                            Fill in the details below and let Lexpal AI create a professional first draft for you.
                        </Text>
                    </View>

                    {/* Step 1: Type */}
                    <View className="bg-white dark:bg-[#1C1C1E] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 mb-5">
                        <Text className="text-sm font-bold text-gray-400 uppercase mb-3">1. Agreement Type</Text>
                        <TextInput
                            className="bg-[#f5f5f7] dark:bg-[#2f2f2f] rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white mb-3"
                            placeholder="e.g. Non-Disclosure Agreement"
                            placeholderTextColor="#94a3b8"
                            value={agreementType}
                            onChangeText={setAgreementType}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                            {suggestions.map(s => (
                                <TouchableOpacity
                                    key={s}
                                    onPress={() => setAgreementType(s)}
                                    className="bg-gray-100 dark:bg-[#333] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5"
                                >
                                    <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Step 2: Parties */}
                    <View className="bg-white dark:bg-[#1C1C1E] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 mb-5">
                        <Text className="text-sm font-bold text-gray-400 uppercase mb-3">2. Parties Involved</Text>

                        <Text className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5 pl-1">Party A (You/Disclosing)</Text>
                        <TextInput
                            className="bg-[#f5f5f7] dark:bg-[#2f2f2f] rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white mb-4"
                            placeholder="Full Name or Company"
                            placeholderTextColor="#94a3b8"
                            value={partyA}
                            onChangeText={setPartyA}
                        />

                        <Text className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5 pl-1">Party B (Other/Receiving)</Text>
                        <TextInput
                            className="bg-[#f5f5f7] dark:bg-[#2f2f2f] rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white"
                            placeholder="Full Name or Company"
                            placeholderTextColor="#94a3b8"
                            value={partyB}
                            onChangeText={setPartyB}
                        />
                    </View>

                    {/* Step 3: Terms */}
                    <View className="bg-white dark:bg-[#1C1C1E] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 mb-5">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-sm font-bold text-gray-400 uppercase">3. Key Terms (Optional)</Text>
                            <TouchableOpacity><Text className="text-blue-600 text-xs font-semibold">Examples</Text></TouchableOpacity>
                        </View>
                        <TextInput
                            className="bg-[#f5f5f7] dark:bg-[#2f2f2f] rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white min-h-[100px]"
                            placeholder="- Valid for 2 years&#10;- Jurisdiction: New York&#10;- Payment terms: Net 30"
                            placeholderTextColor="#94a3b8"
                            multiline
                            textAlignVertical="top"
                            value={keyTerms}
                            onChangeText={setKeyTerms}
                        />
                    </View>

                </ScrollView>

                <View className="p-5 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#1C1C1E]">
                    <TouchableOpacity
                        onPress={handleGenerate}
                        className="bg-[#9333ea] rounded-2xl py-4 items-center shadow-lg shadow-purple-500/30 active:bg-purple-700"
                    >
                        <Text className="text-white font-bold text-lg">Generate Draft</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
