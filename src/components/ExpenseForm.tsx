import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useCreateExpense } from '../hooks/useExpenses';
import { palette, shadows } from '../theme/ui';
import type { HomeTabParamList } from '../navigation/types';

const ExpenseForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const createExpense = useCreateExpense();
  const navigation = useNavigation<MaterialTopTabNavigationProp<HomeTabParamList>>();

  const handleSubmit = () => {
    createExpense.mutate(
      {
        description,
        amount: parseFloat(amount),
        category,
        date,
      },
      {
        onSuccess: () => {
          setDescription('');
          setAmount('');
          setCategory('');
          setDate(new Date().toISOString().split('T')[0]);
          navigation.navigate('Expenses');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Fresh entry</Text>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Rounded inputs, quick capture, less visual noise.</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor={palette.textMuted}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor={palette.textMuted}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor={palette.textMuted}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          placeholderTextColor={palette.textMuted}
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={createExpense.isPending}>
          <Text style={styles.buttonText}>{createExpense.isPending ? 'Adding...' : 'Add Expense'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 20,
  },
  card: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadows.card,
  },
  eyebrow: {
    color: palette.accentStrong,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    color: palette.text,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    marginBottom: 18,
  },
  input: {
    width: '100%',
    height: 56,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: palette.surface,
    color: palette.text,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ExpenseForm;
