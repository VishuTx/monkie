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
import { BackButton } from '../components/BackButton';
import { getHistory, clearHistory, deleteDetectionEvent } from '../utils/storage';
import { fontSF } from '../theme/typography';
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
        <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[styles.accentBar, { backgroundColor: isMonkey ? colors.midGreen : colors.mint }]} />
        <View style={styles.itemRow}>
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          <View style={styles.itemDetails}>
            <Text style={[styles.verdictText, { color: colors.deepGreen }]}>
              {isMonkey ? 'Intrusion by Primate Detected' : 'Safe'}
            </Text>
            <Text style={styles.confidenceText}>
              {item.confidence}% confidence score
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
      {/* Header with Global BackButton */}
      <View style={styles.header}>
        <BackButton onPress={onBack} title="Back" />
        <Text style={styles.headerTitle}>Detection History</Text>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Record Count */}
      <Text style={styles.countText}>
        {history.length} {history.length === 1 ? 'incident log' : 'incident logs'} recorded on device
      </Text>

      {/* Empty State */}
      {history.length === 0 && !loading ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No Logged Incidents</Text>
          <Text style={styles.emptySub}>Run a detection scan and save results to build your incident history.</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 112, 92, 0.15)',
  },
  headerTitle: { fontFamily: fontSF, fontSize: 18, fontWeight: '700', color: colors.deepGreen },
  clearText: { fontFamily: fontSF, fontSize: 13, fontWeight: '600', color: '#c0392b', padding: 4 },

  countText: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '400',
    color: colors.olive,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },

  listContent: { padding: 16, paddingBottom: 50 },

  itemCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.22)',
    backgroundColor: 'rgba(216, 243, 220, 0.65)',
    marginBottom: 12,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
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
    backgroundColor: colors.paleMint,
  },
  itemDetails: { flex: 1 },
  verdictText: { fontFamily: fontSF, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  confidenceText: { fontFamily: fontSF, fontSize: 13, fontWeight: '400', color: colors.deepGreen, marginBottom: 2 },
  timeText: { fontFamily: fontSF, fontSize: 12, fontWeight: '400', color: colors.olive },

  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(107, 112, 92, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: colors.olive, fontSize: 12, fontWeight: '700' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: fontSF, fontSize: 20, fontWeight: '700', color: colors.deepGreen, marginBottom: 8 },
  emptySub: { fontFamily: fontSF, fontSize: 14, fontWeight: '400', color: colors.olive, textAlign: 'center', lineHeight: 20 },
});
