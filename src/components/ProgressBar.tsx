import React from 'react';
import { View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { radius } from '../theme';

type Props = {
  value: number; // 0..1
  complete?: boolean;
  height?: number;
};

export function ProgressBar({ value, complete, height = 10 }: Props) {
  const { colors } = useSettings();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ width: '100%', backgroundColor: colors.blue100, borderRadius: radius.pill, overflow: 'hidden', height }}>
      <View
        style={{
          width: `${pct * 100}%`,
          backgroundColor: complete ? colors.good : colors.blue,
          height,
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}
