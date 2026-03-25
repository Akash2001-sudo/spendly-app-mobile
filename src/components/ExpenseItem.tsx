import React, { useMemo } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Expense from '../types/Expense';
import { useDeleteExpense } from '../hooks/useExpenses';
import { useTheme } from '../context/ThemeContext';

interface ExpenseItemProps {
  expense: Expense;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const ExpenseItem = ({
  expense,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
}: ExpenseItemProps) => {
  const deleteExpense = useDeleteExpense();
  const { palette, shadows } = useTheme();
  const styles = useMemo(() => createStyles(palette, shadows), [palette, shadows]);
  const isDeleting = deleteExpense.isPending && deleteExpense.variables === expense.id;

  const handleDelete = () => {
    if (isDeleting) {
      return;
    }

    deleteExpense.mutate(expense.id);
  };

  const handleSelect = () => {
    onToggleSelect?.(expense.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={isSelectionMode ? 0.9 : 1}
      onPress={isSelectionMode ? handleSelect : undefined}
      style={[styles.container, isSelected && styles.containerSelected]}
    >
      {isDeleting ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={palette.primary} />
          <Text style={styles.loadingText}>Deleting...</Text>
        </View>
      ) : null}
      {isSelectionMode ? (
        <TouchableOpacity style={[styles.selectChip, isSelected && styles.selectChipActive]} onPress={handleSelect}>
          <Text style={[styles.selectChipText, isSelected && styles.selectChipTextActive]}>
            {isSelected ? 'Selected' : 'Select'}
          </Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.details}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{expense.category}</Text>
        </View>
        <Text style={styles.description}>{expense.description}</Text>
        <Text style={styles.amount}>Rs. {expense.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{expense.date}</Text>
      </View>
      {!isSelectionMode ? (
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
          disabled={isDeleting}
        >
          <Text style={styles.deleteIcon}>Delete</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const createStyles = (
  palette: ReturnType<typeof useTheme>['palette'],
  shadows: ReturnType<typeof useTheme>['shadows']
) => StyleSheet.create({
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
  containerSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.selectedSurface,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    borderRadius: 26,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  selectChip: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  selectChipText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  selectChipTextActive: {
    color: '#fffdf9',
  },
  details: {
    flex: 1,
    paddingRight: 12,
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
    backgroundColor: palette.dangerSoft,
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
