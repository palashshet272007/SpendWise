
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      Alert.alert('Success', 'Login successful!');
     router.replace('/dashboard');;
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to continue to SpendWise</Text>

      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        buttonColor="#0F8B5F"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Login
      </Button>

      <View style={styles.registerRow}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F8B5F',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 30,
    color: '#777777',
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  button: {
    borderRadius: 10,
  },
  buttonContent: {
    height: 48,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    alignItems: 'center',
  },
  link: {
    color: '#0F8B5F',
    fontWeight: 'bold',
  },
});
