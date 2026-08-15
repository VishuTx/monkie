import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetectionEvent } from '../types/DetectionEvent';

const STORAGE_KEY = '@monkey_detector_ledger_v1';

export const getHistory = async (): Promise<DetectionEvent[]> => {
  try {
    const jsonStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonStr) return [];
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to load detection ledger history from AsyncStorage:', error);
    return [];
  }
};

export const saveDetectionEvent = async (event: DetectionEvent): Promise<void> => {
  try {
    const current = await getHistory();
    const updated = [event, ...current.filter((item) => item.id !== event.id)];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save detection event to AsyncStorage:', error);
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear AsyncStorage history:', error);
  }
};

export const deleteDetectionEvent = async (id: string): Promise<void> => {
  try {
    const current = await getHistory();
    const updated = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete detection event from AsyncStorage:', error);
  }
};
