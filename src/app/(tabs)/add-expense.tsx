
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [payment, setPayment] = useState('');
  const [type, setType] = useState('expense');


const handleSave = async () => {
  if (!title.trim() || !amount || !category || !payment) {
    Alert.alert('Error', 'Please fill all the fields.');
    return;
  }

  const expenseAmount = Number(amount);

  if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
    Alert.alert('Error', 'Please enter a valid amount.');
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    Alert.alert('Error', 'Please login again.');
    return;
  }

  try {
    await addDoc(
  collection(db, 'users', user.uid, 'expenses'),
  {
    title: title.trim(),
    amount: expenseAmount,
    category: category,
    payment: payment,
    type: type,
    createdAt: serverTimestamp(),
  }
);

    Alert.alert('Success', 'Expense saved successfully!');
    router.back();

  } catch (error: any) {
    Alert.alert('Error', error.message);
  }
};


  return (
    <ScrollView style={styles.container}>
     <Text style={styles.heading}>Add Transaction</Text>

<Text style={styles.label}>Transaction Type</Text>

<View style={styles.options}>
  {['expense', 'income'].map((item) => (
    <Button
      key={item}
      mode={type === item ? 'contained' : 'outlined'}
      buttonColor={type === item ? '#0F8B5F' : undefined}
      textColor={type === item ? '#FFFFFF' : '#0F8B5F'}
      onPress={() => {
        setType(item);
        setCategory('');
      }}
      style={styles.option}
    >
      {item === 'expense' ? 'Expense' : 'Income'}
    </Button>
  ))}
</View>
      <Text style={styles.subtitle}>Record your spending</Text>

      <TextInput
        label="Expense Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Amount (₹)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.options}>
        {(type === 'expense'
  ? ['Food', 'Travel', 'Shopping', 'Rent', 'Education', 'Medical', 'Groceries', 'Electricity', 'Mobile Recharge', 'Other']
  : ['Salary', 'Business', 'Freelance', 'Investment', 'Gift', 'Other']
).map((item) => (
          <Button
            key={item}
            mode={category === item ? 'contained' : 'outlined'}
            buttonColor={category === item ? '#0F8B5F' : undefined}
            textColor={category === item ? '#FFFFFF' : '#0F8B5F'}
            onPress={() => setCategory(item)}
            style={styles.option}
          >
            {item}
          </Button>
        ))}
      </View>

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.options}>
        {['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Net Banking'].map((item) => (
          <Button
            key={item}
            mode={payment === item ? 'contained' : 'outlined'}
            buttonColor={payment === item ? '#0F8B5F' : undefined}
            textColor={payment === item ? '#FFFFFF' : '#0F8B5F'}
            onPress={() => setPayment(item)}
            style={styles.option}
          >
            {item}
          </Button>
        ))}
      </View>

      <Button
        mode="contained"
        buttonColor="#0F8B5F"
        onPress={handleSave}
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
      >
        {type === 'income' ? 'Save Income' : 'Save Expense'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F8B5F',
    marginTop: 35,
  },
  subtitle: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 25,
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  option: {
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
  },
  buttonContent: {
    height: 48,
  },
});
