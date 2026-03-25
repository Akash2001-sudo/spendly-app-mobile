import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import Expense from '../types/Expense';
import { useDialog } from '../context/DialogContext';

export const useGetExpenses = () =>
  useQuery<Expense[], Error>({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  });

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { showMessage } = useDialog();

  return useMutation<Expense, Error, Omit<Expense, 'id'>>({
    mutationFn: createExpense,
    onSuccess: () => {
      showMessage('Success', 'Expense added successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      showMessage('Error', error.message || 'Failed to add expense.', {
        variant: 'danger',
      });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, Error, Expense>({
    mutationFn: updateExpense,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteExpense,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
    },
  });
};

export const useBulkDeleteExpenses = () => {
  const queryClient = useQueryClient();
  const { showMessage } = useDialog();

  return useMutation<void, Error, string[]>({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => deleteExpense(id)));
    },
    onSuccess: (_, ids) => {
      showMessage('Deleted', `${ids.length} expense${ids.length === 1 ? '' : 's'} removed.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Error deleting expenses:', error);
      showMessage('Error', error.message || 'Failed to delete selected expenses.', {
        variant: 'danger',
      });
    },
  });
};
