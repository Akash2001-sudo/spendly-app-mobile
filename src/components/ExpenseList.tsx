import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useGetExpenses } from '../hooks/useExpenses';
import ExpenseItem from './ExpenseItem';
import { palette } from '../theme/ui';

const ExpenseList = () => {
  const { data: expenses = [], isLoading, isError } = useGetExpenses();

  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.error}>Error fetching expenses.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Overview</Text>
        <Text style={styles.title}>Recent Spendings</Text>
      </View>
      {expenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No spendings yet</Text>
          <Text style={styles.empty}>Add your first expense from the middle tab.</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          renderItem={({ item }) => <ExpenseItem expense={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 14,
  },
  eyebrow: {
    color: palette.accentStrong,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
  },
  listContent: {
    paddingBottom: 16,
  },
  error: {
    color: palette.danger,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 10,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  empty: {
    textAlign: 'center',
    color: palette.textMuted,
    lineHeight: 22,
  },
});

export default ExpenseList;
