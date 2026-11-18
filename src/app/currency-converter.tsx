
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
} from 'react-native-paper';

export default function CurrencyConverterScreen() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');

  const [result, setResult] = useState('');
  const [rateDate, setRateDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    const value = Number(amount);
    const from = fromCurrency.trim().toUpperCase();
    const to = toCurrency.trim().toUpperCase();

    if (!amount.trim() || !Number.isFinite(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
      Alert.alert('Invalid Currency', 'Enter valid 3-letter currency codes.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      if (from === to) {
        setResult(value.toFixed(2));
        setRateDate('Same currency');
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v2/rate/${from}/${to}`
      );

      if (!response.ok) {
        throw new Error('Currency rate could not be found.');
      }

      const data = await response.json();
      const convertedAmount = value * data.rate;

      setResult(convertedAmount.toFixed(2));
      setRateDate(`Exchange rate date: ${data.date}`);
    } catch (error) {
      Alert.alert(
        'Conversion Failed',
        'Unable to fetch exchange rates. Please check your internet connection and currency codes.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Currency Converter</Text>
      <Text style={styles.subtitle}>
        Convert currencies using exchange rates
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Amount</Text>

          <TextInput
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            outlineColor="#0F8B5F"
            activeOutlineColor="#0F8B5F"
          />

          <Text style={styles.label}>From Currency</Text>

          <TextInput
            mode="outlined"
            value={fromCurrency}
            onChangeText={setFromCurrency}
            autoCapitalize="characters"
            maxLength={3}
          />

          <Text style={styles.label}>To Currency</Text>

          <TextInput
            mode="outlined"
            value={toCurrency}
            onChangeText={setToCurrency}
            autoCapitalize="characters"
            maxLength={3}
          />

          <Button
            mode="contained"
            buttonColor="#0F8B5F"
            style={styles.button}
            onPress={handleConvert}
            disabled={loading}
          >
            Convert Currency
          </Button>

          {loading && (
            <ActivityIndicator
              animating={true}
              color="#0F8B5F"
              style={styles.loader}
            />
          )}

          {result !== '' && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Converted Amount</Text>
              <Text style={styles.result}>
                {result} {toCurrency.toUpperCase()}
              </Text>
              <Text style={styles.date}>{rateDate}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F8B5F',
    marginTop: 35,
  },
  subtitle: {
    color: '#777777',
    marginBottom: 20,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 7,
  },
  button: {
    marginTop: 25,
    borderRadius: 8,
  },
  loader: {
    marginTop: 15,
  },
  resultBox: {
    backgroundColor: '#E8F5EE',
    padding: 18,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },
  resultLabel: {
    color: '#555555',
  },
  result: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0F8B5F',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: '#777777',
    marginTop: 8,
  },
});
