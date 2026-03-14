import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../ui/GlassCard';
import { colors } from '../../theme/colors';
import { useMoodStore } from '../../store/useMoodStore';
import { MOOD_CONFIG, MoodType } from '../../types/mood';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MOOD_POSITIVITY: Record<MoodType, number> = {
  happy: 1,
  calm: 0.8,
  tired: 0.4,
  sad: 0.3,
  anxious: 0.2,
  angry: 0.1,
};

const MIN_BAR_HEIGHT = 20;
const MAX_BAR_HEIGHT = 80;

interface DayEntry {
  mood: MoodType | null;
  dayLabel: string;
}

export function WeeklyChart() {
  const entries = useMoodStore((s) => s.entries);

  const weekData = useMemo((): DayEntry[] => {
    const now = new Date();
    const result: DayEntry[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000);
      const dayIndex = (date.getDay() + 6) % 7; // Monday=0
      const dayLabel = DAY_LABELS[dayIndex];

      const entry = entries.find((e) => {
        const entryDate = new Date(e.createdAt);
        return (
          entryDate.getFullYear() === date.getFullYear() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getDate() === date.getDate()
        );
      });

      result.push({
        mood: entry ? entry.mood : null,
        dayLabel,
      });
    }

    return result;
  }, [entries]);

  return (
    <GlassCard>
      <Text style={styles.title}>This week</Text>
      <View style={styles.chartRow}>
        {weekData.map((day, index) => {
          const config = day.mood ? MOOD_CONFIG[day.mood] : null;
          const positivity = day.mood ? MOOD_POSITIVITY[day.mood] : 0;
          const barHeight =
            MIN_BAR_HEIGHT + positivity * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);

          return (
            <View key={index} style={styles.column}>
              <Text style={styles.emoji}>
                {config ? config.emoji : ''}
              </Text>
              <View style={styles.barContainer}>
                {config ? (
                  <LinearGradient
                    colors={[config.color, `${config.color}66`]}
                    style={[styles.bar, { height: barHeight }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.bar,
                      styles.emptyBar,
                      { height: MIN_BAR_HEIGHT },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.dayLabel}>{day.dayLabel}</Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 16,
    marginBottom: 6,
    height: 20,
  },
  barContainer: {
    justifyContent: 'flex-end',
    height: MAX_BAR_HEIGHT,
  },
  bar: {
    width: 24,
    borderRadius: 12,
  },
  emptyBar: {
    backgroundColor: colors.glass,
  },
  dayLabel: {
    color: colors.text3,
    fontSize: 10,
    marginTop: 6,
  },
});
