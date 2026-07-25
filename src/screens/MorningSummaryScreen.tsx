import React, { useMemo } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TaskItem } from '../components/TaskItem';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing, typography } from '../theme';
import { formatFullDateAz, todayKey } from '../utils/date';
import { greetingForHour } from '../utils/greeting';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function MorningSummaryScreen({ visible, onClose }: Props) {
  const { tasks, toggleTask, removeTask } = useApp();

  const todayTasks = useMemo(() => {
    const today = todayKey();
    return tasks.filter((t) => t.date === today).sort((a, b) => a.createdAt - b.createdAt);
  }, [tasks]);

  const remaining = todayTasks.filter((t) => !t.done).length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>{greetingForHour(new Date().getHours())} 👋</Text>
        <Text style={styles.date}>{formatFullDateAz()}</Text>

        <Text style={styles.heading}>
          {todayTasks.length === 0
            ? 'Bu gün üçün planlaşdırılmış işiniz yoxdur.'
            : `Bu gün etməli olduğunuz ${remaining} iş var:`}
        </Text>

        {todayTasks.length === 0 ? (
          <Text style={styles.empty}>Planlama bölməsindən yeni tapşırıq əlavə edə bilərsiniz.</Text>
        ) : (
          <View style={styles.list}>
            {todayTasks.map((t) => (
              <TaskItem key={t.id} task={t} onToggle={toggleTask} onRemove={removeTask} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Başlayaq</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
