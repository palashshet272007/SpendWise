
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '../../firebase';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  payment?: string;
  type?: string;
  createdAt: any;
};

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');

  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPayment, setEditPayment] = useState('');

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'expenses'),
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
      },
      (error) => console.log('Error:', error)
    );

    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      await deleteDoc(
        doc(db, 'users', user.uid, 'expenses', id)
      );
    } catch (error) {
      console.log('Delete Error:', error);
    }
  };

  const handleEdit = (item: Transaction) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditAmount(String(item.amount));
    setEditCategory(item.category);
    setEditPayment(item.payment || '');
  };

  const handleUpdate = async () => {
    const user = auth.currentUser;
    const amount = Number(editAmount);

    if (!user) return;

    if (
      !editTitle.trim() ||
      !editAmount.trim() ||
      !editCategory.trim() ||
      !editPayment.trim()
    ) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Error', 'Enter a valid amount.');
      return;
    }

    try {
      await updateDoc(
        doc(db, 'users', user.uid, 'expenses', editingId),
        {
          title: editTitle.trim(),
          amount: amount,
          category: editCategory.trim(),
          payment: editPayment.trim(),
        }
      );

      setEditingId('');
      Alert.alert('Success', 'Transaction updated successfully.');
    } catch (error) {
      console.log('Update Error:', error);
      Alert.alert('Error', 'Could not update transaction.');
    }
  };

  const filteredTransactions = transactions.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'income') return item.type === 'income';
    return item.type !== 'income';
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Transactions</Text>
      <Text style={styles.subtitle}>View all your transactions</Text>

      <View style={styles.filterRow}>
        <Button
          mode={filter === 'all' ? 'contained' : 'outlined'}
          onPress={() => setFilter('all')}
          buttonColor="#0F8B5F"
          textColor={filter === 'all' ? '#FFFFFF' : '#0F8B5F'}
          style={styles.filterButton}
        >
          All
        </Button>

        <Button
          mode={filter === 'income' ? 'contained' : 'outlined'}
          onPress={() => setFilter('income')}
          buttonColor="#0F8B5F"
          textColor={filter === 'income' ? '#FFFFFF' : '#0F8B5F'}
          style={styles.filterButton}
        >
          Income
        </Button>

        <Button
          mode={filter === 'expense' ? 'contained' : 'outlined'}
          onPress={() => setFilter('expense')}
          buttonColor="#0F8B5F"
          textColor={filter === 'expense' ? '#FFFFFF' : '#0F8B5F'}
          style={styles.filterButton}
        >
          Expense
        </Button>
      </View>

      {filteredTransactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions found.</Text>
      ) : (
        filteredTransactions.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Card.Content>
              {editingId === item.id ? (
                <View>
                  <Text style={styles.name}>Edit Transaction</Text>

                  <TextInput
                    label="Title"
                    value={editTitle}
                    onChangeText={setEditTitle}
                    style={styles.input}
                  />

                  <TextInput
                    label="Amount"
                    value={editAmount}
                    onChangeText={setEditAmount}
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <TextInput
                    label="Category"
                    value={editCategory}
                    onChangeText={setEditCategory}
                    style={styles.input}
                  />

                  <TextInput
                    label="Payment Method"
                    value={editPayment}
                    onChangeText={setEditPayment}
                    style={styles.input}
                  />

                  <View style={styles.buttonRow}>
                    <Button
                      mode="contained"
                      buttonColor="#0F8B5F"
                      onPress={handleUpdate}
                    >
                      Save
                    </Button>

                    <Button
                      mode="outlined"
                      textColor="#D9534F"
                      onPress={() => setEditingId('')}
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={styles.transactionRow}>
                  <View style={styles.details}>
                    <Text style={styles.name}>{item.title}</Text>

                    <Text style={styles.info}>
                      {item.category} •{' '}
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString('en-IN')
                        : 'Date unavailable'}
                    </Text>
                  </View>

                  <View>
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

                    <Button
                      mode="text"
                      textColor="#0F8B5F"
                      compact
                      onPress={() => handleEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      mode="text"
                      textColor="#D9534F"
                      compact
                      onPress={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              )}
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  income: {
    color: '#0F8B5F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expense: {
    color: '#D9534F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#777777',
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
