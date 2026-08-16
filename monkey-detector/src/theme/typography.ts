import { StyleSheet, Platform } from 'react-native';
import { colors } from './colors';

export const fontSF = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = StyleSheet.create({
  heroHeading: {
    fontFamily: fontSF,
    fontSize: 30,
    fontWeight: '700',
    color: colors.deepGreen,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  sectionHeading: {
    fontFamily: fontSF,
    fontSize: 20,
    fontWeight: '700',
    color: colors.deepGreen,
    letterSpacing: -0.3,
  },
  cardTitle: {
    fontFamily: fontSF,
    fontSize: 17,
    fontWeight: '600',
    color: colors.deepGreen,
  },
  subtitleItalic: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.olive,
  },
  bodyText: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    color: colors.deepGreen,
    lineHeight: 21,
  },
  captionText: {
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.olive,
  },
  buttonText: {
    fontFamily: fontSF,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
