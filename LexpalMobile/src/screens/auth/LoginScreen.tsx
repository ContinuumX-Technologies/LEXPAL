import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen({ route }: any) {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userType = route.params?.userType || 'lawyer';

    return (
        <View className="flex-1 justify-center px-6 bg-slate-900">
            <Text className="text-3xl font-bold text-white mb-8">
                Login as {userType === 'lawyer' ? 'Lawyer' : 'Client'}
            </Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                className="w-full bg-slate-800 text-white p-4 rounded-xl mb-4"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full bg-slate-800 text-white p-4 rounded-xl mb-8"
            />

            <TouchableOpacity
                onPress={() => signIn(userType)}
                className="w-full bg-blue-600 py-4 rounded-xl items-center"
            >
                <Text className="text-white font-bold text-lg">Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}
