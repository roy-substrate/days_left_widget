import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { haptics } from '../../utils/haptics';
import { MOOD_CONFIG, MoodType } from '../../types/mood';

interface MoodSelectorProps {
  onSelectMood: (mood: MoodType) => void;
}

const MOODS: MoodType[] = ['happy', 'calm', 'sad', 'angry', 'anxious', 'tired'];

export function MoodSelector({ onSelectMood }: MoodSelectorProps) {
  const handleSelect = (mood: MoodType) => {
    haptics.light();
    onSelectMood(mood);
  };

  return (
    <View>
      <Text style={styles.label}>Quick check-in</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOODS.map((mood) => {
          const config = MOOD_CONFIG[mood];
          return (
            <TouchableOpacity
              key={mood}
              activeOpacity={0.7}
              onPress={() => handleSelect(mood)}
            >
              <View style={styles.moodCard}>
                <Text style={styles.emoji}>{config.emoji}</Text>
                <Text style={styles.moodLabel}>{config.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text3,
    fontSize: 13,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    gap: 10,
  },
  moodCard: {
    minWidth: 76,
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  moodLabel: {
    color: colors.text2,
    fontSize: 11,
    marginTop: 6,
  },
});
