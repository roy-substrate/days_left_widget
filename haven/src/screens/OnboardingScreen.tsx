import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { GlassButton } from '../components/ui/GlassButton';
import { AnimatedEntry } from '../components/ui/AnimatedEntry';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useAuthStore } from '../store/useAuthStore';
import { haptics } from '../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  emoji: string;
  title: string;
  description: string;
  blobColors: string[];
}

const slides: Slide[] = [
  {
    emoji: '💛',
    title: "You're not alone",
    description:
      'Connect with your trusted circle — the people who truly care.',
    blobColors: ['#FFD60A', '#FF9F0A', '#FFD60A'],
  },
  {
    emoji: '📝',
    title: 'Feel, express, heal',
    description:
      'Track moods, journal thoughts, and watch your journey unfold.',
    blobColors: ['#5E5CE6', '#0A84FF', '#5E5CE6'],
  },
  {
    emoji: '🫧',
    title: 'Breathe through it',
    description:
      'Guided exercises to calm the storm when life hits hard.',
    blobColors: ['#64D2FF', '#30D158', '#64D2FF'],
  },
];

function FloatingEmoji({ emoji }: { emoji: string }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-10, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
}

export default function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleContinue = () => {
    haptics.light();

    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      setOnboardingComplete(true);
      navigation.replace('Main');
    }
  };

  const isLastSlide = activeIndex === slides.length - 1;

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => (
    <View style={styles.slide}>
      <LiquidBlobs colors={item.blobColors} />
      <View style={styles.slideContent}>
        <AnimatedEntry delay={100}>
          <FloatingEmoji emoji={item.emoji} />
        </AnimatedEntry>

        <AnimatedEntry delay={250}>
          <Text style={styles.title}>{item.title}</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={400}>
          <Text style={styles.description}>{item.description}</Text>
        </AnimatedEntry>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <GlassButton
          title={isLastSlide ? 'Enter Haven' : 'Continue'}
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 17,
    color: colors.text2,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.accent,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.text3,
  },
  button: {
    width: '100%',
  },
});
