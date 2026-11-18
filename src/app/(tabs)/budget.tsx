
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, TextInput, ProgressBar } from 'react-native-paper';

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '../../firebase';

export default function BudgetScreen() {
  const [budget, setBudget] = useState('10000');
  const [savedBudget, setSavedBudget] = useState(10000);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const budgetRef = doc(db, 'users', user.uid, 'settings', 'budget');

    const unsubscribeBudget = onSnapshot(budgetRef, (snapshot) => {
      if (snapshot.exists()) {
        const amount = Number(snapshot.data().amount);
        setSavedBudget(amount);
        setBudget(String(amount));
      }
    });

    const expensesRef = collection(
      db,
      'users',
      user.uid,
      'expenses'
    );

    const unsubscribeExpenses = onSnapshot(expensesRef, (snapshot) => {
      const now = new Date();

      const total = snapshot.docs.reduce((sum, item) => {
        const data = item.data();

        if (data.type === 'income') return sum;

        const date = data.createdAt?.toDate?.();

        if (
          date &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          return sum + Number(data.amount || 0);
        }

        return sum;
      }, 0);

      setSpent(total);
    });

    return () => {
      unsubscribeBudget();
      unsubscribeExpenses();
    };
  }, []);

  const handleSaveBudget = async () => {
    const user = auth.currentUser;
    const amount = Number(budget);

    if (!user) return;

    if (!budget.trim() || !Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Error', 'Enter a valid budget amount.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', user.uid, 'settings', 'budget'),
        {
          amount: amount,
        }
      );

      Alert.alert('Success', 'Monthly budget saved.');
    } catch (error) {
      console.log('Budget Error:', error);
      Alert.alert('Error', 'Could not save budget.');
    }
  };

  const remaining = savedBudget - spent;
  const progress = savedBudget > 0
    ? Math.min(spent / savedBudget, 1)
    : 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Monthly Budget</Text>
      <Text style={styles.subtitle}>Manage your monthly spending</Text>

      <Card style={styles.budgetCard}>
        <Card.Content>
          <Text style={styles.label}>Monthly Budget</Text>
          <Text style={styles.amount}>
            ₹{savedBudget.toLocaleString('en-IN')}
          </Text>

          <Text style={styles.label}>Total Spent This Month</Text>
          <Text style={styles.spent}>
            ₹{spent.toLocaleString('en-IN')}
          </Text>

          <Text style={styles.label}>Remaining Budget</Text>
          <Text style={[
            styles.remaining,
            { color: remaining < 0 ? '#D9534F' : '#0F8B5F' }
          ]}>
            ₹{remaining.toLocaleString('en-IN')}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.progressCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Budget Usage</Text>

          <ProgressBar
            progress={progress}
            color={spent > savedBudget ? '#D9534F' : '#0F8B5F'}
            style={styles.progress}
          />

          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% of your budget used
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Set Monthly Budget</Text>

          <TextInput
  label="Monthly Budget (₹)"
  value={budget}
  onChangeText={setBudget}
  keyboardType="numeric"
  mode="outlined"
  outlineColor="#0F8B5F"
  activeOutlineColor="#0F8B5F"
  style={{ backgroundColor: '#FFFFFF' }}
/>

          <Button
            mode="contained"
            buttonColor="#0F8B5F"
            style={styles.saveButton}
            onPress={handleSaveBudget}
          >
            Save Budget
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#777777',
    marginTop: 10,
  },
  amount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F8B5F',
    marginTop: 5,
  },
  spent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D9534F',
    marginTop: 5,
  },
  remaining: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progress: {
    height: 10,
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    color: '#777777',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 15,
    borderRadius: 8,
  },
});
