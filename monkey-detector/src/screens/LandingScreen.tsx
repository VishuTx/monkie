import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { fontSF } from '../theme/typography';
import { colors } from '../theme/colors';

interface LandingScreenProps {
  onEnter: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  // Staggered entrance animations
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(16);

  useEffect(() => {
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    logoY.value = withDelay(200, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));
    cardOpacity.value = withDelay(500, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    cardScale.value = withDelay(500, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    btnY.value = withDelay(900, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* Top emblem */}
          <Animated.View style={[styles.emblemWrap, logoStyle]}>
            <View style={styles.emblemRing}>
              <View style={styles.emblemInner}>
                <Text style={styles.emblemChar}>P</Text>
              </View>
            </View>
            <Text style={styles.versionTag}>SECURITY SUITE · v1.0</Text>
          </Animated.View>

          {/* Main glass panel */}
          <Animated.View style={[styles.glassPanel, cardStyle]}>
            <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />

            <View style={styles.panelContent}>
              <Text style={styles.panelLabel}>SYSTEM IDENTIFICATION</Text>
              <Text style={styles.panelTitle}>Primate{'\n'}Deterrence{'\n'}System</Text>
              <View style={styles.divider} />
              <Text style={styles.panelDesc}>
                AI-powered hostel security & wildlife monitoring.{'\n'}
                Automatic primate intrusion detection using deep learning computer vision.
              </Text>

              {/* Spec rows */}
              <View style={styles.specGrid}>
                <SpecItem label="Model" value="MobileNetV2" />
                <SpecItem label="Input" value="224 × 224 px" />
                <SpecItem label="Classifier" value="Binary CNN" />
                <SpecItem label="Latency" value="Real-time" />
              </View>
            </View>
          </Animated.View>

          {/* Enter button */}
          <Animated.View style={[styles.btnWrap, btnStyle]}>
            <TouchableOpacity style={styles.enterBtn} activeOpacity={0.85} onPress={onEnter}>
              <Text style={styles.enterBtnText}>Enter System</Text>
              <Text style={styles.enterBtnArrow}>→</Text>
            </TouchableOpacity>
            <Text style={styles.footerNote}>Hostel & Campus Wildlife Protection</Text>
          </Animated.View>

        </View>
      </SafeAreaView>
    </View>
  );
};

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <View style={specStyles.item}>
    <Text style={specStyles.label}>{label}</Text>
    <Text style={specStyles.value}>{value}</Text>
  </View>
);

const specStyles = StyleSheet.create({
  item: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.20)',
  },
  label: {
    fontFamily: fontSF,
    fontSize: 10,
    fontWeight: '600',
    color: colors.olive,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '700',
    color: colors.deepGreen,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 20,
  },

  // Emblem
  emblemWrap: {
    alignItems: 'center',
    paddingTop: 10,
  },
  emblemRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: colors.midGreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paleMint,
    marginBottom: 10,
  },
  emblemInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.midGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemChar: {
    fontFamily: fontSF,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  versionTag: {
    fontFamily: fontSF,
    fontSize: 11,
    fontWeight: '600',
    color: colors.olive,
    letterSpacing: 1.5,
  },

  // Glass Panel
  glassPanel: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.25)',
    backgroundColor: 'rgba(216, 243, 220, 0.65)',
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
    flex: 1,
    marginVertical: 16,
  },
  panelContent: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-between',
  },
  panelLabel: {
    fontFamily: fontSF,
    fontSize: 11,
    fontWeight: '700',
    color: colors.midGreen,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  panelTitle: {
    fontFamily: fontSF,
    fontSize: 32,
    fontWeight: '700',
    color: colors.deepGreen,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(107, 112, 92, 0.20)',
    marginBottom: 10,
  },
  panelDesc: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    color: colors.olive,
    lineHeight: 20,
    marginBottom: 12,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Enter Button
  btnWrap: {
    alignItems: 'center',
  },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.midGreen,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    marginBottom: 10,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    gap: 10,
  },
  enterBtnText: {
    fontFamily: fontSF,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  enterBtnArrow: {
    fontFamily: fontSF,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footerNote: {
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '400',
    color: colors.olive,
  },
});
