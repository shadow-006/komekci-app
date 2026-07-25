import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';
import { TaskItem } from '../components/TaskItem';
import { WeatherCard } from '../components/WeatherCard';
import { useApp } from '../context/AppContext';
import { useWeather } from '../hooks/useWeather';
import { colors, radius, spacing, typography } from '../theme';
import { formatFullDateAz, todayKey } from '../utils/date';
import { greetingForHour } from '../utils/greeting';

export function HomeScreen() {
  const { tasks, addTask, toggleTask, removeTask, todayLog, goals } = useApp();
  const weather = useWeather();
  const [draft, setDraft] = useState('');

  const today = todayKey();
  const todayTasks = useMemo(
    () => tasks.filter((t) => t.date === today).sort((a, b) => a.createdAt - b.createdAt),
    [tasks, today]
  );
  const remaining = todayTasks.filter((t) => !t.done).length;

  const waterPct = todayLog.waterMl / goals.waterGoalMl;
  const caloriePct = todayLog.calories / goals.calorieGoalKcal;

  const submit = async () => {
    const title = draft.trim();
    if (!title) return;
    await addTask(title, today);
    setDraft('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{greetingForHour(new Date().getHours())} 👋</Text>
      <Text style={styles.date}>{formatFullDateAz()}</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <WeatherCard {...weather} onRetry={weather.reload} />
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>💧 Su</Text>
          <Text style={styles.statValue}>{(todayLog.waterMl / 1000).toFixed(1)} L</Text>
          <ProgressBar value={waterPct} complete={waterPct >= 1} />
          <Text style={styles.statGoal}>Hədəf: {(goals.waterGoalMl / 1000).toFixed(1)} L</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>🔥 Kalori</Text>
          <Text style={styles.statValue}>{todayLog.calories} kcal</Text>
          <ProgressBar value={caloriePct} complete={caloriePct >= 1} />
          <Text style={styles.statGoal}>Hədəf: {goals.calorieGoalKcal} kcal</Text>
        </Card>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title={`Bugünkü tapşırıqlar (${remaining} qalıb)`} />

        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="Yeni tapşırıq əlavə et…"
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submit}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={submit}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {todayTasks.length === 0 ? (
          <Text style={styles.empty}>Bu gün üçün tapşırıq yoxdur. Yuxarıdan əlavə et.</Text>
        ) : (
          todayTasks.map((t) => <TaskItem key={t.id} task={t} onToggle={toggleTask} onRemove={removeTask} />)
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  statGoal: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.page,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
});
