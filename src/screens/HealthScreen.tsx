import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing, typography } from '../theme';

const WATER_QUICK = [100, 250, 500];
const CALORIE_QUICK = [100, 250, 500];

export function HealthScreen() {
  const { todayLog, goals, addWater, addCalories, resetToday, updateGoals } = useApp();
  const [waterGoalDraft, setWaterGoalDraft] = useState(String(goals.waterGoalMl));
  const [calorieGoalDraft, setCalorieGoalDraft] = useState(String(goals.calorieGoalKcal));

  const waterPct = todayLog.waterMl / goals.waterGoalMl;
  const caloriePct = todayLog.calories / goals.calorieGoalKcal;

  const saveGoals = async () => {
    const waterGoalMl = Math.max(200, parseInt(waterGoalDraft, 10) || goals.waterGoalMl);
    const calorieGoalKcal = Math.max(200, parseInt(calorieGoalDraft, 10) || goals.calorieGoalKcal);
    await updateGoals({ waterGoalMl, calorieGoalKcal });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sağlamlıq</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title="💧 Su" />
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
        <SectionHeader title="🔥 Kalori" />
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
        <SectionHeader title="Gündəlik hədəflər" />
        <View style={styles.goalRow}>
          <Text style={styles.goalLabel}>Su hədəfi (ml)</Text>
          <TextInput
            style={styles.goalInput}
            keyboardType="numeric"
            value={waterGoalDraft}
            onChangeText={setWaterGoalDraft}
            onEndEditing={saveGoals}
          />
        </View>
        <View style={styles.goalRow}>
          <Text style={styles.goalLabel}>Kalori hədəfi (kcal)</Text>
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
        <Text style={styles.resetBtnText}>Bugünkü hesabı sıfırla</Text>
      </TouchableOpacity>
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
});
