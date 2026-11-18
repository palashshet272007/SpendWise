
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { router } from 'expo-router';

import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  createdAt: any;
};

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const expensesRef = collection(
      db,
      'users',
      user.uid,
      'expenses'
    );

    const unsubscribe = onSnapshot(
      expensesRef,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Transaction[];

        data.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });

        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        console.log('Firestore Error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const totalIncome = transactions.reduce((total, item) => {
    return item.type === 'income'
      ? total + Number(item.amount)
      : total;
  }, 0);

  const totalExpenses = transactions.reduce((total, item) => {
    return item.type !== 'income'
      ? total + Number(item.amount)
      : total;
  }, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>SpendWise</Text>
        <Text style={styles.welcome}>Welcome back!</Text>
      </View>

      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text style={styles.cardLabel}>Total Balance</Text>
          <Text style={styles.balance}>
            ₹{balance.toLocaleString('en-IN')}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <Card style={styles.smallCard}>
          <Card.Content>
            <Text style={styles.incomeLabel}>Total Income</Text>
            <Text style={styles.income}>
              ₹{totalIncome.toLocaleString('en-IN')}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.smallCard}>
          <Card.Content>
            <Text style={styles.expenseLabel}>Total Expenses</Text>
            <Text style={styles.expense}>
              ₹{totalExpenses.toLocaleString('en-IN')}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Button
        mode="contained"
        buttonColor="#0F8B5F"
        style={styles.addButton}
        onPress={() => router.push('/add-expense')}
      >
        + Add Transaction
      </Button>
      <Button
  mode="outlined"
  textColor="#0F8B5F"
  style={styles.addButton}
  onPress={() => router.push('/transactions')}
>
  View All Transactions
</Button>
<Button
  mode="outlined"
  textColor="#0F8B5F"
  style={styles.addButton}
  onPress={() => router.push('/budget')}
>
  Monthly Budget
</Button>
<Button
  mode="outlined"
  textColor="#0F8B5F"
  style={styles.addButton}
  onPress={() => router.push('/profile')}
>
  My Profile
</Button>
<Button
  mode="outlined"
  textColor="#0F8B5F"
  style={styles.addButton}
  onPress={() => router.push('/currency-converter')}
>
  Currency Converter
</Button>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {loading ? (
        <Text style={styles.emptyText}>Loading transactions...</Text>
      ) : transactions.length === 0 ? (
        <Text style={styles.emptyText}>
          No transactions yet. Add your first transaction!
        </Text>
      ) : (
        transactions.map((item) => (
          <Card key={item.id} style={styles.transactionCard}>
            <Card.Content style={styles.transactionRow}>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>
                  {item.title}
                </Text>

                <Text style={styles.transactionDate}>
                  {item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleDateString('en-IN')
                    : 'Date unavailable'}
                  {' • '}
                  {item.category}
                </Text>
              </View>

              <Text
                style={
                  item.type === 'income'
                    ? styles.income
                    : styles.expense
                }
              >
                {item.type === 'income' ? '+' : '-'} ₹
                {Number(item.amount).toLocaleString('en-IN')}
              </Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F6',
    padding: 18,
  },
  header: {
    marginTop: 35,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F8B5F',
  },
  welcome: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
  },
  balanceCard: {
    backgroundColor: '#0F8B5F',
    borderRadius: 15,
    marginBottom: 15,
  },
  cardLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  incomeLabel: {
    color: '#0F8B5F',
    fontSize: 14,
  },
  expenseLabel: {
    color: '#D9534F',
    fontSize: 14,
  },
  income: {
    color: '#0F8B5F',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 8,
  },
  expense: {
    color: '#D9534F',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 8,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
    color: '#222222',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginRight: 8,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  emptyText: {
    color: '#777777',
    marginTop: 10,
    marginBottom: 20,
  },
});
