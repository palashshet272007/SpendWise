import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setEmail(user.email || '');

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          setName(userDoc.data().name || 'User');
        }
      } catch (error) {
        console.log('Profile Error:', error);
      }
    };

    loadProfile();
  }, []);
  const handleLogout = async () => {
  try {
    await signOut(auth);
    router.replace('/login');
  } catch (error) {
    Alert.alert('Error', 'Could not log out.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.subtitle}>Your account information</Text>

      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Text
            size={80}
            label={name ? name.charAt(0).toUpperCase() : 'U'}
            style={styles.avatar}
          />

          <Text style={styles.name}>{name || 'User'}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.divider} />

          <Text>Full Name</Text>
          <Text style={styles.value}>{name || 'Not available'}</Text>

          <Text>Email Address</Text>
          <Text style={styles.value}>{email || 'Not available'}</Text>
        </Card.Content>
      </Card>
      <Button
  mode="contained"
  buttonColor="#D9534F"
  style={{ marginTop: 25, borderRadius: 10 }}
  onPress={handleLogout}
>
  Logout
</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F6',
    padding: 18,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F8B5F',
    marginTop: 35,
  },
  subtitle: {
    color: '#777777',
    marginTop: 5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    backgroundColor: '#0F8B5F',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#777777',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    width: '100%',
    marginVertical: 20,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
  },
});