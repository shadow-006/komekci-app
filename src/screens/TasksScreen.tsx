import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { TaskItem } from '../components/TaskItem';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing, typography } from '../theme';
import { todayKey } from '../utils/date';
import { Task } from '../types';

export function TasksScreen() {
  const { tasks, addTask, toggleTask, removeTask } = useApp();
  const [draft, setDraft] = useState('');
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    }
    return map;
  }, [tasks]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    for (const date of Object.keys(tasksByDate)) {
      if (tasksByDate[date].length === 0) continue;
      const allDone = tasksByDate[date].every((t) => t.done);
      marks[date] = {
        marked: true,
        dotColor: allDone ? colors.good : colors.blue,
      };
    }
    marks[selectedDate] = {
      ...(marks[selectedDate] ?? {}),
      selected: true,
      selectedColor: colors.blue,
    };
    return marks;
  }, [tasksByDate, selectedDate]);

  const dayTasks = useMemo(
    () => (tasksByDate[selectedDate] ?? []).slice().sort((a, b) => a.createdAt - b.createdAt),
    [tasksByDate, selectedDate]
  );

  const submit = async () => {
    const title = draft.trim();
    if (!title) return;
    await addTask(title, selectedDate);
    setDraft('');
  };

  const isToday = selectedDate === today;
  const selectedLabel = useMemo(() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [selectedDate]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem task={item} onToggle={toggleTask} onRemove={removeTask} />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Planlama</Text>
      </View>

      <Calendar
        current={today}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        firstDay={1}
        style={styles.calendar}
        theme={{
          backgroundColor: colors.card,
          calendarBackground: colors.card,
          textSectionTitleColor: colors.textMuted,
          selectedDayBackgroundColor: colors.blue,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.blue,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textMuted,
          dotColor: colors.blue,
          arrowColor: colors.blue,
          monthTextColor: colors.textPrimary,
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '600',
        }}
      />

      <View style={styles.selectedRow}>
        <Text style={styles.selectedLabel}>{isToday ? 'Bu gün' : selectedLabel}</Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Bu tarix üçün plan yaz…"
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

      <FlatList
        data={dayTasks}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Bu tarix üçün plan yoxdur.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
    paddingTop: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  calendar: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  selectedRow: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  selectedLabel: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
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
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
