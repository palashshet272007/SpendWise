
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, 'users', result.user.uid), {
        name: name.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your account has been created!');

      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join SpendWise and manage your money better.
      </Text>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

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
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Register
      </Button>

      <View style={styles.loginRow}>
        <Text>Already have an account? </Text>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F8B5F',
  },
  subtitle: {
    fontSize: 15,
    color: '#777777',
    marginTop: 8,
    marginBottom: 35,
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContent: {
    height: 48,
  },
  loginRow: {
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
