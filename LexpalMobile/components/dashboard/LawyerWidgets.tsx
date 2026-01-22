
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// === Header ===
export const LawyerHeader = ({ firstName = "Counsel" }: { firstName?: string }) => {
    return (
        <View className="mb-6 mt-2 px-6">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-3xl font-bold text-slate-800">Workspace</Text>
                    <Text className="text-slate-500 font-medium">Welcome back, {firstName}</Text>
                </View>
                <View className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center">
                    <Text className="text-white font-bold text-lg">{firstName[0]}</Text>
                </View>
            </View>
        </View>
    );
};

// === Base Card ===
const LawyerCard = ({ children, className, onPress }: { children: React.ReactNode, className?: string, onPress?: () => void }) => {
    const Container = onPress ? TouchableOpacity : View;
    return (
        <Container
            onPress={onPress}
            activeOpacity={0.9}
            className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4 mx-6 ${className}`}
        >
            {children}
        </Container>
    );
};

// === Case Analytics Widget ===
export const AnalyticsWidget = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 pl-6" contentContainerStyle={{ paddingRight: 24 }}>
        {[
            { label: 'Active Cases', count: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Requests', count: '5', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Hearings Today', count: '2', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Unread Msgs', count: '8', color: 'text-green-600', bg: 'bg-green-50' },
        ].map((item, index) => (
            <View key={index} className={`w-36 h-32 ${item.bg} rounded-2xl p-4 justify-between mr-3 border border-slate-100`}>
                <Text className="text-slate-600 font-medium text-xs uppercase">{item.label}</Text>
                <Text className={`text-4xl font-bold ${item.color}`}>{item.count}</Text>
            </View>
        ))}
    </ScrollView>
);

// === AI Assistant Pro ===
export const AIProWidget = () => (
    <LawyerCard className="bg-slate-900 border-slate-800">
        <View className="flex-row items-center gap-2 mb-3">
            <MaterialIcons name="smart-toy" size={20} color="#60a5fa" />
            <Text className="text-white font-semibold text-base">Lexpal Co-Pilot</Text>
        </View>
        <Text className="text-slate-400 text-sm mb-4">
            Analysis ready for <Text className="text-white font-medium">Estate Dispute v. State</Text>.
            3 citations found relevant to recent amendments.
        </Text>
        <TouchableOpacity className="bg-blue-600 self-start px-4 py-2 rounded-lg">
            <Text className="text-white font-medium text-xs">View Analysis</Text>
        </TouchableOpacity>
    </LawyerCard>
);

// === Today's Schedule ===
export const ScheduleWidget = () => (
    <LawyerCard>
        <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-slate-800 text-base">Today's Schedule</Text>
            <MaterialIcons name="calendar-today" size={18} color="#64748b" />
        </View>

        {[
            { time: '10:00 AM', title: 'Hearing: Smith v. Jones', type: 'High Court', color: 'border-l-blue-500' },
            { time: '02:30 PM', title: 'Client Meeting: Tech Corp', type: 'Office', color: 'border-l-green-500' },
        ].map((event, i) => (
            <View key={i} className={`flex-row mb-4 last:mb-0 pl-3 border-l-4 ${event.color}`}>
                <View>
                    <Text className="text-slate-900 font-semibold">{event.title}</Text>
                    <Text className="text-slate-500 text-xs">{event.time} • {event.type}</Text>
                </View>
            </View>
        ))}
    </LawyerCard>
);

// === Recent Requests ===
export const RequestsWidget = () => (
    <LawyerCard>
        <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-slate-800 text-base">New Client Requests</Text>
            <TouchableOpacity>
                <Text className="text-blue-700 text-xs font-bold uppercase">View All</Text>
            </TouchableOpacity>
        </View>

        {[1, 2].map((i) => (
            <View key={i} className="flex-row items-center justify-between mb-4 last:mb-0 pt-2 border-t border-slate-50 first:border-t-0 first:pt-0">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                        <Text className="text-slate-600 font-bold">JD</Text>
                    </View>
                    <View>
                        <Text className="icon font-semibold text-slate-800">John Doe</Text>
                        <Text className="text-slate-500 text-xs">Criminal Defense • Urgent</Text>
                    </View>
                </View>
                <View className="flex-row gap-2">
                    <TouchableOpacity className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
                        <MaterialIcons name="check" size={18} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 bg-red-50 rounded-full items-center justify-center">
                        <MaterialIcons name="close" size={18} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        ))}
    </LawyerCard>
);
