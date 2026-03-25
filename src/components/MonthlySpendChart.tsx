import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import Expense from '../types/Expense';
import { useGetExpenses } from '../hooks/useExpenses';
import { useTheme } from '../context/ThemeContext';

type MonthlyTotal = {
  key: string;
  label: string;
  shortLabel: string;
  total: number;
};

const chartHeight = 220;
const chartWidth = 312;
const chartPaddingTop = 18;
const chartPaddingBottom = 44;
const chartPaddingHorizontal = 18;
const gridLines = 4;

const formatCurrency = (amount: number) =>
  `Rs. ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)}`;

const getMonthlyData = (expenses: Expense[]): MonthlyTotal[] => {
  const monthlyTotals = new Map<string, MonthlyTotal>();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const existing = monthlyTotals.get(key);

    if (existing) {
      existing.total += expense.amount;
      return;
    }

    monthlyTotals.set(key, {
      key,
      label: date.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      shortLabel: date.toLocaleString('en-IN', { month: 'short' }),
      total: expense.amount,
    });
  });

  return Array.from(monthlyTotals.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6);
};

const MonthlySpendChart = () => {
  const { data: expenses = [], isLoading, isError } = useGetExpenses();
  const { palette, shadows } = useTheme();
  const styles = useMemo(() => createStyles(palette, shadows), [palette, shadows]);

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

  const monthlyData = getMonthlyData(expenses);

  if (monthlyData.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>No expense data available to display chart.</Text>
      </View>
    );
  }

  const totals = monthlyData.map((item) => item.total);
  const maxValue = Math.max(...totals);
  const totalSpend = totals.reduce((sum, value) => sum + value, 0);
  const averageSpend = totalSpend / monthlyData.length;
  const topMonth = monthlyData.reduce((best, current) =>
    current.total > best.total ? current : best
  );
  const plotHeight = chartHeight - chartPaddingTop - chartPaddingBottom;
  const plotWidth = chartWidth - chartPaddingHorizontal * 2;
  const slotWidth = plotWidth / monthlyData.length;
  const barWidth = Math.min(30, slotWidth * 0.52);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>Insights</Text>
      <Text style={styles.title}>Monthly Spending</Text>
      <Text style={styles.subtitle}>
        Your last {monthlyData.length} months, with the busiest month highlighted.
      </Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.summaryCardPrimary]}>
          <Text style={styles.summaryLabel}>Total spend</Text>
          <Text style={styles.summaryValueLight}>{formatCurrency(totalSpend)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Monthly average</Text>
          <Text style={styles.summaryValue}>{formatCurrency(averageSpend)}</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Spend trend</Text>
            <Text style={styles.chartCaption}>Best month: {topMonth.label}</Text>
          </View>
          <View style={styles.highlightPill}>
            <Text style={styles.highlightText}>{formatCurrency(topMonth.total)}</Text>
          </View>
        </View>

        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4cc7c0" />
              <Stop offset="100%" stopColor="#1f6f78" />
            </LinearGradient>
            <LinearGradient id="barGradientMuted" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#f1b889" />
              <Stop offset="100%" stopColor="#dd8f52" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: gridLines + 1 }, (_, index) => {
            const y = chartPaddingTop + (plotHeight / gridLines) * index;
            const value = maxValue - (maxValue / gridLines) * index;

            return (
              <React.Fragment key={`grid-${index}`}>
                <Rect
                  x={chartPaddingHorizontal}
                  y={y}
                  width={plotWidth}
                  height={1}
                  fill={index === gridLines ? palette.border : palette.chartGrid}
                />
                <SvgText
                  x={4}
                  y={y + 4}
                  fill={palette.textMuted}
                  fontSize="10"
                  fontWeight="600"
                >
                  {value <= 0 ? '0' : `${Math.round(value / 1000)}k`}
                </SvgText>
              </React.Fragment>
            );
          })}

          {monthlyData.map((item, index) => {
            const barHeight = maxValue === 0 ? 0 : (item.total / maxValue) * plotHeight;
            const x = chartPaddingHorizontal + slotWidth * index + (slotWidth - barWidth) / 2;
            const y = chartPaddingTop + plotHeight - barHeight;
            const isTopMonth = item.key === topMonth.key;

            return (
              <React.Fragment key={item.key}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={barWidth / 2}
                  fill={isTopMonth ? 'url(#barGradientMuted)' : 'url(#barGradient)'}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - 20}
                  fill={palette.textMuted}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {item.shortLabel}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={Math.max(y - 8, 12)}
                  fill={palette.text}
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {item.total >= 1000 ? `${(item.total / 1000).toFixed(1)}k` : Math.round(item.total)}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>Monthly breakdown</Text>
        {monthlyData
          .slice()
          .reverse()
          .map((item) => {
            const ratio = maxValue === 0 ? 0 : item.total / maxValue;

            return (
              <View key={item.key} style={styles.breakdownRow}>
                <View style={styles.breakdownMeta}>
                  <Text style={styles.breakdownMonth}>{item.label}</Text>
                  <Text style={styles.breakdownAmount}>{formatCurrency(item.total)}</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.max(ratio * 100, 8)}%` }]} />
                </View>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const createStyles = (
  palette: ReturnType<typeof useTheme>['palette'],
  shadows: ReturnType<typeof useTheme>['shadows']
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
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
    color: palette.text,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: palette.surfaceStrong,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
  },
  summaryCardPrimary: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  summaryLabel: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  summaryValueLight: {
    color: '#fffdf9',
    fontSize: 20,
    fontWeight: '800',
  },
  chartCard: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 32,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 16,
    ...shadows.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  chartTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  chartCaption: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  highlightPill: {
    borderRadius: 999,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  highlightText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  breakdownCard: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadows.card,
  },
  breakdownTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  breakdownRow: {
    marginBottom: 14,
  },
  breakdownMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  breakdownMonth: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  breakdownAmount: {
    color: palette.accentStrong,
    fontSize: 14,
    fontWeight: '800',
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.chartGrid,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
});

export default MonthlySpendChart;
