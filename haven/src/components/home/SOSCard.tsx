import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { colors } from '../../theme/colors';
import { haptics } from '../../utils/haptics';

interface SOSCardProps {
  onPress: () => void;
}

export function SOSCard({ onPress }: SOSCardProps) {
  const handlePress = () => {
    haptics.medium();
    onPress();
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <GlassCard
        borderColor="rgba(255,55,95,0.2)"
        style={styles.card}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>{'🆘'}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Need to talk now?</Text>
            <Text style={styles.subtitle}>Tap to reach your safe circle</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,55,95,0.15)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.text2,
    fontSize: 14,
    marginTop: 2,
  },
});
