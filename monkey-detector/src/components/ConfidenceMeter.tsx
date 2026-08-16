import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { fontSF } from '../theme/typography';
import { colors } from '../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ConfidenceMeterProps {
  confidence: number; // 0 to 100
  isMonkey: boolean;
  size?: number;
  strokeWidth?: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  isMonkey,
  size = 175,
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  const strokeColor = isMonkey ? colors.midGreen : colors.mint;

  useEffect(() => {
    animatedProgress.value = withTiming(confidence / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });

    const duration = 1200;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * confidence));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [confidence]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const confidenceLabel =
    confidence >= 85 ? 'High' : confidence >= 60 ? 'Moderate' : 'Low';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(107, 112, 92, 0.20)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={[styles.percentText, { color: colors.deepGreen }]}>{displayValue}%</Text>
        <Text style={styles.levelText}>{confidenceLabel} Confidence</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontFamily: fontSF,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  levelText: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '400',
    color: colors.olive,
    marginTop: 2,
  },
});
