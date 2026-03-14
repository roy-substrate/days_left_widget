import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  largeTitle: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8 },
  title1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  title2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  headline: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 17, fontWeight: '400', lineHeight: 24 },
  callout: { fontSize: 16, fontWeight: '400' },
  subhead: { fontSize: 15, fontWeight: '400' },
  footnote: { fontSize: 13, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
  overline: { fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
};
