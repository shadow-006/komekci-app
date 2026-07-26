import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { Alarm } from '../types';
import { spacing, typography } from '../theme';
import { formatTime } from '../utils/date';

type Props = {
  alarm: Alarm;
  onToggle: (alarm: Alarm) => void;
  onRemove: (id: string) => void;
};

export function AlarmItem({ alarm, onToggle, onRemove }: Props) {
  const { colors, t } = useSettings();
  const dimColor = colors.textMuted;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[typography.h1, { color: alarm.enabled ? colors.textPrimary : dimColor }]}>
          {formatTime(alarm.hour, alarm.minute)}
        </Text>
        <Text style={[typography.caption, { color: alarm.enabled ? colors.textSecondary : dimColor, marginTop: 2 }]}>
          {alarm.label || t.ring.defaultLabel} · {alarm.repeatDaily ? t.alarms.everyDay : t.alarms.once}
        </Text>
      </View>
      <Switch
        value={alarm.enabled}
        onValueChange={() => onToggle(alarm)}
        trackColor={{ false: colors.border, true: colors.blue }}
        thumbColor={colors.white}
      />
      <TouchableOpacity onPress={() => onRemove(alarm.id)} hitSlop={8} style={{ marginLeft: spacing.md }}>
        <Text style={[typography.tiny, { color: colors.critical }]}>{t.alarms.remove}</Text>
      </TouchableOpacity>
    </View>
  );
}
