
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    avatar: string;
}

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
    return (
        <View className="py-16 bg-slate-900">
            <View className="px-6 mb-10">
                <Text className="text-blue-400 font-semibold tracking-wider text-xs uppercase mb-2">Testimonials</Text>
                <Text className="text-3xl font-bold text-white">Trusted by Leaders</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
            >
                {testimonials.map((item, index) => (
                    <View key={index} className="bg-slate-800 p-8 rounded-3xl w-[300px] mr-4 border border-slate-700">
                        <View className="flex-row mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                                <MaterialIcons key={star} name="star" size={16} color="#fbbf24" />
                            ))}
                        </View>
                        <Text className="text-white text-lg font-medium leading-relaxed mb-6">"{item.quote}"</Text>

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-slate-600 items-center justify-center mr-3">
                                <Text className="text-white font-bold">{item.avatar}</Text>
                            </View>
                            <View>
                                <Text className="text-white font-bold text-sm">{item.author}</Text>
                                <Text className="text-slate-400 text-xs">{item.role}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
