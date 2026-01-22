
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    LawyerHeader,
    AnalyticsWidget,
    AIProWidget,
    ScheduleWidget,
    RequestsWidget
} from '../../components/dashboard/LawyerWidgets';

export default function LawyerDashboardHome() {
    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                {/* Header */}
                <LawyerHeader firstName="Sarat" />

                {/* Analytics Scroll */}
                <AnalyticsWidget />

                {/* AI Co-Pilot */}
                <AIProWidget />

                {/* Schedule */}
                <ScheduleWidget />

                {/* Client Requests */}
                <RequestsWidget />

            </ScrollView>
        </SafeAreaView>
    );
}
