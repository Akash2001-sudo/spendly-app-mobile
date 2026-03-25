import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  View,
  type ViewStyle,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext)!;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showMessage } = useDialog();
  const { palette, shadows, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(palette, shadows, isDark), [palette, shadows, isDark]);
  const mascotFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotFloat, {
          toValue: 1,
          duration: 2300,
          useNativeDriver: true,
        }),
        Animated.timing(mascotFloat, {
          toValue: 0,
          duration: 2300,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [mascotFloat]);

  const mascotStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [
      {
        translateY: mascotFloat.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      } as const,
      {
        rotate: mascotFloat.interpolate({
          inputRange: [0, 1],
          outputRange: ['1deg', '-2deg'],
        }),
      } as const,
    ],
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await signup({ username, email, password });
      showMessage('Success', 'Account created successfully');
    } catch (error: any) {
      showMessage('Error', error.response?.data?.error || 'Signup failed', {
        variant: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={styles.themeToggleText}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Animated.View style={[styles.logoFrame, mascotStyle]}>
          <Image
            source={require('../../assets/baby_dino_one.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Build a calm, rounded home for your money habits.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Join Spendly</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={palette.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={palette.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={palette.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Signing up...' : 'Signup'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkAccent}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.credit}>Developed by Akash Patel with ❤️ in Bengaluru</Text>
    </KeyboardAvoidingView>
  );
};

const createStyles = (
  palette: ReturnType<typeof useTheme>['palette'],
  shadows: ReturnType<typeof useTheme>['shadows'],
  isDark: boolean
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: 40,
    right: -18,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: isDark ? '#224b47' : '#d7efe7',
    opacity: isDark ? 0.5 : 0.9,
  },
  glowBottom: {
    position: 'absolute',
    left: -35,
    bottom: 110,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: isDark ? '#244045' : '#f6d7b8',
    opacity: isDark ? 0.42 : 0.45,
  },
  themeToggle: {
    position: 'absolute',
    top: 58,
    right: 24,
    zIndex: 2,
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoFrame: {
    width: 164,
    height: 154,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'visible',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: palette.textMuted,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 34,
    padding: 30,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadows.card,
  },
  credit: {
    marginTop: 18,
    textAlign: 'center',
    color: palette.textMuted,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: palette.surface,
    borderRadius: 22,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontSize: 16,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
  },
  button: {
    width: '100%',
    height: 58,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginTop: 8,
  },
  buttonText: {
    color: '#fffdf9',
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    marginTop: 22,
    textAlign: 'center',
    color: palette.textMuted,
    fontSize: 15,
  },
  linkAccent: {
    color: palette.accentStrong,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
