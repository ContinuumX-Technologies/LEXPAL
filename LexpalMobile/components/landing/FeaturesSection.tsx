
import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Feature {
    icon: string;
    title: string;
    description: string;
    image: any;
}

interface FeaturesSectionProps {
    features: Feature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
    return (
        <View className="py-12 px-4 bg-white">
            <View className="mb-10 px-2">
                <Text className="text-blue-600 font-semibold tracking-wider text-xs uppercase mb-2">Capabilities</Text>
                <Text className="text-3xl font-bold text-slate-900">Powerful Features</Text>
            </View>

            <View className="gap-6">
                {features.map((feature, index) => (
                    <View key={index} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        <View className="p-6">
                            <View className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm mb-4">
                                <MaterialIcons name={feature.icon as any} size={24} color="#2563eb" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-2">{feature.title}</Text>
                            <Text className="text-gray-600 leading-relaxed">{feature.description}</Text>
                        </View>
                        {/* Image Preview at bottom of card */}
                        <View className="h-48 w-full bg-gray-200 mt-2">
                            <Image source={feature.image} className="w-full h-full" resizeMode="cover" />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
