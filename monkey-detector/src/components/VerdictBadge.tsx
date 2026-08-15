import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerdictType } from '../types/DetectionEvent';
import { colors } from '../theme/colors';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'normal' | 'large';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'large' }) => {
  const isMonkey = verdict === 'MONKEY_DETECTED';

  const config = isMonkey
    ? {
        icon: '⚠️',
        title: 'Primate Detected',
        sub: 'Intrusion confirmed — take action',
        bgColor: 'rgba(201, 134, 26, 0.12)',
        borderColor: colors.borderThin,
        titleColor: colors.amberLight,
        subColor: colors.amberAccent,
        pillBg: colors.amberGlow,
      }
    : {
        icon: '✅',
        title: 'Area Clear',
        sub: 'No primate activity detected',
        bgColor: 'rgba(74, 144, 226, 0.10)',
        borderColor: colors.borderClear,
        titleColor: colors.coldBlueLight,
        subColor: colors.coldBlue,
        pillBg: colors.coldBlueGlow,
      };

  const isLarge = size === 'large';

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
      <View style={[styles.iconPill, { backgroundColor: config.pillBg }]}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      <Text style={[styles.title, { color: config.titleColor, fontSize: isLarge ? 22 : 16 }]}>
        {config.title}
      </Text>
      <Text style={[styles.sub, { color: config.subColor }]}>{config.sub}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  iconPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 26 },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'center',
  },
});
