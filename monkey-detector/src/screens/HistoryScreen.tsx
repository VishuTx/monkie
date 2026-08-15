import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { DetectionEvent } from '../types/DetectionEvent';
import { getHistory, clearHistory, deleteDetectionEvent } from '../utils/storage';
import { colors } from '../theme/colors';

interface HistoryScreenProps {
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const [history, setHistory] = useState<DetectionEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    setLoading(true);
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Records',
      'Permanently delete all detection records from local storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => { await clearHistory(); setHistory([]); },
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Remove this entry from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => { await deleteDetectionEvent(id); fetchHistory(); },
      },
    ]);
  };

  const renderItem = ({ item }: { item: DetectionEvent }) => {
    const isMonkey = item.verdict === 'MONKEY_DETECTED';
    const dateStr = new Date(item.timestamp).toLocaleString();

    return (
      <View style={styles.itemCard}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[styles.accentBar, { backgroundColor: isMonkey ? colors.amberAccent : colors.coldBlue }]} />
        <View style={styles.itemRow}>
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          <View style={styles.itemDetails}>
            <Text style={[styles.verdictText, { color: isMonkey ? colors.amberLight : colors.coldBlueLight }]}>
              {isMonkey ? 'Primate Detected' : 'Area Clear'}
            </Text>
            <Text style={styles.confidenceText}>
              {item.confidence}% confidence
            </Text>
            <Text style={styles.timeText}>{dateStr}</Text>
          </View>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        {history.length > 0
          ? <TouchableOpacity onPress={handleClearAll}><Text style={styles.clearText}>Clear All</Text></TouchableOpacity>
          : <View style={{ width: 60 }} />
        }
      </View>

      {/* Count */}
      <Text style={styles.countText}>
        {history.length} {history.length === 1 ? 'record' : 'records'} on device
      </Text>

      {/* Empty State */}
      {history.length === 0 && !loading ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No Records Yet</Text>
          <Text style={styles.emptySub}>Run a scan and save results to build your history.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: colors.amberAccent },
  headerTitle: { fontSize: 17, fontFamily: 'Outfit_700Bold', color: colors.textPrimary },
  clearText: { fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#e74c3c', padding: 4 },

  countText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: colors.textMuted,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },

  listContent: { padding: 16, paddingBottom: 50 },

  itemCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(18,18,28,0.55)',
    marginBottom: 12,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    zIndex: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 18,
    zIndex: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: colors.surface,
  },
  itemDetails: { flex: 1 },
  verdictText: { fontSize: 14, fontFamily: 'Outfit_700Bold', marginBottom: 3 },
  confidenceText: { fontSize: 12, fontFamily: 'Outfit_400Regular', color: colors.textSecondary, marginBottom: 2 },
  timeText: { fontSize: 11, fontFamily: 'Outfit_400Regular', color: colors.textMuted },

  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: colors.textMuted, fontSize: 11, fontFamily: 'Outfit_600SemiBold' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: colors.textPrimary, marginBottom: 8 },
  emptySub: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
});
