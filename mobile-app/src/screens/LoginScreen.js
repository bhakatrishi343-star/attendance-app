import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your computer's local IP
const API_URL = 'http://172.17.4.156:3000';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log("Attempting login to:", `${API_URL}/api/auth/login`);
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text(); // Read raw text first
            console.log("Server Response:", text); // Log it for debugging

            let data;
            try {
                data = JSON.parse(text); // Try to parse it
            } catch (e) {
                // If it fails, it's likely an HTML error page from the tunnel or proxy
                console.error("JSON Parse Error:", e);
                throw new Error(`Server Invalid Response: ${text.substring(0, 100)}...`);
            }

            if (!response.ok) {
                // Handle non-200 responses
                throw new Error(data.error || 'Login failed');
            }

            const { token, user } = data;

            // Store token and user data
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'admin') {
                navigation.replace('AdminDashboard');
            } else {
                navigation.replace('StudentDashboard', { user });
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert('Login Failed', error.message || 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Automated Attendance</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                <Text style={{ color: 'blue', textAlign: 'center' }}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
