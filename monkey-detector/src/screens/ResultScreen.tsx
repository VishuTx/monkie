import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { DetectionEvent } from '../types/DetectionEvent';
import { VerdictBadge } from '../components/VerdictBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { BackButton } from '../components/BackButton';
import { saveDetectionEvent } from '../utils/storage';
import { fontSF } from '../theme/typography';
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

        {/* Top Bar with Global BackButton */}
        <View style={styles.topBar}>
          <BackButton onPress={onSaveAndClose} title="Back" />
          <Text style={styles.headerLabel}>DETECTION COMPLETE</Text>
        </View>

        {/* Title */}
        <Text style={styles.headerTitle}>Scan Analysis Result</Text>

        {/* Verdict Badge */}
        <VerdictBadge verdict={event.verdict} size="large" />

        {/* Confidence Meter */}
        <View style={styles.meterPanel}>
          <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.meterContent}>
            <Text style={styles.meterLabel}>Confidence Score</Text>
            <ConfidenceMeter confidence={event.confidence} isMonkey={isMonkey} size={175} />
          </View>
        </View>

        {/* Image Preview & Metrics */}
        <View style={styles.imagePanel}>
          <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
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
    borderBottomColor: 'rgba(107, 112, 92, 0.15)',
  },
  label: { fontFamily: fontSF, fontSize: 13, fontWeight: '400', color: colors.olive },
  value: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
    maxWidth: '60%',
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLabel: {
    fontFamily: fontSF,
    fontSize: 11,
    fontWeight: '600',
    color: colors.olive,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: fontSF,
    fontSize: 26,
    fontWeight: '700',
    color: colors.deepGreen,
    letterSpacing: -0.4,
    marginBottom: 16,
  },

  // Meter panel
  meterPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.25)',
    backgroundColor: 'rgba(216, 243, 220, 0.65)',
    marginBottom: 16,
  },
  meterContent: {
    alignItems: 'center',
    padding: 18,
  },
  meterLabel: {
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '600',
    color: colors.olive,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  // Image panel
  imagePanel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.25)',
    backgroundColor: 'rgba(216, 243, 220, 0.65)',
    marginBottom: 22,
  },
  imageContainer: { width: '100%', height: 210 },
  imagePreview: { width: '100%', height: '100%' },
  metricsBlock: { padding: 16 },

  // Buttons
  saveBtn: {
    backgroundColor: colors.midGreen,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  savedBtn: { backgroundColor: colors.olive, opacity: 0.8 },
  saveBtnText: { fontFamily: fontSF, fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },

  discardBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.25)',
    backgroundColor: 'rgba(216, 243, 220, 0.50)',
  },
  discardBtnText: { fontFamily: fontSF, fontSize: 15, fontWeight: '600', color: colors.deepGreen },
});
