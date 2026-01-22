import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function LawyerDashboard() {
    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <View className="flex-1 justify-center items-center">
                <Text className="text-white text-2xl font-bold">Lawyer Dashboard</Text>
            </View>
        </SafeAreaView>
    );
}
