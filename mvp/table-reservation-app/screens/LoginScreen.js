import React, { useState, useContext } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const theme = useTheme();

    const handleLogin = async () => {
        try {
            setError(null);
            await login(email, password);
        } catch {
            setError('Invalid email or password.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'padding' : undefined}
            style={{ flex: 1, justifyContent: 'center', padding: 20 }}
        >
            <Text variant="headlineLarge" style={{ marginBottom: 20, textAlign: 'center', color: theme.colors.primary }}>
                Welcome Back
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ marginBottom: 12 }}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ marginBottom: 20 }}
                right={
                    <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                returnKeyType="done"
                onSubmitEditing={handleLogin}
            />

            <Button mode="contained" onPress={handleLogin}>
                Login
            </Button>
            <Button onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }}>
                Don't have an account? Register
            </Button>

            <Snackbar
                visible={!!error}
                onDismiss={() => setError(null)}
                duration={3000}
                style={{ backgroundColor: theme.colors.error }}
            >
                {error}
            </Snackbar>
        </KeyboardAvoidingView>
    );
}
