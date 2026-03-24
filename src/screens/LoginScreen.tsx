import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { palette, shadows } from '../theme/ui';
import { useDialog } from '../context/DialogContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext)!;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showMessage } = useDialog();
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
          outputRange: ['-1deg', '2deg'],
        }),
      } as const,
    ],
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await login({ email, password });
      showMessage('Success', 'Logged in successfully');
    } catch (error: any) {
      showMessage('Error', error.response?.data?.error || 'Login failed', {
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
      <View style={styles.header}>
        <Animated.View style={[styles.logoFrame, mascotStyle]}>
          <Image
            source={require('../../assets/baby_dino_one.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>A softer way to track everyday spending.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sign In</Text>
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
          <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkAccent}>Signup</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.credit}>Developed by Akash Patel with ❤️ in Bengaluru</Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: 48,
    left: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#f6d7b8',
    opacity: 0.5,
  },
  glowBottom: {
    position: 'absolute',
    right: -30,
    bottom: 120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#d7efe7',
    opacity: 0.8,
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
    paddingHorizontal: 20,
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

export default LoginScreen;
