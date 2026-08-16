import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { fontSF } from '../theme/typography';
import { colors } from '../theme/colors';

interface BackButtonProps {
  onPress: () => void;
  title?: string;
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  title = 'Back',
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.chevron}>‹</Text>
        <Text style={styles.label}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(216, 243, 220, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.25)',
    gap: 4,
  },
  chevron: {
    fontFamily: fontSF,
    fontSize: 20,
    fontWeight: '700',
    color: colors.deepGreen,
    marginTop: -2,
  },
  label: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '600',
    color: colors.deepGreen,
  },
});
