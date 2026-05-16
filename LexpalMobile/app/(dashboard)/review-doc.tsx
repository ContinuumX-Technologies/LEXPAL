import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function ReviewDocScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
    const [textInput, setTextInput] = useState('');

    const handleAnalyze = () => {
        if (activeTab === 'text' && !textInput.trim()) {
            Alert.alert("Input Required", "Please paste the text you want to analyze.");
            return;
        }

        // Navigate to AI Chat with prompt
        // Ideally we would pass this as params. `ai-chat.tsx` needs to handle `initialMessage` param.
        // For now, we simulate this workflow.

        let prompt = "Please review this document/text for me and highlight any risks:\n\n";
        if (activeTab === 'text') {
            prompt += textInput;
        } else {
            prompt = "I have attached a document for review. Please analyze it.";
            // File attachment logic needs real implementation (picking file, uploading, getting ID).
            Alert.alert("Coming Soon", "File upload is coming in the next update. Please use text paste for now.");
            return;
        }

        // We'll pass the prompt to the chat screen via params if we update chat screen to accept it, 
        // OR we can just instruct the user.
        // Let's assume we update ai-chat to handle `initialPrompt`
        router.push({ pathname: '/(dashboard)/ai-chat', params: { initialPrompt: prompt } });
    };

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
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">Review Document</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
                    <Text className="text-gray-500 dark:text-gray-400 text-center mb-6 px-4">
                        Upload a contract, agreement, or legal text for instant AI analysis and risk detection.
                    </Text>

                    {/* Tabs */}
                    <View className="flex-row bg-gray-200 dark:bg-[#1C1C1E] p-1 rounded-xl mb-6">
                        <TouchableOpacity
                            onPress={() => setActiveTab('text')}
                            className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'text' ? 'bg-white dark:bg-[#333] shadow-sm' : ''}`}
                        >
                            <Text className={`font-semibold ${activeTab === 'text' ? 'text-slate-900 dark:text-white' : 'text-gray-500'}`}>Paste Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('file')}
                            className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'file' ? 'bg-white dark:bg-[#333] shadow-sm' : ''}`}
                        >
                            <Text className={`font-semibold ${activeTab === 'file' ? 'text-slate-900 dark:text-white' : 'text-gray-500'}`}>Upload File</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'text' ? (
                        <View className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-4 shadow-sm min-h-[300px] border border-gray-100 dark:border-white/10">
                            <TextInput
                                className="flex-1 text-base text-slate-900 dark:text-white"
                                placeholder="Paste your legal text here..."
                                placeholderTextColor="#94a3b8"
                                multiline
                                textAlignVertical="top"
                                value={textInput}
                                onChangeText={setTextInput}
                            />
                            {textInput.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => { setTextInput(''); Keyboard.dismiss(); }}
                                    className="absolute top-4 right-4 bg-gray-100 dark:bg-[#333] p-1 rounded-full"
                                >
                                    <Ionicons name="close" size={16} color="#666" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => Alert.alert("Upload", "File picker not implemented.")}
                            className="bg-white dark:bg-[#1C1C1E] rounded-3xl border-2 border-dashed border-gray-300 dark:border-[#333] h-[300px] items-center justify-center gap-4"
                        >
                            <View className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center">
                                <MaterialIcons name="cloud-upload" size={40} color="#3b82f6" />
                            </View>
                            <View>
                                <Text className="text-center font-bold text-slate-900 dark:text-white text-lg">Tap to Upload</Text>
                                <Text className="text-center text-gray-500 mt-1">PDF, DOCX, TXT up to 10MB</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View className="mt-6 flex-row gap-3 flex-wrap">
                        <Text className="text-xs font-bold text-gray-400 uppercase w-full mb-1">Privacy Note</Text>
                        <View className="flex-row items-start gap-2">
                            <MaterialIcons name="lock" size={14} color="#22c55e" style={{ marginTop: 2 }} />
                            <Text className="text-xs text-gray-500 flex-1 leading-4">Your documents are processed securely and encrpyted. Lexpal AI does not store sensitive legal data permanently.</Text>
                        </View>
                    </View>

                </ScrollView>

                <View className="p-5 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#1C1C1E]">
                    <TouchableOpacity
                        onPress={handleAnalyze}
                        className="bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-500/30 active:bg-blue-700"
                    >
                        <Text className="text-white font-bold text-lg">Analyze Document</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
