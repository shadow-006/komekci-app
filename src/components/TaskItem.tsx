import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../types';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function TaskItem({ task, onToggle, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.checkbox, task.done && styles.checkboxDone]}
        onPress={() => onToggle(task.id)}
        hitSlop={8}
      >
        {task.done ? <Text style={styles.checkmark}>✓</Text> : null}
      </TouchableOpacity>

      <View style={styles.textWrap}>
        <Text style={[styles.title, task.done && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.time ? <Text style={styles.time}>{task.time}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => onRemove(task.id)} hitSlop={8}>
        <Text style={styles.remove}>Sil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxDone: {
    backgroundColor: colors.blue,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
  },
  titleDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  time: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  remove: {
    ...typography.tiny,
    color: colors.critical,
    marginLeft: spacing.md,
  },
});
