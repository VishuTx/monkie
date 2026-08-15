import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'amber' | 'blue';
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  intensity = 35,
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'amber':
        return colors.borderThin;
      case 'blue':
        return colors.borderClear;
      default:
        return colors.surfaceGlassBorder;
    }
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: colors.surfaceGlass,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
});
