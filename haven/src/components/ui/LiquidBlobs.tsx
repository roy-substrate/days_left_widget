import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface BlobConfig {
  color: string;
  size: number;
  x: number;
  y: number;
  duration: number;
}

interface LiquidBlobsProps {
  colors?: string[];
}

const DEFAULT_COLORS = ['#0A84FF', '#5E5CE6', '#FF375F'];

function Blob({ color, size, x, y, duration }: BlobConfig) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(40, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(30, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: duration * 0.8, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.15,
          left: x,
          top: y,
        },
        animatedStyle,
      ]}
    />
  );
}

export function LiquidBlobs({ colors: blobColors = DEFAULT_COLORS }: LiquidBlobsProps) {
  const blobs: BlobConfig[] = [
    { color: blobColors[0] || DEFAULT_COLORS[0], size: 200, x: -50, y: 100, duration: 8000 },
    { color: blobColors[1] || DEFAULT_COLORS[1], size: 250, x: 150, y: 300, duration: 10000 },
    { color: blobColors[2] || DEFAULT_COLORS[2], size: 180, x: 50, y: 500, duration: 9000 },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {blobs.map((blob, i) => (
        <Blob key={i} {...blob} />
      ))}
    </View>
  );
}
