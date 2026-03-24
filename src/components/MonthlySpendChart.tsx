import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Expense from '../types/Expense';
import { useGetExpenses } from '../hooks/useExpenses';
import { palette, shadows } from '../theme/ui';

const screenWidth = Dimensions.get('window').width;

const MonthlySpendChart = () => {
  const { data: expenses = [], isLoading, isError } = useGetExpenses();

  const aggregateMonthlyData = (exp: Expense[]) => {
    const monthlyData: { [key: string]: number } = {};

    exp.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + expense.amount;
    });

    return Object.keys(monthlyData)
      .map((key) => ({ month: key, total: monthlyData[key] }))
      .sort((a, b) => {
        const dateA = new Date(`1 ${a.month}`);
        const dateB = new Date(`1 ${b.month}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>Loading chart...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>Error loading chart data.</Text>
      </View>
    );
  }

  const chartData = aggregateMonthlyData(expenses);

  if (chartData.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>No expense data available to display chart.</Text>
      </View>
    );
  }

  const data = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        data: chartData.map((item) => item.total),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Insights</Text>
      <Text style={styles.title}>Monthly Spends</Text>
      <View style={styles.chartCard}>
        <BarChart
          data={data}
          width={screenWidth - 72}
          height={220}
          yAxisSuffix=""
          yAxisLabel="Rs. "
          chartConfig={{
            backgroundColor: palette.primary,
            backgroundGradientFrom: '#246f73',
            backgroundGradientTo: '#4e9f8c',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 24,
            },
          }}
          style={styles.chart}
        />
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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
    padding: 20,
  },
  stateText: {
    color: palette.textMuted,
    textAlign: 'center',
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
    marginBottom: 20,
    color: palette.text,
  },
  chartCard: {
    borderRadius: 32,
    padding: 16,
    backgroundColor: palette.surfaceStrong,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    ...shadows.card,
  },
  chart: {
    marginVertical: 4,
    borderRadius: 24,
  },
});

export default MonthlySpendChart;
