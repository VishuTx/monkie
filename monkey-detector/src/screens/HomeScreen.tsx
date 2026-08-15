import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface HomeScreenProps {
  onSelectPickGallery: () => void;
  onSelectCamera: () => void;
  onOpenHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPickGallery,
  onSelectCamera,
  onOpenHistory,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>SECURITY SYSTEM</Text>
          <Text style={styles.headerTitle}>Command Centre</Text>
          <Text style={styles.headerSub}>Choose a scan method to begin detection</Text>
        </View>

        {/* ── Primary Actions ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SCAN INPUT</Text>

          {/* Gallery Upload */}
          <GlassButton onPress={onSelectPickGallery} variant="amber">
            <View style={styles.btnInner}>
              <View style={styles.btnTextGroup}>
                <Text style={[styles.btnTitle, { color: colors.amberLight }]}>Upload Image</Text>
                <Text style={styles.btnSub}>Select a photo from your gallery</Text>
              </View>
              <Text style={[styles.btnArrow, { color: colors.amberAccent }]}>→</Text>
            </View>
          </GlassButton>

          {/* Live Camera */}
          <GlassButton onPress={onSelectCamera} variant="default" style={styles.cameraBtn}>
            <View style={styles.btnInner}>
              <View style={styles.btnTextGroup}>
                <Text style={styles.btnTitle}>Live Camera</Text>
                <Text style={styles.btnSub}>Take a real-time photo for scanning</Text>
              </View>
              <Text style={styles.btnArrow}>→</Text>
            </View>
          </GlassButton>
        </View>

        {/* ── History ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECORDS</Text>

          <GlassButton onPress={onOpenHistory} variant="subtle">
            <View style={styles.btnInner}>
              <View style={styles.btnTextGroup}>
                <Text style={styles.btnTitle}>Detection History</Text>
                <Text style={styles.btnSub}>View past scan results and logs</Text>
              </View>
              <Text style={[styles.btnArrow, { color: colors.coldBlue }]}>→</Text>
            </View>
          </GlassButton>
        </View>

        {/* ── Info Panel ── */}
        <View style={styles.infoPanel}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.infoPanelHighlight} />
          <View style={styles.infoPanelContent}>
            <Text style={styles.infoPanelTitle}>About This System</Text>
            <Text style={styles.infoPanelText}>
              Powered by a MobileNetV2 deep learning model trained on primate vs. background images.
              Upload or capture any image to instantly detect primate presence with a confidence score.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Primate Deterrence System · v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ─── GlassButton sub-component ─── */
interface GlassButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'amber' | 'default' | 'subtle';
  style?: object;
}

const GlassButton: React.FC<GlassButtonProps> = ({ children, onPress, variant = 'default', style }) => {
  const borderColor =
    variant === 'amber'
      ? 'rgba(201, 134, 26, 0.40)'
      : variant === 'subtle'
      ? 'rgba(74, 144, 226, 0.25)'
      : 'rgba(255,255,255,0.10)';

  const bg =
    variant === 'amber'
      ? 'rgba(201, 134, 26, 0.10)'
      : variant === 'subtle'
      ? 'rgba(74, 144, 226, 0.07)'
      : 'rgba(255,255,255,0.04)';

  return (
    <TouchableOpacity
      style={[glassBtn.wrap, { borderColor, backgroundColor: bg }, style]}
      activeOpacity={0.78}
      onPress={onPress}
    >
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      {/* Glass top highlight */}
      <View style={[glassBtn.highlight, { backgroundColor: variant === 'amber' ? 'rgba(201,134,26,0.12)' : 'rgba(255,255,255,0.06)' }]} />
      <View style={glassBtn.content}>{children}</View>
    </TouchableOpacity>
  );
};

const glassBtn = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    zIndex: 2,
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 50,
  },

  // Header
  header: {
    marginBottom: 36,
  },
  headerLabel: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    color: colors.amberAccent,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
    color: colors.textPrimary,
    lineHeight: 38,
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: colors.textSecondary,
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Button internals
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  btnTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  btnSub: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: colors.textSecondary,
  },
  btnArrow: {
    fontSize: 20,
    color: colors.textSecondary,
    fontFamily: 'Outfit_400Regular',
  },
  cameraBtn: {
    marginBottom: 0,
  },

  // Info panel
  infoPanel: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(18,18,28,0.5)',
    marginBottom: 30,
  },
  infoPanelHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  infoPanelContent: {
    padding: 20,
    zIndex: 1,
  },
  infoPanelTitle: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoPanelText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
