import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  value: number; // 0..1
  complete?: boolean;
  height?: number;
};

export function ProgressBar({ value, complete, height = 10 }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${pct * 100}%`,
            backgroundColor: complete ? colors.good : colors.blue,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.blue100,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radius.pill,
  },
});
