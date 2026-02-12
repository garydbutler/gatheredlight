import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';

interface GatheredTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'quote';
  color?: string;
  center?: boolean;
}

export const GatheredText: React.FC<GatheredTextProps> = ({
  variant = 'body',
  color,
  center,
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        styles[variant],
        color ? { color } : undefined,
        center ? { textAlign: 'center' } : undefined,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.earth[800],
    letterSpacing: -0.5,
    lineHeight: 40,
    // Would use Playfair Display when loaded
    fontFamily: 'System',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.earth[800],
    letterSpacing: -0.3,
    lineHeight: 32,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.earth[700],
    lineHeight: 26,
    fontFamily: 'System',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.earth[700],
    lineHeight: 24,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.warm.textMuted,
    lineHeight: 18,
    fontFamily: 'System',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warm.textLight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  quote: {
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.earth[600],
    lineHeight: 28,
    fontFamily: 'System',
  },
});
