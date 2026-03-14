import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { AnimatedEntry } from '../components/ui/AnimatedEntry';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { haptics } from '../utils/haptics';
import { useMoodStore } from '../store/useMoodStore';
import { MoodType, MOOD_CONFIG } from '../types/mood';

type RootStackParamList = {
  MoodCheckIn: { mood?: MoodType };
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MoodCheckIn'>;

const MOOD_TYPES: MoodType[] = ['happy', 'calm', 'sad', 'angry', 'anxious', 'tired'];

export default function MoodCheckInScreen({ navigation, route }: Props) {
  const initialMood = route.params?.mood ?? null;
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(initialMood);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const addEntry = useMoodStore((s) => s.addEntry);

  const savedScale = useSharedValue(0);

  const savedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: savedScale.value }],
  }));

  const blobColors = selectedMood
    ? [
        MOOD_CONFIG[selectedMood].color,
        MOOD_CONFIG[selectedMood].color,
        colors.accent2,
      ]
    : [colors.accent, colors.accent2, colors.pink];

  const handleMoodSelect = (mood: MoodType) => {
    haptics.medium();
    setSelectedMood(mood);
  };

  const handleSave = () => {
    if (!selectedMood) return;
    haptics.success();
    addEntry(selectedMood, note || undefined);
    setSaved(true);
    savedScale.value = withSpring(1, { damping: 12, stiffness: 150 });

    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  if (saved) {
    return (
      <SafeAreaView style={styles.container}>
        <LiquidBlobs colors={blobColors} />
        <View style={styles.savedContainer}>
          <Animated.View style={savedAnimatedStyle}>
            <Text style={styles.savedEmoji}>✨</Text>
          </Animated.View>
          <Text style={styles.savedTitle}>Check-in saved</Text>
          <Text style={styles.savedSubtitle}>Every feeling is valid.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LiquidBlobs colors={blobColors} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>How are you?</Text>
      </View>

      {/* Mood Grid */}
      <AnimatedEntry delay={100}>
        <View style={styles.moodGrid}>
          {MOOD_TYPES.map((mood) => {
            const config = MOOD_CONFIG[mood];
            const isSelected = selectedMood === mood;
            return (
              <TouchableOpacity
                key={mood}
                onPress={() => handleMoodSelect(mood)}
                activeOpacity={0.7}
                style={styles.moodCardWrapper}
              >
                <GlassCard
                  padding={0}
                  borderColor={
                    isSelected
                      ? `rgba(255,255,255,0.3)`
                      : colors.border
                  }
                  style={[
                    styles.moodCard,
                    isSelected && {
                      backgroundColor: `${config.color}33`,
                    },
                  ]}
                >
                  <View style={styles.moodCardContent}>
                    <Text style={styles.moodEmoji}>{config.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        isSelected && { color: colors.text },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </AnimatedEntry>

      {/* Note Input */}
      {selectedMood && (
        <AnimatedEntry delay={0} duration={300}>
          <View style={styles.noteSection}>
            <GlassCard style={styles.noteCard}>
              <TextInput
                style={styles.noteInput}
                placeholder="What's on your mind…"
                placeholderTextColor={colors.text3}
                multiline
                value={note}
                onChangeText={setNote}
                textAlignVertical="top"
              />
            </GlassCard>
          </View>
        </AnimatedEntry>
      )}

      {/* Save Button */}
      {selectedMood && (
        <AnimatedEntry delay={100} duration={300}>
          <View style={styles.saveSection}>
            <GlassButton
              title="Save check-in"
              onPress={handleSave}
              variant="primary"
              style={styles.saveButton}
            />
          </View>
        </AnimatedEntry>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backArrow: {
    fontSize: 20,
    color: colors.text,
  },
  title: {
    ...typography.title1,
    color: colors.text,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  moodCardWrapper: {
    width: '31%',
  },
  moodCard: {
    borderRadius: 20,
  },
  moodCardContent: {
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 38,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.text2,
    fontWeight: '500',
  },
  noteSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  noteCard: {
    borderRadius: 20,
  },
  noteInput: {
    height: 120,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
  },
  saveSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  saveButton: {
    width: '100%',
  },
  savedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  savedTitle: {
    ...typography.title1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  savedSubtitle: {
    ...typography.body,
    color: colors.text2,
    textAlign: 'center',
  },
});
