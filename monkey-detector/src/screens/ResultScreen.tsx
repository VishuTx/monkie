import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { DetectionEvent } from '../types/DetectionEvent';
import { VerdictBadge } from '../components/VerdictBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { saveDetectionEvent } from '../utils/storage';
import { colors } from '../theme/colors';

interface ResultScreenProps {
  event: DetectionEvent;
  onSaveAndClose: () => void;
  onDiscard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  event,
  onSaveAndClose,
  onDiscard,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const isMonkey = event.verdict === 'MONKEY_DETECTED';

  const handleSave = async () => {
    await saveDetectionEvent(event);
    setIsSaved(true);
    Alert.alert('Saved', 'Detection result saved to local history.');
    onSaveAndClose();
  };

  const formattedDate = new Date(event.timestamp).toLocaleString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>DETECTION COMPLETE</Text>
          <Text style={styles.headerTitle}>Scan Result</Text>
        </View>

        {/* Verdict */}
        <VerdictBadge verdict={event.verdict} size="large" />

        {/* Confidence Meter */}
        <View style={styles.meterPanel}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.panelHighlight} />
          <View style={styles.meterContent}>
            <Text style={styles.meterLabel}>Confidence Score</Text>
            <ConfidenceMeter confidence={event.confidence} isMonkey={isMonkey} size={175} />
          </View>
        </View>

        {/* Image Preview */}
        <View style={styles.imagePanel}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.imageUri }} style={styles.imagePreview} resizeMode="cover" />
          </View>
          <View style={styles.metricsBlock}>
            <MetricRow label="Processing Time" value={`${event.processingTimeMs} ms`} />
            <MetricRow label="Detected At" value={formattedDate} />
            <MetricRow label="Source" value={event.sourceType.replace(/_/g, ' ')} last />
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaved && styles.savedBtn]}
          activeOpacity={0.82}
          onPress={handleSave}
          disabled={isSaved}
        >
          <Text style={styles.saveBtnText}>{isSaved ? 'Saved to History' : 'Save to History'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.discardBtn} activeOpacity={0.78} onPress={onDiscard}>
          <Text style={styles.discardBtnText}>Scan Another Image</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const MetricRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <View style={[metricStyles.row, last && { borderBottomWidth: 0 }]}>
    <Text style={metricStyles.label}>{label}</Text>
    <Text style={metricStyles.value}>{value}</Text>
  </View>
);

const metricStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  label: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: colors.textSecondary },
  value: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.textPrimary,
    maxWidth: '55%',
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 50 },

  header: { marginBottom: 20 },
  headerLabel: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    color: colors.amberAccent,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: colors.textPrimary,
  },

  // Meter panel
  meterPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(18,18,28,0.55)',
    marginBottom: 14,
  },
  panelHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    zIndex: 2,
  },
  meterContent: {
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  meterLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  // Image panel
  imagePanel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(18,18,28,0.55)',
    marginBottom: 22,
  },
  imageContainer: { width: '100%', height: 200 },
  imagePreview: { width: '100%', height: '100%' },
  metricsBlock: { padding: 16 },

  // Buttons
  saveBtn: {
    backgroundColor: colors.amberAccent,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.amberAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
  },
  savedBtn: { backgroundColor: colors.coldBlueDark },
  saveBtnText: { fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#fff', letterSpacing: 0.3 },

  discardBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  discardBtnText: { fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: colors.textSecondary },
});
