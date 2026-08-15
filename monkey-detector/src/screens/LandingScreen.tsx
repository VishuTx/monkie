import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

interface LandingScreenProps {
  onEnter: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const insets = useSafeAreaInsets();

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
      {/* Subtle grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* Top emblem */}
          <Animated.View style={[styles.emblemWrap, logoStyle]}>
            <View style={styles.emblemRing}>
              <View style={styles.emblemInner}>
                <Text style={styles.emblemChar}>P</Text>
              </View>
            </View>
            <View style={styles.emblemLine} />
            <Text style={styles.versionTag}>SECURITY SUITE · v1.0</Text>
          </Animated.View>

          {/* Main glass panel */}
          <Animated.View style={[styles.glassPanel, cardStyle]}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            {/* Glass highlight at top */}
            <View style={styles.glassHighlight} />

            <View style={styles.panelContent}>
              <Text style={styles.panelLabel}>SYSTEM IDENTIFICATION</Text>
              <Text style={styles.panelTitle}>Primate{'\n'}Deterrence{'\n'}System</Text>
              <View style={styles.divider} />
              <Text style={styles.panelDesc}>
                AI-powered hostel security monitoring.{'\n'}
                Automatic primate intrusion detection{'\n'}
                using deep learning computer vision.
              </Text>

              {/* Spec rows */}
              <View style={styles.specGrid}>
                <SpecItem label="Model" value="MobileNetV2" />
                <SpecItem label="Input" value="224 × 224 px" />
                <SpecItem label="Accuracy" value="Binary CNN" />
                <SpecItem label="Latency" value="Real-time" />
              </View>
            </View>
          </Animated.View>

          {/* Enter button */}
          <Animated.View style={[styles.btnWrap, btnStyle]}>
            <TouchableOpacity style={styles.enterBtn} activeOpacity={0.82} onPress={onEnter}>
              <Text style={styles.enterBtnText}>Enter System</Text>
              <Text style={styles.enterBtnArrow}>→</Text>
            </TouchableOpacity>
            <Text style={styles.footerNote}>Authorized personnel only</Text>
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Outfit_600SemiBold',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    // Subtle radial glow at center-top
    backgroundColor: 'transparent',
    borderRadius: 999,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },

  // Emblem
  emblemWrap: {
    alignItems: 'center',
    paddingTop: 10,
  },
  emblemRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: colors.amberAccent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201, 134, 26, 0.08)',
    marginBottom: 14,
  },
  emblemInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.amberGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemChar: {
    fontSize: 24,
    fontFamily: 'Cinzel_700Bold',
    color: colors.amberLight,
    letterSpacing: 2,
  },
  emblemLine: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(201, 134, 26, 0.3)',
    marginBottom: 10,
  },
  versionTag: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Glass Panel
  glassPanel: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(18, 18, 28, 0.60)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
    flex: 1,
    marginVertical: 18,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    zIndex: 2,
  },
  panelContent: {
    padding: 26,
    zIndex: 1,
    flex: 1,
  },
  panelLabel: {
    fontSize: 10,
    color: colors.amberAccent,
    fontFamily: 'Outfit_400Regular',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  panelTitle: {
    fontSize: 38,
    fontFamily: 'Cinzel_700Bold',
    color: colors.textPrimary,
    lineHeight: 46,
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(201, 134, 26, 0.25)',
    marginBottom: 16,
  },
  panelDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 20,
    marginBottom: 20,
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
    backgroundColor: colors.amberAccent,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    marginBottom: 12,
    shadowColor: colors.amberAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
    gap: 10,
  },
  enterBtnText: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    letterSpacing: 0.4,
  },
  enterBtnArrow: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Outfit_600SemiBold',
  },
  footerNote: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Outfit_400Regular',
    letterSpacing: 0.5,
  },
});
