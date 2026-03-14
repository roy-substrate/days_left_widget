import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { AnimatedEntry } from '../components/ui/AnimatedEntry';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { haptics } from '../utils/haptics';
import { useJournalStore } from '../store/useJournalStore';
import { formatDate } from '../utils/time';

type RootStackParamList = {
  Journal: undefined;
  [key: string]: undefined | object;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Journal'>;

export default function JournalScreen({ navigation }: Props) {
  const [content, setContent] = useState('');
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const getTodayPrompt = useJournalStore((s) => s.getTodayPrompt);
  const todayPrompt = getTodayPrompt();

  const handleSave = () => {
    if (!content.trim()) return;
    haptics.success();
    addEntry(todayPrompt, content.trim());
    setContent('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LiquidBlobs colors={['#5E5CE6', '#0A84FF', '#5E5CE6']} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedEntry delay={0}>
          <Text style={styles.header}>Journal</Text>
        </AnimatedEntry>

        {/* Prompt Card */}
        <AnimatedEntry delay={100}>
          <GlassCard
            borderColor="rgba(94,92,230,0.2)"
            style={styles.promptCard}
          >
            <View style={styles.promptTint} />
            <Text style={styles.promptOverline}>TODAY'S PROMPT</Text>
            <Text style={styles.promptText}>{todayPrompt}</Text>
          </GlassCard>
        </AnimatedEntry>

        {/* Journal Editor */}
        <AnimatedEntry delay={200}>
          <GlassCard style={styles.editorCard}>
            <TextInput
              style={styles.editorInput}
              placeholder="Start writing…"
              placeholderTextColor={colors.text3}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />
          </GlassCard>
        </AnimatedEntry>

        {/* Save Button */}
        <AnimatedEntry delay={300}>
          <GlassButton
            title="Save entry"
            onPress={handleSave}
            variant="primary"
            disabled={!content.trim()}
            style={[
              styles.saveButton,
              { opacity: content.trim() ? 1 : 0.4 },
            ]}
          />
        </AnimatedEntry>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <AnimatedEntry delay={400}>
            <Text style={styles.recentLabel}>Recent</Text>
            {entries.map((entry, index) => (
              <AnimatedEntry key={entry.id} delay={450 + index * 80}>
                <GlassCard style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    {entry.mood && (
                      <Text style={styles.entryMoodEmoji}>{entry.mood}</Text>
                    )}
                    <Text style={styles.entryDate}>
                      {formatDate(new Date(entry.createdAt))}
                    </Text>
                  </View>
                  <Text style={styles.entryPreview} numberOfLines={2}>
                    {entry.content}
                  </Text>
                </GlassCard>
              </AnimatedEntry>
            ))}
          </AnimatedEntry>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  promptCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  promptTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(94,92,230,0.12)',
    borderRadius: 20,
  },
  promptOverline: {
    ...typography.overline,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
  },
  editorCard: {
    marginBottom: spacing.md,
  },
  editorInput: {
    height: 150,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  saveButton: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  recentLabel: {
    ...typography.headline,
    color: colors.text2,
    marginBottom: spacing.md,
  },
  entryCard: {
    marginBottom: spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  entryMoodEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  entryDate: {
    ...typography.caption,
    color: colors.text2,
  },
  entryPreview: {
    fontSize: 13,
    color: colors.text2,
    lineHeight: 20,
  },
});
