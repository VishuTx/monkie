import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  heroHeading: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#f0f0f5',
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  sectionHeading: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#f0f0f5',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#f0f0f5',
    letterSpacing: 1,
  },
  latinMicrocopy: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 14,
    color: '#c9861a',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  englishSubtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#a0a0b0',
    marginTop: 2,
  },
  bodyText: {
    fontSize: 14,
    color: '#f0f0f5',
    lineHeight: 20,
  },
  captionText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6e6e80',
  },
  buttonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
