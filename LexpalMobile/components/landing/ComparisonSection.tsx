
import React, { useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../ui/Button';
import { MaterialIcons } from '@expo/vector-icons';

interface ShowcaseSection {
    id: string;
    subtitle: string;
    title: string;
    description: string;
    image: any;
    theme: 'dark' | 'light';
    stats: { value: string; unit: string; label: string }[];
}

interface ComparisonSectionProps {
    sections: ShowcaseSection[];
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ sections }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <View className="py-12 bg-gray-50">
            <View className="px-6 mb-8">
                <Text className="text-3xl font-bold text-gray-900 mb-2">The Difference</Text>
                <Text className="text-lg text-gray-500">Why professionals choose Lexpal</Text>
            </View>

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-8 max-h-12">
                {sections.map((section, index) => (
                    <TouchableOpacity
                        key={section.id}
                        onPress={() => setActiveTab(index)}
                        className={`mr-4 px-5 py-2 rounded-full border ${activeTab === index
                                ? 'bg-gray-900 border-gray-900'
                                : 'bg-white border-gray-200'
                            }`}
                    >
                        <Text
                            className={`font-semibold ${activeTab === index ? 'text-white' : 'text-gray-600'
                                }`}
                        >
                            {section.subtitle}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content Card */}
            <View className="px-4">
                {sections.map((section, index) => {
                    if (index !== activeTab) return null;

                    const isDark = section.theme === 'dark';

                    return (
                        <View
                            key={section.id}
                            className={`rounded-3xl overflow-hidden shadow-sm ${isDark ? 'bg-gray-900' : 'bg-white border border-gray-200'}`}
                        >
                            {/* Text Content */}
                            <View className="p-8">
                                <Text className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {section.subtitle}
                                </Text>
                                <Text className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {section.title}
                                </Text>
                                <Text className={`text-base leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {section.description}
                                </Text>

                                {/* Stats Grid */}
                                <View className="flex-row flex-wrap justify-between gap-y-6">
                                    {section.stats.map((stat, i) => (
                                        <View key={i} className="w-[45%]">
                                            <View className="flex-row items-baseline">
                                                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {stat.value}
                                                </Text>
                                                <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {stat.unit}
                                                </Text>
                                            </View>
                                            <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {stat.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Mock Image Area (since we might not have good aspect ratio images, we use a colored box or the actual image if it looks good) */}
                            <View className="h-64 w-full bg-gray-200 relative">
                                <Image
                                    source={section.image}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                {/* Overlay gradient could go here */}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
