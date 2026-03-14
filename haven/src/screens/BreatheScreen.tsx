import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  cancelAnimation,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassCard } from '../components/ui/GlassCard';
import { colors } from '../theme/colors';
import { haptics } from '../utils/haptics';

// Navigation typing
type RootStackParamList = {
  Breathe: undefined;
  [key: string]: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Breathe'>;

// Phase constants
const PHASE_DURATION = 4000; // 4 seconds per phase
const CYCLE_DURATION = 12000; // 12 seconds total

const PHASE_COLORS = {
  breatheIn: '#64D2FF',
  hold: '#5E5CE6',
  breatheOut: '#30D158',
  idle: colors.text2,
};

const PHASE_EMOJIS = {
  breatheIn: '🌬️',
  hold: '✨',
  breatheOut: '🍃',
  idle: '🫧',
};

const PHASE_LABELS = {
  breatheIn: 'Breathe in…',
  hold: 'Hold…',
  breatheOut: 'Breathe out…',
  idle: 'Tap to begin',
};

type Phase = 'breatheIn' | 'hold' | 'breatheOut' | 'idle';

// Tool chips data
const TOOL_CHIPS = [
  { emoji: '🧘', label: 'Body Scan' },
  { emoji: '🌊', label: 'Sounds' },
  { emoji: '🕯️', label: 'Ground' },
];

export default function BreatheScreen({ navigation }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle');
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(0);

  // Reanimated shared values
  const orbScale = useSharedValue(1);
  const ripple1Scale = useSharedValue(0.8);
  const ripple2Scale = useSharedValue(0.8);
  const ripple3Scale = useSharedValue(0.8);
  const ripple1Opacity = useSharedValue(0);
  const ripple2Opacity = useSharedValue(0);
  const ripple3Opacity = useSharedValue(0);
  const phaseProgress = useSharedValue(0); // 0=breatheIn, 1=hold, 2=breatheOut

  const triggerHaptic = useCallback(() => {
    haptics.light();
  }, []);

  const updatePhase = useCallback((phase: Phase) => {
    setCurrentPhase(phase);
  }, []);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setCurrentPhase('breatheIn');
    phaseIndexRef.current = 0;
    haptics.light();

    // Start the orb scale animation: breathe in (scale up), hold, breathe out (scale down), repeat
    orbScale.value = 1;
    orbScale.value = withRepeat(
      withSequence(
        // Breathe in: 1 → 1.45 over 4s
        withTiming(1.45, {
          duration: PHASE_DURATION,
          easing: Easing.inOut(Easing.sin),
        }),
        // Hold: stay at 1.45 for 4s
        withTiming(1.45, {
          duration: PHASE_DURATION,
          easing: Easing.linear,
        }),
        // Breathe out: 1.45 → 1 over 4s
        withTiming(1, {
          duration: PHASE_DURATION,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1, // infinite repeat
      false,
    );

    // Animate phase progress for color interpolation
    phaseProgress.value = 0;
    phaseProgress.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(0.99, { duration: PHASE_DURATION, easing: Easing.linear }),
        withTiming(1, { duration: 0 }),
        withTiming(1.99, { duration: PHASE_DURATION, easing: Easing.linear }),
        withTiming(2, { duration: 0 }),
        withTiming(2.99, { duration: PHASE_DURATION, easing: Easing.linear }),
      ),
      -1,
      false,
    );

    // Start ripple animations
    startRipples();

    // Phase tracking interval for UI label/emoji updates + haptics
    phaseIntervalRef.current = setInterval(() => {
      phaseIndexRef.current = (phaseIndexRef.current + 1) % 3;
      const phases: Phase[] = ['breatheIn', 'hold', 'breatheOut'];
      const nextPhase = phases[phaseIndexRef.current];
      runOnJS(updatePhase)(nextPhase);
      runOnJS(triggerHaptic)();
    }, PHASE_DURATION);
  }, [orbScale, phaseProgress, triggerHaptic, updatePhase]);

  const startRipples = useCallback(() => {
    const rippleDuration = 3000;

    // Ripple 1
    ripple1Opacity.value = 0.6;
    ripple1Scale.value = 0.8;
    ripple1Opacity.value = withRepeat(
      withTiming(0, { duration: rippleDuration, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    ripple1Scale.value = withRepeat(
      withTiming(3, { duration: rippleDuration, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );

    // Ripple 2 (staggered 1s)
    ripple2Opacity.value = 0;
    ripple2Scale.value = 0.8;
    ripple2Opacity.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 0 }),
          withTiming(0, { duration: rippleDuration, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
    ripple2Scale.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 0 }),
          withTiming(3, { duration: rippleDuration, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );

    // Ripple 3 (staggered 2s)
    ripple3Opacity.value = 0;
    ripple3Scale.value = 0.8;
    ripple3Opacity.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 0 }),
          withTiming(0, { duration: rippleDuration, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
    ripple3Scale.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 0 }),
          withTiming(3, { duration: rippleDuration, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [ripple1Scale, ripple1Opacity, ripple2Scale, ripple2Opacity, ripple3Scale, ripple3Opacity]);

  const stopBreathing = useCallback(() => {
    setIsActive(false);
    setCurrentPhase('idle');
    phaseIndexRef.current = 0;

    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
      phaseIntervalRef.current = null;
    }

    // Cancel all animations and reset
    cancelAnimation(orbScale);
    cancelAnimation(phaseProgress);
    cancelAnimation(ripple1Scale);
    cancelAnimation(ripple1Opacity);
    cancelAnimation(ripple2Scale);
    cancelAnimation(ripple2Opacity);
    cancelAnimation(ripple3Scale);
    cancelAnimation(ripple3Opacity);

    orbScale.value = withTiming(1, { duration: 400 });
    ripple1Opacity.value = withTiming(0, { duration: 300 });
    ripple2Opacity.value = withTiming(0, { duration: 300 });
    ripple3Opacity.value = withTiming(0, { duration: 300 });
    phaseProgress.value = 0;
  }, [
    orbScale, phaseProgress,
    ripple1Scale, ripple1Opacity,
    ripple2Scale, ripple2Opacity,
    ripple3Scale, ripple3Opacity,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
      }
    };
  }, []);

  const handleChipPress = useCallback((label: string) => {
    Alert.alert(label, 'Coming soon');
  }, []);

  // Get current phase color
  const phaseColor = PHASE_COLORS[currentPhase];

  // Blob colors based on current phase
  const blobColors = isActive
    ? [phaseColor, colors.accent2, phaseColor]
    : [colors.accent, colors.accent2, colors.pink];

  // Animated styles
  const orbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const ripple1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ripple1Scale.value }],
    opacity: ripple1Opacity.value,
  }));

  const ripple2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ripple2Scale.value }],
    opacity: ripple2Opacity.value,
  }));

  const ripple3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ripple3Scale.value }],
    opacity: ripple3Opacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <LiquidBlobs colors={blobColors} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Breathe</Text>
          <Text style={styles.subtitle}>4-4-4 breathing</Text>
        </View>

        {/* Central Breathing Orb */}
        <View style={styles.orbContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={isActive ? undefined : startBreathing}
            disabled={isActive}
            style={styles.orbTouchable}
          >
            <Animated.View style={[styles.orbWrapper, orbAnimatedStyle]}>
              {/* Ripple rings */}
              <Animated.View
                style={[
                  styles.ripple,
                  { borderColor: phaseColor },
                  ripple1Style,
                ]}
              />
              <Animated.View
                style={[
                  styles.ripple,
                  { borderColor: phaseColor },
                  ripple2Style,
                ]}
              />
              <Animated.View
                style={[
                  styles.ripple,
                  { borderColor: phaseColor },
                  ripple3Style,
                ]}
              />

              {/* Outer ring */}
              <View
                style={[
                  styles.outerRing,
                  {
                    borderColor: phaseColor,
                    backgroundColor: isActive ? 'transparent' : colors.glass,
                  },
                ]}
              >
                {/* Inner orb */}
                <View
                  style={[
                    styles.innerOrb,
                    { backgroundColor: phaseColor },
                  ]}
                >
                  <Text style={styles.phaseEmoji}>
                    {PHASE_EMOJIS[currentPhase]}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Phase Text */}
        <Text style={[styles.phaseText, { color: phaseColor }]}>
          {PHASE_LABELS[currentPhase]}
        </Text>

        {/* Stop Button */}
        {isActive && (
          <View style={styles.stopButtonContainer}>
            <GlassButton
              title="Stop"
              onPress={stopBreathing}
              variant="glass"
              style={styles.stopButton}
            />
          </View>
        )}

        {/* Tool Chips */}
        <View style={styles.chipsContainer}>
          {TOOL_CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip.label}
              style={styles.chip}
              onPress={() => handleChipPress(chip.label)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>
                {chip.emoji} {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text2,
  },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseEmoji: {
    fontSize: 36,
  },
  phaseText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  stopButtonContainer: {
    marginBottom: 16,
  },
  stopButton: {
    paddingHorizontal: 48,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    paddingBottom: 8,
  },
  chip: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});
