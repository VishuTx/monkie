import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { fontSF } from '../theme/typography';
import { colors } from '../theme/colors';

interface HomeScreenProps {
  onSelectPickGallery: () => void;
  onSelectCamera: () => void;
  onOpenHistory: () => void;
  onOpenAbout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPickGallery,
  onSelectCamera,
  onOpenHistory,
  onOpenAbout,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Primate Deterrence System</Text>
          <Text style={styles.subTitle}>Hostel & Campus Wildlife Conflict Management</Text>
        </View>

        {/* Navigation Grid */}
        <View style={styles.gridContainer}>
          <GridCard
            badge="01"
            title="Upload Image"
            subtitle="Analyze photo from device gallery"
            onPress={onSelectPickGallery}
            delay={100}
            accentColor={colors.midGreen}
          />

          <GridCard
            badge="02"
            title="Live Camera"
            subtitle="Capture & scan real-time photo"
            onPress={onSelectCamera}
            delay={220}
            accentColor={colors.deepGreen}
          />

          <GridCard
            badge="03"
            title="Detection History"
            subtitle="Review past incident logs & scores"
            onPress={onOpenHistory}
            delay={340}
            accentColor={colors.mint}
          />

          <GridCard
            badge="04"
            title="About & Vision"
            subtitle="Motive, capabilities & future roadmap"
            onPress={onOpenAbout}
            delay={460}
            accentColor={colors.olive}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Primate Deterrence System · v1.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

interface GridCardProps {
  badge: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  delay: number;
  accentColor: string;
}

const GridCard: React.FC<GridCardProps> = ({
  badge,
  title,
  subtitle,
  onPress,
  delay,
  accentColor,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 14, stiffness: 180 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        style={styles.cardTouch}
        activeOpacity={0.88}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
        
        {/* Accent indicator bar */}
        <View style={[styles.cardAccentBar, { backgroundColor: accentColor }]} />

        <View style={styles.cardContent}>
          <View style={styles.badgePill}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
          <View style={styles.arrowRow}>
            <Text style={[styles.arrowText, { color: accentColor }]}>Explore →</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontFamily: fontSF,
    fontSize: 28,
    fontWeight: '700',
    color: colors.deepGreen,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subTitle: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    color: colors.olive,
    textAlign: 'center',
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 28,
  },
  cardWrapper: {
    width: '47.5%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.25)',
    backgroundColor: 'rgba(216, 243, 220, 0.65)',
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTouch: {
    padding: 16,
    minHeight: 165,
    justifyContent: 'space-between',
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 3.5,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgePill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.20)',
  },
  badgeText: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '700',
  },
  cardTitle: {
    fontFamily: fontSF,
    fontSize: 16,
    fontWeight: '700',
    color: colors.deepGreen,
    marginBottom: 4,
  },
  cardSub: {
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '400',
    color: colors.olive,
    lineHeight: 16,
    marginBottom: 10,
  },
  arrowRow: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
  },
  arrowText: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '600',
  },

  // Footer
  footerText: {
    textAlign: 'center',
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '400',
    color: colors.olive,
    letterSpacing: 0.3,
  },
});
