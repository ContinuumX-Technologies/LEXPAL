import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function ClientDashboard() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center">
                <Text className="text-slate-900 text-2xl font-bold">Client Dashboard</Text>
            </View>
        </SafeAreaView>
    );
}
