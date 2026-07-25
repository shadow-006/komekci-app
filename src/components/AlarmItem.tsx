import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Alarm } from '../types';
import { colors, spacing, typography } from '../theme';
import { formatTime } from '../utils/date';

type Props = {
  alarm: Alarm;
  onToggle: (alarm: Alarm) => void;
  onRemove: (id: string) => void;
};

export function AlarmItem({ alarm, onToggle, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.time, !alarm.enabled && styles.dim]}>{formatTime(alarm.hour, alarm.minute)}</Text>
        <Text style={[styles.label, !alarm.enabled && styles.dim]}>
          {alarm.label || 'Alarm'} · {alarm.repeatDaily ? 'Hər gün' : 'Bir dəfə'}
        </Text>
      </View>
      <Switch
        value={alarm.enabled}
        onValueChange={() => onToggle(alarm)}
        trackColor={{ false: colors.border, true: colors.blue }}
        thumbColor={colors.white}
      />
      <TouchableOpacity onPress={() => onRemove(alarm.id)} hitSlop={8} style={{ marginLeft: spacing.md }}>
        <Text style={styles.remove}>Sil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  time: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dim: {
    color: colors.textMuted,
  },
  remove: {
    ...typography.tiny,
    color: colors.critical,
  },
});
