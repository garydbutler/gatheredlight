import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { GatheredText } from './GatheredText';
import { colors, borderRadius, shadows } from '../lib/theme';

interface GatheredButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'warm';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const GatheredButton: React.FC<GatheredButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
  style,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textColor =
    variant === 'primary'
      ? colors.warm.white
      : variant === 'warm'
      ? colors.earth[800]
      : variant === 'ghost'
      ? colors.earth[600]
      : colors.earth[700];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <GatheredText
            variant={size === 'sm' ? 'caption' : 'body'}
            style={[
              { color: textColor, fontWeight: '600' },
              icon ? { marginLeft: 8 } : undefined,
            ]}
          >
            {title}
          </GatheredText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  primary: {
    backgroundColor: colors.amber[600],
    ...shadows.warm,
  },
  secondary: {
    backgroundColor: colors.cream[200],
    borderWidth: 1,
    borderColor: colors.amber[200],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  warm: {
    backgroundColor: colors.gold[100],
    ...shadows.soft,
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  size_md: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  size_lg: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.5,
  },
});
