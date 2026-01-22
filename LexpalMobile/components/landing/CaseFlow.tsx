
import React, { useEffect, useState } from 'react';
import { View, Text, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface CaseFlowProps {
    steps: any[];
    userType: 'lawyer' | 'client';
}

export const CaseFlow: React.FC<CaseFlowProps> = ({ steps, userType }) => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [steps]);

    // Current active data
    const currentStepData = steps[activeStep];

    return (
        <View className="py-8 px-4">
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center space-x-2">
                    <MaterialIcons name="alt-route" size={24} color="#3b82f6" />
                    <Text className="text-lg font-bold text-gray-900">
                        {userType === 'lawyer' ? 'Case Lifecycle' : 'Your Journey'}
                    </Text>
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 text-xs font-semibold">Live Preview</Text>
                </View>
            </View>

            {/* Steps visualization usually horizontal on web, vertically stacked or list on mobile? 
          Web had active card below. Let's do horizontal progress dots + Active Card.
      */}

            {/* Progress Indicators */}
            <View className="flex-row justify-between mb-8 px-2">
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    return (
                        <View key={step.id} className="items-center">
                            <View
                                className={`w-10 h-10 rounded-full items-center justify-center mb-2 border-2 
                       ${isActive ? 'bg-white border-blue-600' : 'bg-gray-50 border-gray-200'}`}
                                style={isActive ? { borderColor: step.color } : {}}
                            >
                                <MaterialIcons
                                    name={step.icon}
                                    size={20}
                                    color={isActive ? step.color : '#9ca3af'}
                                />
                            </View>
                            {isActive && (
                                <Text className="text-xs font-medium absolute -bottom-6 w-20 text-center" numberOfLines={1}>
                                    {step.shortTitle}
                                </Text>
                            )}
                        </View>
                    )
                })}
            </View>

            {/* Active Card */}
            <View
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                style={{ borderTopWidth: 4, borderTopColor: currentStepData.color }}
            >
                <View className="flex-row justify-between items-start mb-4">
                    <View>
                        <Text className="text-xl font-bold text-gray-900 mb-1">{currentStepData.title}</Text>
                        <Text className="text-gray-500 text-sm">{currentStepData.description}</Text>
                    </View>
                    <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded">
                        <MaterialIcons name="schedule" size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-600 ml-1">{currentStepData.duration}</Text>
                    </View>
                </View>

                <View className="space-y-2">
                    {currentStepData.details.map((detail: string, idx: number) => (
                        <View key={idx} className="flex-row items-center">
                            <MaterialIcons name="check-circle" size={16} color={currentStepData.color} />
                            <Text className="ml-2 text-gray-700 text-sm">{detail}</Text>
                        </View>
                    ))}
                </View>

                {/* Progress Bar inside Card */}
                <View className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-blue-500"
                        style={{
                            width: `${((activeStep + 1) / steps.length) * 100}%`,
                            backgroundColor: currentStepData.color
                        }}
                    />
                </View>
            </View>
        </View>
    );
};
