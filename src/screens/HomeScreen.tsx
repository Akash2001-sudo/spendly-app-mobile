import React, { useContext, useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import MonthlySpendChart from '../components/MonthlySpendChart';
import type { HomeTabParamList } from '../navigation/types';
import { AuthContext } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();

const HomeScreen = () => {
  const authContext = useContext(AuthContext);
  const { showConfirm } = useDialog();
  const { palette, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const handleLogout = () => {
    showConfirm('Logout', 'Do you want to sign out?', {
      cancelLabel: 'Stay',
      confirmLabel: 'Logout',
      confirmVariant: 'danger',
      onConfirm: () => authContext?.logout(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.eyebrow}>Dashboard</Text>
          <Text style={styles.title}>
            {authContext?.user?.username ? `Hi, ${authContext.user.username}` : 'Spendly'}
          </Text>
          <Text style={styles.subtitle}>Track your spending with a calmer view.</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={styles.themeToggleText}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
      </TouchableOpacity>
      <Tab.Navigator
        id="home-tabs"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarLabelStyle: styles.tabLabel,
          tabBarPressColor: 'transparent',
          tabBarActiveTintColor: palette.text,
          tabBarInactiveTintColor: palette.textMuted,
        }}
      >
        <Tab.Screen name="Expenses" component={ExpenseList} />
        <Tab.Screen name="Add Expense" component={ExpenseForm} />
        <Tab.Screen name="Chart" component={MonthlySpendChart} />
      </Tab.Navigator>
      <Text style={styles.credit}>Developed by Akash Patel with ❤️ in Bengaluru</Text>
    </SafeAreaView>
  );
};

const createStyles = (palette: ReturnType<typeof useTheme>['palette']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: palette.accentStrong,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
    flexShrink: 1,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    marginTop: 4,
    paddingRight: 6,
  },
  logoutButton: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  themeToggle: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 20,
    backgroundColor: palette.surfaceStrong,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  themeToggleText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  tabBar: {
    backgroundColor: palette.surfaceStrong,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: palette.border,
  },
  tabIndicator: {
    backgroundColor: palette.primarySoft,
    height: '100%',
    borderRadius: 20,
  },
  tabLabel: {
    textTransform: 'none',
    fontSize: 13,
    fontWeight: '700',
  },
  credit: {
    textAlign: 'center',
    color: palette.textMuted,
    fontSize: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});

export default HomeScreen;
