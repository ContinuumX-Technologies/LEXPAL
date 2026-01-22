
import React, { useState, useEffect } from 'react';
import { View, TextInput as RNTextInput, Text, TextInputProps, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface FloatingLabelInputProps extends TextInputProps {
    label: string;
    error?: string;
    containerClassName?: string;
}

export const TextInput: React.FC<FloatingLabelInputProps> = ({
    label,
    value,
    error,
    containerClassName,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Animation value: 0 = placeholder state, 1 = floating label state
    const focusAnim = useSharedValue(0);

    useEffect(() => {
        // If there is a value or it's focused, float the label
        if (value || isFocused) {
            focusAnim.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
        } else {
            focusAnim.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) });
        }
    }, [value, isFocused]);

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            top: 20, // Initial top position matches web CSS
            left: 16,
            transform: [
                { translateY: focusAnim.value * -12 }, // Move up by 12px
                { translateX: focusAnim.value * -4 },  // Slight left adjustment for scale
                { scale: 1 - (focusAnim.value * 0.25) } // Scale down to 0.75
            ],
            color: error ? '#ef4444' : (isFocused ? '#0071e3' : '#64748b'), // Red on error, Blue on focus, Gray otherwise
        };
    });

    const animatedInputStyle = useAnimatedStyle(() => {
        return {
            borderColor: error ? '#ef4444' : (isFocused ? '#0071e3' : 'transparent'),
            backgroundColor: isFocused ? '#ffffff' : '#f5f5f7',
            shadowOpacity: isFocused ? 0.05 : 0,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        };
    });

    return (
        <View className={`mb-6 ${containerClassName}`}>
            <View className="relative">
                <Animated.View
                    style={[
                        styles.inputContainer,
                        animatedInputStyle
                    ]}
                >
                    <RNTextInput
                        {...props}
                        value={value}
                        style={styles.input}
                        onFocus={(e) => {
                            setIsFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        }}
                        placeholder="" // We handle placeholder with our custom label
                        placeholderTextColor="transparent"
                    />
                </Animated.View>

                <Animated.Text style={[styles.label, animatedLabelStyle]} pointerEvents="none">
                    {label}
                </Animated.Text>
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: 60,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 16,
        paddingTop: 18, // Push text down to make room for label
        paddingBottom: 2,
        fontSize: 17,
        color: '#1d1d1f',
    },
    label: {
        position: 'absolute',
        fontSize: 17,
        color: '#86868b',
        fontWeight: '400',
    }
});
