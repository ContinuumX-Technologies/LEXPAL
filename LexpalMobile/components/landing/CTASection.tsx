
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../ui/Button';
import { MaterialIcons } from '@expo/vector-icons';

interface CTASectionProps {
    content: {
        title: string;
        subtitle: string;
    };
    onAction: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ content, onAction }) => {
    return (
        <View className="py-20 px-6 bg-white items-center">
            <View className="bg-blue-50 w-full rounded-[32px] p-8 items-center border border-blue-100">
                <Text className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-4">
                    {content.title}
                </Text>
                <Text className="text-base text-center text-gray-500 mb-8 max-w-md">
                    {content.subtitle}
                </Text>
                <Button
                    title="Get Started Now"
                    onPress={onAction}
                    variant="primary"
                    className="w-full max-w-sm"
                    icon={<MaterialIcons name="arrow-forward" size={20} color="white" />}
                />
            </View>
        </View>
    );
};
