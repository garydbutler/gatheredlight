import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from './GatheredText';
import { GatheredButton } from './GatheredButton';
import { colors, spacing } from '../lib/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={48} color={colors.amber[300]} />
    </View>
    <GatheredText variant="h3" center style={styles.title}>
      {title}
    </GatheredText>
    <GatheredText variant="body" center style={styles.message}>
      {message}
    </GatheredText>
    {actionLabel && onAction && (
      <GatheredButton
        title={actionLabel}
        onPress={onAction}
        variant="warm"
        style={styles.button}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.warm.textMuted,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.sm,
  },
});
