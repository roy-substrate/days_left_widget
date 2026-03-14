import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { getGreeting } from '../utils/greeting';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { AnimatedEntry } from '../components/ui/AnimatedEntry';
import { SOSCard } from '../components/home/SOSCard';
import { MoodSelector } from '../components/home/MoodSelector';
import { WeeklyChart } from '../components/home/WeeklyChart';
import { CirclePreview } from '../components/home/CirclePreview';
import { MoodType } from '../types/mood';

type RootStackParamList = {
  Home: undefined;
  Circle: undefined;
  MoodCheckIn: { mood: MoodType };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LiquidBlobs />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.overline}>{getGreeting()}</Text>
            <Text style={styles.title}>How are you?</Text>
          </View>

          <AnimatedEntry delay={0}>
            <SOSCard onPress={() => navigation.navigate('Circle')} />
          </AnimatedEntry>

          <AnimatedEntry delay={60} style={styles.section}>
            <MoodSelector
              onSelectMood={(mood) =>
                navigation.navigate('MoodCheckIn', { mood })
              }
            />
          </AnimatedEntry>

          <AnimatedEntry delay={120} style={styles.section}>
            <WeeklyChart />
          </AnimatedEntry>

          <AnimatedEntry delay={180} style={styles.section}>
            <CirclePreview onPress={() => navigation.navigate('Circle')} />
          </AnimatedEntry>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  overline: {
    color: colors.text3,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
});
