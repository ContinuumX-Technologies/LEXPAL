
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Button } from '../ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeroSectionProps {
    content: any;
    userType: 'lawyer' | 'client';
    onPrimaryAction: () => void;
    onSecondaryAction: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content, userType, onPrimaryAction, onSecondaryAction }) => {
    const { width } = Dimensions.get('window');

    // Theme Constants matching web page.module.css
    const THEME = {
        lawyer: {
            primary: '#1e3a8a', // Blue 900
            gradientPrimary: ['#1e3a8a', '#0f172a'] as any, // Deep Blue -> Slate
            gradientSubtle: ['rgba(30, 58, 138, 0.08)', 'rgba(15, 23, 42, 0.0)'] as any, // Increased opacity slightly for visibility on mobile
            orb1: ['rgba(30, 58, 138, 0.15)', 'rgba(30, 58, 138, 0)'] as any,
            orb2: ['rgba(15, 23, 42, 0.15)', 'rgba(15, 23, 42, 0)'] as any,
        },
        client: {
            primary: '#0d9488', // Teal 600
            gradientPrimary: ['#0d9488', '#0e7490'] as any, // Teal -> Cyan
            gradientSubtle: ['rgba(13, 148, 136, 0.08)', 'rgba(14, 116, 144, 0.0)'] as any,
            orb1: ['rgba(13, 148, 136, 0.15)', 'rgba(13, 148, 136, 0)'] as any,
            orb2: ['rgba(14, 116, 144, 0.15)', 'rgba(14, 116, 144, 0)'] as any,
        }
    };

    const currentTheme = THEME[userType];

    return (
        <View className="relative min-h-[550px] justify-center overflow-hidden">
            {/* Background Gradients - Simulating the Orbs */}
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-white">
                {/* Orb 1 - Top Right */}
                <LinearGradient
                    colors={currentTheme.orb1}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        top: -120,
                        right: -100,
                        width: 450,
                        height: 450,
                        borderRadius: 225,
                        opacity: 0.8
                    }}
                />
                {/* Orb 2 - Bottom Left */}
                <LinearGradient
                    colors={currentTheme.orb2}
                    start={{ x: 0.8, y: 0.2 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: -80,
                        left: -80,
                        width: 350,
                        height: 350,
                        borderRadius: 175,
                        opacity: 0.8
                    }}
                />
            </View>

            <View className="px-6 py-12 items-center z-10">
                {/* Badge */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
                    <View
                        style={{ backgroundColor: currentTheme.primary }}
                        className="w-2 h-2 rounded-full mr-2"
                    />
                    <Text
                        style={{ color: currentTheme.primary }}
                        className="text-xs font-bold uppercase tracking-wider"
                    >
                        {content.badge}
                    </Text>
                </View>

                {/* Title */}
                <Text className="text-[40px] font-extrabold text-center text-slate-900 mb-2 leading-[1.1] tracking-tight">
                    {content.title}
                </Text>

                <View className="mb-6 relative">
                    {/* Highlighting text with gradient effect hack for simple Views, or colored text */}
                    <Text
                        style={{ color: currentTheme.primary }}
                        className="text-[40px] font-extrabold text-center leading-[1.1] tracking-tight"
                    >
                        {content.titleHighlight}
                    </Text>
                </View>

                {/* Subtitle */}
                <Text className="text-lg text-gray-500 text-center mb-10 px-2 leading-relaxed max-w-[320px]">
                    {content.subtitle}
                </Text>

                {/* Actions */}
                <View className="w-full space-y-4">
                    {/* Primary Button with Gradient Background logic handled via simpler style override or prop */}
                    <Button
                        title="Get Started"
                        onPress={onPrimaryAction}
                        variant="primary"
                        icon={<MaterialIcons name="arrow-forward" size={20} color="white" />}
                        // We can pass custom style for background color if Button supports it or just wrap
                        // But for now Button uses bg-gray-900. Let's customize it or rely on black for premium feel.
                        // Web uses gradient-primary. 
                        // Let's modify Button.tsx later to accept style, or just allow the black/dark one as it's cleaner on mobile often.
                        // Actually, let's keep it black for now as per "Apple Style" interpretation or update Button to take color.
                        className="bg-slate-900" // Overriding?
                    />
                    <Button
                        title="Watch The Film"
                        onPress={onSecondaryAction}
                        variant="secondary"
                        icon={<MaterialIcons name="play-circle" size={20} color={currentTheme.primary} />}
                        textClassName="text-slate-700"
                    />
                </View>
            </View>
        </View>
    );
};
