
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <View className="bg-white border-t border-gray-100 py-12 px-6">
            <View className="mb-8">
                <View className="flex-row items-center mb-4">
                    <Text className="text-xl font-bold text-slate-900">Lexpal</Text>
                </View>
                <Text className="text-gray-500 text-sm leading-relaxed">
                    The AI operating system for modern legal professionals. Built for the Indian legal system.
                </Text>
            </View>

            <View className="flex-row justify-between mb-12">
                <View>
                    <Text className="font-bold text-slate-900 mb-4">Platform</Text>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">Features</Text></TouchableOpacity>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">Pricing</Text></TouchableOpacity>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">For Lawyers</Text></TouchableOpacity>
                </View>
                <View>
                    <Text className="font-bold text-slate-900 mb-4">Company</Text>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">About</Text></TouchableOpacity>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">Blog</Text></TouchableOpacity>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">Careers</Text></TouchableOpacity>
                </View>
                <View>
                    <Text className="font-bold text-slate-900 mb-4">Legal</Text>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">Privacy</Text></TouchableOpacity>
                    <TouchableOpacity className="mb-3"><Text className="text-gray-500 text-sm">Terms</Text></TouchableOpacity>
                </View>
            </View>

            <View className="pt-8 border-t border-gray-100">
                <Text className="text-gray-400 text-xs text-center">
                    © {currentYear} ContinuumX Technologies. All rights reserved.
                </Text>
            </View>
        </View>
    );
};
