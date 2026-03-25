import React, { useContext } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import type { RootStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const authContext = useContext(AuthContext);
  const { isDark, palette } = useTheme();

  if (authContext?.isLoading) {
    return null;
  }

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: palette.background,
          card: palette.surfaceStrong,
          text: palette.text,
          border: palette.border,
          primary: palette.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: palette.background,
          card: palette.surfaceStrong,
          text: palette.text,
          border: palette.border,
          primary: palette.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator id="root-stack" screenOptions={{ headerShown: false }}>
        {authContext?.user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
