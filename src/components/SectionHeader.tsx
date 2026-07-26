import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { spacing, typography } from '../theme';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  const { colors } = useSettings();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} hitSlop={8}>
          <Text style={[typography.caption, { color: colors.blue, fontWeight: '600' }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
