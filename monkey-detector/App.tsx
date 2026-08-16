import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LandingScreen } from './src/screens/LandingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetectScreen } from './src/screens/DetectScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { DetectionEvent } from './src/types/DetectionEvent';
import { colors } from './src/theme/colors';

type ScreenType = 'LANDING' | 'HOME' | 'DETECT' | 'RESULT' | 'HISTORY' | 'ABOUT';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LANDING');
  const [detectInitialMode, setDetectInitialMode] = useState<'gallery' | 'camera'>('gallery');
  const [currentResultEvent, setCurrentResultEvent] = useState<DetectionEvent | null>(null);

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
      <StatusBar style="dark" />

      {currentScreen === 'LANDING' && (
        <LandingScreen onEnter={() => setCurrentScreen('HOME')} />
      )}

      {currentScreen === 'HOME' && (
        <HomeScreen
          onSelectPickGallery={handleOpenGalleryScan}
          onSelectCamera={handleOpenLiveCamera}
          onOpenHistory={() => setCurrentScreen('HISTORY')}
          onOpenAbout={() => setCurrentScreen('ABOUT')}
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

      {currentScreen === 'ABOUT' && (
        <AboutScreen onBack={() => setCurrentScreen('HOME')} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
