import React from 'react';
import { StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function PageWrapper({ children }) {
  const { dark, colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        animated
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {children}
    </View>
  );
}
