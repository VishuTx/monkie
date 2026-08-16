import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerdictType } from '../types/DetectionEvent';
import { fontSF } from '../theme/typography';
import { colors } from '../theme/colors';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'normal' | 'large';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'large' }) => {
  const isMonkey = verdict === 'MONKEY_DETECTED';

  const config = isMonkey
    ? {
        tag: 'INTRUSION DETECTED',
        title: 'Intrusion by Primate Detected',
        sub: 'Intrusion confirmed — Primate detected',
        bgColor: 'rgba(64, 145, 108, 0.16)',
        borderColor: colors.midGreen,
        titleColor: colors.deepGreen,
        subColor: colors.midGreen,
        dotColor: colors.midGreen,
      }
    : {
        tag: 'AREA CLEAR',
        title: 'Safe',
        sub: 'No primate detected — Area safe',
        bgColor: 'rgba(216, 243, 220, 0.60)',
        borderColor: colors.mint,
        titleColor: colors.deepGreen,
        subColor: colors.olive,
        dotColor: colors.mint,
      };

  const isLarge = size === 'large';

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
      <View style={styles.badgeTopRow}>
        <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
        <Text style={[styles.tagText, { color: config.dotColor }]}>{config.tag}</Text>
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
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  badgeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.15)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  tagText: {
    fontFamily: fontSF,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontFamily: fontSF,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
  },
});
