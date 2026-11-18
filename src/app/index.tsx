
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>₹</Text>
      </View>

      <Text style={styles.title}>SpendWise</Text>

      <Text style={styles.subtitle}>
        Manage your money wisely
      </Text>

      <Text style={styles.description}>
        Track your income, control your expenses
        and build better financial habits.
      </Text>

      <Button
      onPress={() => router.replace('/login')}
      >
        Get Started
      </Button>

      <Text style={styles.footer}>
        Track your expenses. Save smarter.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#E4F5EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#0F8B5F',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0F8B5F',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#333333',
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    marginTop: 40,
  },
  buttonContent: {
    height: 50,
  },
  footer: {
    color: '#888888',
    marginTop: 35,
    fontSize: 13,
  },
});
