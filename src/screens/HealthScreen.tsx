import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { ThemeColors, radius, spacing, typography } from '../theme';
import { todayKey } from '../utils/date';

const WATER_QUICK = [100, 250, 500];
const CALORIE_QUICK = [100, 250, 500];

export function HealthScreen() {
  const { todayLog, dayLogs, goals, addWater, addCalories, resetToday, updateGoals } = useApp();
  const { colors, t } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [waterGoalDraft, setWaterGoalDraft] = useState(String(goals.waterGoalMl));
  const [calorieGoalDraft, setCalorieGoalDraft] = useState(String(goals.calorieGoalKcal));

  const waterPct = todayLog.waterMl / goals.waterGoalMl;
  const caloriePct = todayLog.calories / goals.calorieGoalKcal;

  const history = useMemo(() => {
    const today = todayKey();
    return dayLogs
      .filter((log) => log.date !== today && (log.waterMl > 0 || log.calories > 0))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 14);
  }, [dayLogs]);

  const saveGoals = async () => {
    const waterGoalMl = Math.max(200, parseInt(waterGoalDraft, 10) || goals.waterGoalMl);
    const calorieGoalKcal = Math.max(200, parseInt(calorieGoalDraft, 10) || goals.calorieGoalKcal);
    await updateGoals({ waterGoalMl, calorieGoalKcal });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>{t.health.title}</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title={`💧 ${t.health.water}`} />
        <Text style={styles.value}>
          {(todayLog.waterMl / 1000).toFixed(2)} L{' '}
          <Text style={styles.goalInline}>/ {(goals.waterGoalMl / 1000).toFixed(1)} L</Text>
        </Text>
        <ProgressBar value={waterPct} complete={waterPct >= 1} height={12} />
        <View style={styles.quickRow}>
          {WATER_QUICK.map((ml) => (
            <TouchableOpacity key={ml} style={styles.quickBtn} onPress={() => addWater(ml)}>
              <Text style={styles.quickBtnText}>+{ml} ml</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.quickBtn, styles.quickBtnGhost]} onPress={() => addWater(-100)}>
            <Text style={styles.quickBtnGhostText}>-100 ml</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title={`🔥 ${t.health.calorie}`} />
        <Text style={styles.value}>
          {todayLog.calories} kcal <Text style={styles.goalInline}>/ {goals.calorieGoalKcal} kcal</Text>
        </Text>
        <ProgressBar value={caloriePct} complete={caloriePct >= 1} height={12} />
        <View style={styles.quickRow}>
          {CALORIE_QUICK.map((kcal) => (
            <TouchableOpacity key={kcal} style={styles.quickBtn} onPress={() => addCalories(kcal)}>
              <Text style={styles.quickBtnText}>+{kcal} kcal</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.quickBtn, styles.quickBtnGhost]} onPress={() => addCalories(-100)}>
            <Text style={styles.quickBtnGhostText}>-100</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title={t.health.dailyGoals} />
        <View style={styles.goalRow}>
          <Text style={styles.goalLabel}>{t.health.waterGoal}</Text>
          <TextInput
            style={styles.goalInput}
            keyboardType="numeric"
            value={waterGoalDraft}
            onChangeText={setWaterGoalDraft}
            onEndEditing={saveGoals}
          />
        </View>
        <View style={styles.goalRow}>
          <Text style={styles.goalLabel}>{t.health.calorieGoal}</Text>
          <TextInput
            style={styles.goalInput}
            keyboardType="numeric"
            value={calorieGoalDraft}
            onChangeText={setCalorieGoalDraft}
            onEndEditing={saveGoals}
          />
        </View>
      </Card>

      <TouchableOpacity style={styles.resetBtn} onPress={resetToday}>
        <Text style={styles.resetBtnText}>{t.health.resetToday}</Text>
      </TouchableOpacity>

      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title={t.health.history} />
        {history.length === 0 ? (
          <Text style={styles.empty}>{t.health.noHistory}</Text>
        ) : (
          <Card>
            {history.map((log, index) => (
              <View key={log.date} style={[styles.historyRow, index === 0 && { borderTopWidth: 0 }]}>
                <Text style={styles.historyDate}>{log.date}</Text>
                <View style={styles.historyValues}>
                  <Text style={styles.historyValue}>💧 {(log.waterMl / 1000).toFixed(1)} L</Text>
                  <Text style={styles.historyValue}>🔥 {log.calories} kcal</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.page,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    title: {
      ...typography.hero,
      color: colors.textPrimary,
    },
    value: {
      ...typography.h1,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    goalInline: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '400',
    },
    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    quickBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: colors.blue,
    },
    quickBtnText: {
      color: colors.white,
      ...typography.caption,
      fontWeight: '700',
    },
    quickBtnGhost: {
      backgroundColor: colors.page,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    quickBtnGhostText: {
      color: colors.textSecondary,
      ...typography.caption,
      fontWeight: '700',
    },
    goalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
    },
    goalLabel: {
      ...typography.body,
      color: colors.textSecondary,
    },
    goalInput: {
      width: 90,
      textAlign: 'right',
      ...typography.body,
      color: colors.textPrimary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
    },
    resetBtn: {
      marginTop: spacing.lg,
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    resetBtnText: {
      ...typography.caption,
      color: colors.critical,
      fontWeight: '600',
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    historyDate: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    historyValues: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    historyValue: {
      ...typography.caption,
      color: colors.textPrimary,
    },
    empty: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}
