import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { GlassCard } from '../components/GlassCard';
import { manualUploadSource } from '../services/detectionSource/ManualUploadSource';
import { DetectionEvent } from '../types/DetectionEvent';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DetectScreenProps {
  initialImageUri?: string | null;
  initialMode?: 'gallery' | 'camera';
  onAnalysisComplete: (event: DetectionEvent) => void;
  onBack: () => void;
}

export const DetectScreen: React.FC<DetectScreenProps> = ({
  initialImageUri = null,
  initialMode = 'gallery',
  onAnalysisComplete,
  onBack,
}) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(initialImageUri);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<boolean>(initialMode === 'camera');
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  // Scanning animation
  const scanY = useSharedValue(0);
  const analyzeRing = useSharedValue(1);

  useEffect(() => {
    if (isAnalyzing) {
      analyzeRing.value = withRepeat(
        withTiming(1.15, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      analyzeRing.value = 1;
    }
  }, [isAnalyzing]);

  // Scan line animation for live camera
  useEffect(() => {
    if (cameraMode) {
      scanY.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    } else {
      scanY.value = 0;
    }
  }, [cameraMode]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: analyzeRing.value }],
  }));

  const animatedScanLineStyle = useAnimatedStyle(() => ({
    top: `${scanY.value * 90}%`,
  }));

  // ─── Camera permission & open ───
  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera Access Denied', 'Please enable camera permission in your device settings to use live scanning.');
        return;
      }
    }
    setSelectedImageUri(null);
    setCameraMode(true);
  };

  // ─── Gallery picker ───
  const handlePickGallery = async () => {
    setCameraMode(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  // ─── Take a photo from camera ───
  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false });
      if (photo?.uri) {
        setSelectedImageUri(photo.uri);
        setCameraMode(false);
      }
    } catch (e) {
      Alert.alert('Capture Failed', 'Could not take a photo. Please try again.');
    }
  };

  // ─── Run Analysis ───
  const handleRunAnalysis = async () => {
    if (!selectedImageUri) {
      Alert.alert('No Image', 'Please select or capture an image before running a scan.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const event = await manualUploadSource.submit(selectedImageUri);
      setIsAnalyzing(false);
      onAnalysisComplete(event);
    } catch (err: any) {
      setIsAnalyzing(false);
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Could not reach the detection server. Make sure the backend is running and reachable.';
      Alert.alert('Scan Failed', message);
    }
  };

  // ─────────────────────────────────
  // LIVE CAMERA FULL-SCREEN VIEW
  // ─────────────────────────────────
  if (cameraMode) {
    return (
      <View style={styles.cameraFullScreen}>
        {/* Camera feed — NO children allowed */}
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
        />

        {/* All overlays sit outside CameraView in a sibling absolute View */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* Top Controls */}
          <View style={[styles.cameraTopBar, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.camTopBtn} onPress={() => setCameraMode(false)}>
              <Text style={styles.camTopBtnText}>✕  Close</Text>
            </TouchableOpacity>
            <View style={styles.camTitlePill}>
              <View style={styles.recDot} />
              <Text style={styles.camTitleText}>Live Scanner</Text>
            </View>
            <TouchableOpacity
              style={styles.camTopBtn}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
              <Text style={styles.camTopBtnText}>Flip</Text>
            </TouchableOpacity>
          </View>

          {/* Viewfinder Frame */}
          <View style={styles.viewfinderWrapper} pointerEvents="none">
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
            </View>
            <Text style={styles.viewfinderHint}>Position subject within frame</Text>
          </View>

          {/* Bottom Controls */}
          <View style={[styles.cameraBottomBar, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity style={styles.galleryThumb} onPress={handlePickGallery}>
              <Text style={styles.galleryThumbLabel}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shutterOuter} onPress={capturePhoto} activeOpacity={0.85}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            <View style={{ width: 60 }} />
          </View>
        </View>
      </View>
    );
  }

  // ─────────────────────────────────
  // IMAGE PREVIEW + ANALYZE VIEW
  // ─────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Image Scan</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <GlassCard style={styles.loadingCard}>
            <Animated.View style={[styles.analyzeRing, animatedRingStyle]}>
              <ActivityIndicator size="large" color={colors.amberAccent} />
            </Animated.View>
            <Text style={styles.loadingTitle}>Scanning Image...</Text>
            <Text style={styles.loadingSubtitle}>Running primate detection model</Text>
          </GlassCard>
        </View>
      )}

      {/* Image Preview Area */}
      <View style={styles.previewArea}>
        {selectedImageUri ? (
          <Image source={{ uri: selectedImageUri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📸</Text>
            <Text style={styles.placeholderTitle}>No Image Selected</Text>
            <Text style={styles.placeholderSub}>Choose from gallery or take a photo to begin</Text>
          </View>
        )}
      </View>

      {/* Bottom Action Panel */}
      <View style={styles.bottomPanel}>
        {/* Source Row */}
        <View style={styles.sourceRow}>
          <TouchableOpacity style={styles.sourceButton} onPress={handlePickGallery} activeOpacity={0.8}>
            <Text style={styles.sourceEmoji}>🖼️</Text>
            <Text style={styles.sourceLabel}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.sourceButton, styles.cameraSourceButton]} onPress={openCamera} activeOpacity={0.8}>
            <Text style={styles.sourceEmoji}>📷</Text>
            <Text style={[styles.sourceLabel, { color: colors.amberLight }]}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={[styles.scanButton, !selectedImageUri && styles.scanButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleRunAnalysis}
          disabled={!selectedImageUri || isAnalyzing}
        >
          <Text style={styles.scanButtonText}>
            {isAnalyzing ? 'Scanning...' : 'Run Detection Scan'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const CORNER_SIZE = 22;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backButton: { padding: 4 },
  backText: { fontSize: 16, color: colors.amberAccent, fontFamily: 'Outfit_600SemiBold' },
  headerTitle: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: colors.textPrimary, letterSpacing: 0.3 },

  // ── Preview ──
  previewArea: {
    flex: 1,
    margin: 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  previewImage: { width: '100%', height: '100%' },
  placeholderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  placeholderIcon: { fontSize: 54, marginBottom: 14 },
  placeholderTitle: { fontSize: 17, fontFamily: 'Outfit_700Bold', color: colors.textPrimary, marginBottom: 8 },
  placeholderSub: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  // ── Bottom Panel ──
  bottomPanel: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  sourceRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  sourceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    gap: 8,
  },
  cameraSourceButton: {
    backgroundColor: 'rgba(201, 134, 26, 0.1)',
    borderColor: colors.borderThin,
  },
  sourceEmoji: { fontSize: 18 },
  sourceLabel: { fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: colors.textPrimary },
  scanButton: {
    backgroundColor: colors.amberAccent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.amberAccent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  scanButtonDisabled: { backgroundColor: colors.textMuted, shadowOpacity: 0 },
  scanButtonText: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#fff', letterSpacing: 0.4 },

  // ── Loading Overlay ──
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 99,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingCard: { width: '100%', alignItems: 'center', paddingVertical: 40 },
  analyzeRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.amberAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    backgroundColor: colors.amberGlow,
  },
  loadingTitle: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: colors.textPrimary, marginBottom: 6 },
  loadingSubtitle: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: colors.textSecondary },

  // ────────────────────────────────
  // FULL-SCREEN CAMERA STYLES
  // ────────────────────────────────
  cameraFullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  camTopBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  camTopBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  camTitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
  },
  camTitleText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Viewfinder
  viewfinderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#fff',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.amberAccent,
    opacity: 0.75,
    shadowColor: colors.amberAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  viewfinderHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 16,
    letterSpacing: 0.3,
  },

  // Bottom Camera Controls
  cameraBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  galleryThumb: {
    width: 60,
    alignItems: 'center',
  },
  galleryThumbLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    marginTop: 4,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
});
