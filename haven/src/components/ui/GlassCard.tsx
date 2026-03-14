import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderColor?: string;
  padding?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  borderColor = colors.border,
  padding = 20,
}: GlassCardProps) {
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[styles.blur, { borderColor }, style]}
    >
      <View style={[styles.content, { padding }]}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    backgroundColor: colors.glass,
  },
});
