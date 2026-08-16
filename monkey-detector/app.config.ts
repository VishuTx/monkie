import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Primate Deterrence System',
  slug: 'primate-deterrence-system',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  plugins: ['expo-font'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: 'Primate Deterrence System requires camera access to capture and scan photos.',
      NSPhotoLibraryUsageDescription: 'Primate Deterrence System requires gallery access to select images for analysis.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundColor: '#0a0a0f',
    },
    permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.31.72:5000',
  },
});
