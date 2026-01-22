
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Gavel, User } from 'lucide-react-native';

interface UserTypeToggleProps {
    userType: 'lawyer' | 'client';
    onUserTypeChange: (type: 'lawyer' | 'client') => void;
    disabled?: boolean;
}

export const UserTypeToggle: React.FC<UserTypeToggleProps> = ({ userType, onUserTypeChange, disabled }) => {
    return (
        <View style={styles.container}>
            <Pressable
                disabled={disabled}
                onPress={() => onUserTypeChange('lawyer')}
                style={[styles.button, userType === 'lawyer' ? styles.activeButton : styles.inactiveButton]}
            >
                <Gavel size={16} color={userType === 'lawyer' ? '#000' : '#6b7280'} />
                <Text style={[styles.text, userType === 'lawyer' ? styles.activeText : styles.inactiveText]}>Lawyers</Text>
            </Pressable>

            <Pressable
                disabled={disabled}
                onPress={() => onUserTypeChange('client')}
                style={[styles.button, userType === 'client' ? styles.activeButton : styles.inactiveButton]}
            >
                <User size={16} color={userType === 'client' ? '#000' : '#6b7280'} />
                <Text style={[styles.text, userType === 'client' ? styles.activeText : styles.inactiveText]}>Clients</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        padding: 4,
        flexDirection: 'row',
        height: 48,
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
    },
    activeButton: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    inactiveButton: {
        backgroundColor: 'transparent',
    },
    text: {
        marginLeft: 8,
        fontWeight: '500',
        fontSize: 14,
    },
    activeText: {
        color: '#111827',
    },
    inactiveText: {
        color: '#6b7280',
    },
});
