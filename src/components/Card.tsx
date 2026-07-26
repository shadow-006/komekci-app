import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { radius, shadow, spacing } from '../theme';

export function Card({ style, children, ...rest }: ViewProps) {
  const { colors } = useSettings();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          ...shadow.card,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
