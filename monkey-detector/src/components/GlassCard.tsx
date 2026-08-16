import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'mint' | 'olive';
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  intensity = 40,
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'mint':
        return colors.borderClear;
      case 'olive':
        return colors.borderThin;
      default:
        return colors.surfaceGlassBorder;
    }
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }, style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: colors.surfaceGlass,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
});
