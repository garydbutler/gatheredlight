import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { GatheredInput } from '../components/GatheredInput';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Welcome', mode === 'signin' ? 'Welcome back.' : 'Your account has been created.');
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <Ionicons name="flame" size={44} color={colors.amber[400]} />
        </View>
        <GatheredText variant="h1" center style={styles.appName}>
          GatheredLight
        </GatheredText>
        <GatheredText variant="quote" center style={styles.tagline}>
          Where memories find their way home
        </GatheredText>
      </View>

      {/* Form */}
      <View style={[styles.formCard, shadows.soft]}>
        <GatheredText variant="h3" center style={styles.formTitle}>
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </GatheredText>

        {mode === 'signup' && (
          <GatheredInput
            label="Your Name"
            placeholder="How should we know you?"
            value={name}
            onChangeText={setName}
          />
        )}

        <GatheredInput
          label="Email"
          placeholder="you@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <GatheredInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <GatheredButton
          title={mode === 'signin' ? 'Sign In' : 'Create Account'}
          onPress={handleAuth}
          size="lg"
          loading={loading}
        />

        <TouchableOpacity
          onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={styles.toggleButton}
        >
          <GatheredText variant="body" center style={styles.toggleText}>
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </GatheredText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warm.offWhite,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl + 20,
    paddingBottom: spacing.xxxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.warm,
  },
  appName: {
    fontSize: 34,
    marginBottom: spacing.xs,
  },
  tagline: {
    color: colors.warm.textMuted,
  },
  formCard: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  formTitle: {
    marginBottom: spacing.xl,
  },
  toggleButton: {
    marginTop: spacing.lg,
  },
  toggleText: {
    color: colors.amber[600],
  },
});
