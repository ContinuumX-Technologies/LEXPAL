
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="lawyer-login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="lawyer-signup" />
        </Stack>
    );
}
