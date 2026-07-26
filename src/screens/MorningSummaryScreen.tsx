import React, { useMemo } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TaskItem } from '../components/TaskItem';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { ThemeColors, radius, spacing, typography } from '../theme';
import { formatFullDate, todayKey } from '../utils/date';
import { greetingForHour } from '../utils/greeting';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function MorningSummaryScreen({ visible, onClose }: Props) {
  const { tasks, toggleTask, removeTask } = useApp();
  const { colors, t, language } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const todayTasks = useMemo(() => {
    const today = todayKey();
    return tasks.filter((task) => task.date === today).sort((a, b) => a.createdAt - b.createdAt);
  }, [tasks]);

  const remaining = todayTasks.filter((task) => !task.done).length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>{greetingForHour(new Date().getHours(), t)} 👋</Text>
        <Text style={styles.date}>{formatFullDate(language)}</Text>

        <Text style={styles.heading}>{todayTasks.length === 0 ? t.summary.noTasks : t.summary.tasksLeft(remaining)}</Text>

        {todayTasks.length === 0 ? (
          <Text style={styles.empty}>{t.summary.addHint}</Text>
        ) : (
          <View style={styles.list}>
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onRemove={removeTask} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>{t.summary.start}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.page,
    },
    content: {
      padding: spacing.xl,
      paddingTop: spacing.xxl * 1.5,
      paddingBottom: spacing.xxl,
      flexGrow: 1,
    },
    greeting: {
      ...typography.hero,
      color: colors.textPrimary,
    },
    date: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: 2,
    },
    heading: {
      ...typography.h1,
      color: colors.textPrimary,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    empty: {
      ...typography.body,
      color: colors.textMuted,
    },
    list: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    closeBtn: {
      marginTop: spacing.xxl,
      backgroundColor: colors.blue,
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    closeBtnText: {
      color: colors.white,
      ...typography.h2,
      fontWeight: '700',
    },
  });
}
