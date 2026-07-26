import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { ThemeMode, useSettings } from '../context/SettingsContext';
import { Language } from '../i18n/translations';
import { radius, spacing, typography } from '../theme';

export function SettingsScreen() {
  const { colors, t, language, setLanguage, themeMode, setThemeMode } = useSettings();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'az', label: 'Azərbaycanca' },
    { value: 'en', label: 'English' },
  ];

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: t.settings.light },
    { value: 'dark', label: t.settings.dark },
    { value: 'system', label: t.settings.system },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>{t.settings.title}</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title={t.settings.language} />
        <View style={styles.optionRow}>
          {languageOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, language === opt.value && styles.optionActive]}
              onPress={() => setLanguage(opt.value)}
            >
              <Text style={[styles.optionText, language === opt.value && styles.optionTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <SectionHeader title={t.settings.appearance} />
        <View style={styles.optionRow}>
          {themeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, themeMode === opt.value && styles.optionActive]}
              onPress={() => setThemeMode(opt.value)}
            >
              <Text style={[styles.optionText, themeMode === opt.value && styles.optionTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useSettings>['colors']) {
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
    optionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    option: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: colors.page,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    optionActive: {
      backgroundColor: colors.blue,
      borderColor: colors.blue,
    },
    optionText: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    optionTextActive: {
      color: colors.white,
    },
  });
}
