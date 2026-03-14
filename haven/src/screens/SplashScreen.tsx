import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/useAuthStore';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);

  // Phase 1: Icon (0ms)
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);

  // Phase 2: Title (300ms)
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  // Phase 3: Subtitle (1000ms)
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

  useEffect(() => {
    // Phase 1: Icon fades in + scales with spring (0ms)
    iconOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    iconScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });

    // Phase 2: "Haven" text fades up (300ms)
    titleOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    titleTranslateY.value = withDelay(
      300,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    // Phase 3: Subtitle fades in (1000ms)
    subtitleOpacity.value = withDelay(
      1000,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    subtitleTranslateY.value = withDelay(
      1000,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    // Auto-navigate after 2.5s
    const timer = setTimeout(() => {
      navigation.replace(onboardingComplete ? 'Main' : 'Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <LiquidBlobs colors={[colors.accent, colors.accent2, colors.pink]} />

      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <Text style={styles.iconEmoji}>🏡</Text>
        </Animated.View>

        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.title}>Haven</Text>
        </Animated.View>

        <Animated.View style={subtitleAnimatedStyle}>
          <Text style={styles.subtitle}>YOUR SAFE SPACE</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 42,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.text3,
  },
});
