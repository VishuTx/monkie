import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';

import { LandingScreen } from './src/screens/LandingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetectScreen } from './src/screens/DetectScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { DetectionEvent } from './src/types/DetectionEvent';
import { colors } from './src/theme/colors';

type ScreenType = 'LANDING' | 'HOME' | 'DETECT' | 'RESULT' | 'HISTORY';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LANDING');
  const [detectInitialMode, setDetectInitialMode] = useState<'gallery' | 'camera'>('gallery');
  const [currentResultEvent, setCurrentResultEvent] = useState<DetectionEvent | null>(null);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amberAccent} />
        <Text style={styles.loadingLabel}>Primate Deterrence System</Text>
      </View>
    );
  }

  const handleOpenGalleryScan = () => {
    setDetectInitialMode('gallery');
    setCurrentScreen('DETECT');
  };

  const handleOpenLiveCamera = () => {
    setDetectInitialMode('camera');
    setCurrentScreen('DETECT');
  };

  const handleAnalysisComplete = (event: DetectionEvent) => {
    setCurrentResultEvent(event);
    setCurrentScreen('RESULT');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" />

      {currentScreen === 'LANDING' && (
        <LandingScreen onEnter={() => setCurrentScreen('HOME')} />
      )}

      {currentScreen === 'HOME' && (
        <HomeScreen
          onSelectPickGallery={handleOpenGalleryScan}
          onSelectCamera={handleOpenLiveCamera}
          onOpenHistory={() => setCurrentScreen('HISTORY')}
        />
      )}

      {currentScreen === 'DETECT' && (
        <DetectScreen
          initialMode={detectInitialMode}
          onAnalysisComplete={handleAnalysisComplete}
          onBack={() => setCurrentScreen('HOME')}
        />
      )}

      {currentScreen === 'RESULT' && currentResultEvent && (
        <ResultScreen
          event={currentResultEvent}
          onSaveAndClose={() => setCurrentScreen('HOME')}
          onDiscard={() => setCurrentScreen('DETECT')}
        />
      )}

      {currentScreen === 'HISTORY' && (
        <HistoryScreen onBack={() => setCurrentScreen('HOME')} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLabel: {
    color: colors.textMuted,
    marginTop: 16,
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
