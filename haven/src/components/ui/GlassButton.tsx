import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { haptics } from '../../utils/haptics';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'glass';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: GlassButtonProps) {
  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.glass,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'glass' && styles.glassText,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  glass: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  glassText: {
    color: colors.text,
  },
  disabledText: {
    color: colors.text2,
  },
});
