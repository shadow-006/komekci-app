import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskItem } from '../components/TaskItem';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { ThemeColors, radius, spacing, typography } from '../theme';
import { todayKey } from '../utils/date';
import { Task } from '../types';

LocaleConfig.locales.az = {
  monthNames: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
  monthNamesShort: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'],
  dayNames: ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'],
  dayNamesShort: ['B.', 'B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş'],
  today: 'Bu gün',
};

export function TasksScreen() {
  const { tasks, addTask, toggleTask, removeTask } = useApp();
  const { colors, t, language } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    LocaleConfig.defaultLocale = language === 'az' ? 'az' : '';
  }, [language]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }, [tasks]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    for (const date of Object.keys(tasksByDate)) {
      if (tasksByDate[date].length === 0) continue;
      const allDone = tasksByDate[date].every((task) => task.done);
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
  }, [tasksByDate, selectedDate, colors]);

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
    return d.toLocaleDateString(language === 'az' ? 'az-AZ' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [selectedDate, language]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem task={item} onToggle={toggleTask} onRemove={removeTask} />
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.planning.title}</Text>
      </View>

      <Calendar
        key={language}
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
        <Text style={styles.selectedLabel}>{isToday ? t.planning.today : selectedLabel}</Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder={t.planning.addPlaceholder}
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
        keyExtractor={(task) => task.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{t.planning.noTasks}</Text>}
      />
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
