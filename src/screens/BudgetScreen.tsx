import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { ThemeColors, radius, spacing, typography } from '../theme';
import { BudgetEntry } from '../types';
import { monthKey, todayKey } from '../utils/date';

export function BudgetScreen() {
  const { budgetEntries, addBudgetEntry, removeBudgetEntry, monthlyBudgetGoal, updateMonthlyBudgetGoal } = useApp();
  const { colors, t } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [goalDraft, setGoalDraft] = useState(String(monthlyBudgetGoal));

  const currentMonth = monthKey(todayKey());

  const monthEntries = useMemo(
    () =>
      budgetEntries
        .filter((entry) => monthKey(entry.date) === currentMonth)
        .sort((a, b) => b.createdAt - a.createdAt),
    [budgetEntries, currentMonth]
  );

  const income = monthEntries.filter((entry) => entry.type === 'income').reduce((s, entry) => s + entry.amount, 0);
  const expense = monthEntries.filter((entry) => entry.type === 'expense').reduce((s, entry) => s + entry.amount, 0);
  const balance = income - expense;
  const spentPct = monthlyBudgetGoal > 0 ? expense / monthlyBudgetGoal : 0;

  const submit = async () => {
    const value = parseFloat(amount.replace(',', '.'));
    const name = title.trim();
    if (!name || !value || value <= 0) return;
    await addBudgetEntry(name, value, type, todayKey());
    setTitle('');
    setAmount('');
  };

  const saveGoal = async () => {
    const value = Math.max(0, parseFloat(goalDraft.replace(',', '.')) || monthlyBudgetGoal);
    await updateMonthlyBudgetGoal(value);
  };

  const renderItem = ({ item }: { item: BudgetEntry }) => (
    <View style={styles.entryRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <Text style={styles.entryDate}>{item.date}</Text>
      </View>
      <Text style={[styles.entryAmount, item.type === 'income' ? styles.income : styles.expense]}>
        {item.type === 'income' ? '+' : '-'}
        {item.amount.toFixed(2)} ₼
      </Text>
      <TouchableOpacity onPress={() => removeBudgetEntry(item.id)} hitSlop={8} style={{ marginLeft: spacing.md }}>
        <Text style={styles.remove}>{t.budget.remove}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
      data={monthEntries}
      keyExtractor={(entry) => entry.id}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>{t.budget.noEntries}</Text>}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>{t.budget.title}</Text>

          <Card style={{ marginTop: spacing.lg }}>
            <SectionHeader title={t.budget.thisMonth} />
            <Text style={styles.balance}>{balance.toFixed(2)} ₼</Text>
            <View style={styles.incomeExpenseRow}>
              <Text style={styles.incomeText}>
                {t.budget.income}: +{income.toFixed(2)} ₼
              </Text>
              <Text style={styles.expenseText}>
                {t.budget.expense}: -{expense.toFixed(2)} ₼
              </Text>
            </View>
            <View style={{ marginTop: spacing.md }}>
              <ProgressBar value={spentPct} complete={spentPct >= 1} height={12} />
              <Text style={styles.goalCaption}>
                {t.budget.expenseGoal}: {expense.toFixed(0)} / {monthlyBudgetGoal.toFixed(0)} ₼
              </Text>
            </View>
          </Card>

          <Card style={{ marginTop: spacing.lg }}>
            <SectionHeader title={t.budget.newEntry} />
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpenseActive]}
                onPress={() => setType('expense')}
              >
                <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>
                  {t.budget.expense}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'income' && styles.typeBtnIncomeActive]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>
                  {t.budget.income}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t.budget.namePlaceholder}
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { marginTop: spacing.sm }]}
              placeholder={t.budget.amountPlaceholder}
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              onSubmitEditing={submit}
            />
            <TouchableOpacity style={styles.addBtn} onPress={submit}>
              <Text style={styles.addBtnText}>{t.budget.add}</Text>
            </TouchableOpacity>
          </Card>

          <Card style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
            <SectionHeader title={t.budget.monthlyGoal} />
            <View style={styles.goalRow}>
              <TextInput
                style={styles.goalInput}
                keyboardType="numeric"
                value={goalDraft}
                onChangeText={setGoalDraft}
                onEndEditing={saveGoal}
              />
              <Text style={styles.goalUnit}>{t.budget.perMonth}</Text>
            </View>
          </Card>

          <SectionHeader title={t.budget.entries} />
        </>
      }
    />
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
    balance: {
      ...typography.hero,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    incomeExpenseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    incomeText: {
      ...typography.caption,
      color: colors.good,
      fontWeight: '600',
    },
    expenseText: {
      ...typography.caption,
      color: colors.critical,
      fontWeight: '600',
    },
    goalCaption: {
      ...typography.tiny,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
    typeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    typeBtn: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      alignItems: 'center',
      backgroundColor: colors.page,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    typeBtnExpenseActive: {
      backgroundColor: colors.critical,
      borderColor: colors.critical,
    },
    typeBtnIncomeActive: {
      backgroundColor: colors.good,
      borderColor: colors.good,
    },
    typeBtnText: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '700',
    },
    typeBtnTextActive: {
      color: colors.white,
    },
    input: {
      backgroundColor: colors.page,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...typography.body,
      color: colors.textPrimary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    addBtn: {
      marginTop: spacing.md,
      backgroundColor: colors.blue,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    addBtnText: {
      color: colors.white,
      ...typography.body,
      fontWeight: '700',
    },
    goalRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    goalInput: {
      width: 120,
      ...typography.body,
      color: colors.textPrimary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      marginRight: spacing.sm,
    },
    goalUnit: {
      ...typography.caption,
      color: colors.textMuted,
    },
    entryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    entryTitle: {
      ...typography.body,
      color: colors.textPrimary,
    },
    entryDate: {
      ...typography.tiny,
      color: colors.textMuted,
      marginTop: 2,
    },
    entryAmount: {
      ...typography.body,
      fontWeight: '700',
    },
    income: {
      color: colors.good,
    },
    expense: {
      color: colors.critical,
    },
    remove: {
      ...typography.tiny,
      color: colors.critical,
    },
    empty: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.md,
    },
  });
}
