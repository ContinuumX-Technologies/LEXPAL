
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
// import { cn } from 'nativewind';
// If cn is not available, we can just use className strings. 
// For this environment, we'll assume standard className usage or manual style combinations.
// Using simple RN TouchableOpacity for now.

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    className = '',
    textClassName = '',
    icon,
    disabled = false
}) => {

    // Base classes imitating the web gradients
    // primary: bg-gradient-to-r from-blue-600 to-indigo-600
    // secondary: bg-white border border-slate-200

    let containerBase = "flex-row items-center justify-center px-6 py-4 rounded-full active:opacity-80";
    let textBase = "text-base font-semibold";

    if (variant === 'primary') {
        containerBase += " bg-gray-900 border border-transparent"; // Fallback for gradient, using dark gray/black like Apple primary
        textBase += " text-white";
    } else if (variant === 'secondary') {
        containerBase += " bg-white border border-gray-200 shadow-sm";
        textBase += " text-gray-900";
    }

    if (disabled) {
        containerBase += " opacity-50";
    }

    // NativeWind handles className prop on View/TouchableOpacity if properly configured with verifyInstallation
    // For now using styled standard components if nativewind is set up on root.

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`${containerBase} ${className}`}
        >
            {icon && <>{icon}</>}
            <Text className={`${textBase} ${textClassName} ${icon ? 'ml-2' : ''}`}>{title}</Text>
        </TouchableOpacity>
    );
};
