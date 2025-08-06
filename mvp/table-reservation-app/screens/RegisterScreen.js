import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Snackbar, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const theme = useTheme();

    const handleRegister = async () => {
        try {
            setError(null);
            await register(name, email, password);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigation.navigate('Login'), 1500);
        } catch {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text variant="headlineLarge" style={{ marginBottom: 20, textAlign: 'center', color: theme.colors.primary }}>
                Create Account
            </Text>

            <TextInput label="Full Name" value={name} onChangeText={setName} style={{ marginBottom: 10 }} />
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ marginBottom: 10 }} />
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
            />

            <Button mode="contained" onPress={handleRegister}>
                Register
            </Button>
            <Button onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
                Back to Login
            </Button>

            <Snackbar visible={!!error} onDismiss={() => setError(null)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
                {error}
            </Snackbar>
            <Snackbar visible={!!success} onDismiss={() => setSuccess(null)} duration={3000} style={{ backgroundColor: theme.colors.primary }}>
                {success}
            </Snackbar>
        </View>
    );
}
