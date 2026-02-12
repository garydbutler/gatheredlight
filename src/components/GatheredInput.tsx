import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { GatheredText } from './GatheredText';
import { colors, borderRadius } from '../lib/theme';

interface GatheredInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
}

export const GatheredInput: React.FC<GatheredInputProps> = ({
  label,
  error,
  containerStyle,
  multiline,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <GatheredText variant="label" style={styles.label}>
          {label}
        </GatheredText>
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          error && styles.error,
          style,
        ]}
        placeholderTextColor={colors.warm.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline={multiline}
        {...props}
      />
      {error && (
        <GatheredText variant="caption" style={styles.errorText}>
          {error}
        </GatheredText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.warm.white,
    borderWidth: 1.5,
    borderColor: colors.cream[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.earth[800],
    fontFamily: 'System',
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  focused: {
    borderColor: colors.amber[400],
    backgroundColor: '#FFFCF5',
  },
  error: {
    borderColor: colors.rose,
  },
  errorText: {
    color: colors.rose,
    marginTop: 4,
  },
});
