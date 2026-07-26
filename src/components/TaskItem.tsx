import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { Task } from '../types';
import { radius, spacing, typography } from '../theme';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function TaskItem({ task, onToggle, onRemove }: Props) {
  const { colors, t } = useSettings();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
      <TouchableOpacity
        style={{
          width: 24,
          height: 24,
          borderRadius: radius.sm,
          borderWidth: 2,
          borderColor: colors.blue,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
          backgroundColor: task.done ? colors.blue : 'transparent',
        }}
        onPress={() => onToggle(task.id)}
        hitSlop={8}
      >
        {task.done ? <Text style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>✓</Text> : null}
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            typography.body,
            { color: task.done ? colors.textMuted : colors.textPrimary },
            task.done && { textDecorationLine: 'line-through' },
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.time ? <Text style={[typography.tiny, { color: colors.textMuted, marginTop: 2 }]}>{task.time}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => onRemove(task.id)} hitSlop={8}>
        <Text style={[typography.tiny, { color: colors.critical, marginLeft: spacing.md }]}>{t.alarms.remove}</Text>
      </TouchableOpacity>
    </View>
  );
}
