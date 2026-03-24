import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Expense from '../types/Expense';
import { useDeleteExpense } from '../hooks/useExpenses';
import { palette, shadows } from '../theme/ui';

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  const deleteExpense = useDeleteExpense();
  const isDeleting = deleteExpense.isPending && deleteExpense.variables === expense.id;

  const handleDelete = () => {
    if (isDeleting) {
      return;
    }

    deleteExpense.mutate(expense.id);
  };

  return (
    <View style={styles.container}>
      {isDeleting ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={palette.primary} />
          <Text style={styles.loadingText}>Deleting...</Text>
        </View>
      ) : null}
      <View style={styles.details}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{expense.category}</Text>
        </View>
        <Text style={styles.description}>{expense.description}</Text>
        <Text style={styles.amount}>Rs. {expense.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{expense.date}</Text>
      </View>
      <TouchableOpacity
        onPress={handleDelete}
        style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
        disabled={isDeleting}
      >
        <Text style={styles.deleteIcon}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 26,
    backgroundColor: palette.surfaceStrong,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 14,
    ...shadows.card,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 250, 245, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  details: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: palette.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  categoryPillText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.accentStrong,
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: palette.textMuted,
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#fbebe7',
    marginLeft: 14,
  },
  deleteButtonDisabled: {
    opacity: 0.45,
  },
  deleteIcon: {
    color: palette.danger,
    fontWeight: '600',
  },
});

export default ExpenseItem;
