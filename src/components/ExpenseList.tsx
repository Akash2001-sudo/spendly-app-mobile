import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useGetExpenses, useBulkDeleteExpenses } from '../hooks/useExpenses';
import ExpenseItem from './ExpenseItem';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';

const ExpenseList = () => {
  const { data: expenses = [], isLoading, isError } = useGetExpenses();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const bulkDeleteExpenses = useBulkDeleteExpenses();
  const { showConfirm, showMessage } = useDialog();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const isSelectionMode = selectedIds.length > 0;
  const selectedCount = selectedIds.length;
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const isAllSelected = expenses.length > 0 && selectedIds.length === expenses.length;

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  };

  const handleStartSelection = () => {
    if (expenses.length === 0) {
      showMessage('Nothing to delete', 'Add some expenses before using bulk delete.');
      return;
    }

    setSelectedIds((current) => (current.length === 0 ? [expenses[0].id] : current));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(expenses.map((expense) => expense.id));
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) {
      return;
    }

    showConfirm('Delete selected expenses', `Delete ${selectedCount} selected expense${selectedCount === 1 ? '' : 's'}?`, {
      cancelLabel: 'Cancel',
      confirmLabel: 'Delete',
      confirmVariant: 'danger',
      onConfirm: () => {
        bulkDeleteExpenses.mutate(selectedIds, {
          onSuccess: () => {
            setSelectedIds([]);
          },
        });
      },
    });
  };

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
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Overview</Text>
          <Text style={styles.title}>{isSelectionMode ? `${selectedCount} selected` : 'Recent Spendings'}</Text>
        </View>
        <View style={styles.headerActions}>
          {isSelectionMode ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={handleSelectAll}>
                <Text style={styles.actionText}>{isAllSelected ? 'Clear All' : 'Select All'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteActionButton, bulkDeleteExpenses.isPending && styles.actionButtonDisabled]}
                onPress={handleBulkDelete}
                disabled={bulkDeleteExpenses.isPending}
              >
                <Text style={styles.deleteActionText}>
                  {bulkDeleteExpenses.isPending ? 'Deleting...' : 'Delete Selected'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleClearSelection}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={handleStartSelection}>
              <Text style={styles.actionText}>Bulk Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {expenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No spendings yet</Text>
          <Text style={styles.empty}>Add your first expense from the middle tab.</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIdSet.has(item.id)}
              onToggleSelect={toggleSelection}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const createStyles = (palette: ReturnType<typeof useTheme>['palette']) => StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  actionButtonDisabled: {
    opacity: 0.55,
  },
  deleteActionButton: {
    backgroundColor: '#fbebe7',
    borderColor: '#f4d3cb',
  },
  actionText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  deleteActionText: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: '700',
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
