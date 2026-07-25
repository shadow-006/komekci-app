import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AlarmItem } from '../components/AlarmItem';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing, typography } from '../theme';
import { Alarm } from '../types';
import {
  cancelAlarmNotification,
  ensureNotificationPermission,
  scheduleAlarmNotification,
  scheduleTestNotification,
} from '../utils/notifications';

export function AlarmsScreen() {
  const { alarms, addAlarm, updateAlarm, removeAlarm } = useApp();
  const [pickerDate, setPickerDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [label, setLabel] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [testSent, setTestSent] = useState(false);

  const sorted = [...alarms].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

  const createAlarm = async () => {
    setError(null);
    try {
      const { granted, canAskAgain: canAsk } = await ensureNotificationPermission();
      setCanAskAgain(canAsk);
      if (!granted) {
        setError(
          canAsk
            ? 'Bildiriş icazəsi verilmədi — alarm zəng edə bilməyəcək.'
            : 'Bildiriş icazəsi bağlıdır. Telefon ayarlarından bu app üçün bildirişlərə icazə verin.'
        );
      }

      const hour = pickerDate.getHours();
      const minute = pickerDate.getMinutes();
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const trimmedLabel = label.trim() || 'Alarm';

      if (granted) {
        await scheduleAlarmNotification(id, trimmedLabel, hour, minute, repeatDaily);
      }

      const alarm: Alarm = {
        id,
        label: trimmedLabel,
        hour,
        minute,
        enabled: granted,
        repeatDaily,
      };
      await addAlarm(alarm);
      setLabel('');
    } catch (e) {
      console.log('Create alarm error:', e);
      setError(`Xəta: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const toggleAlarm = async (alarm: Alarm) => {
    if (alarm.enabled) {
      await cancelAlarmNotification(alarm.id);
      await updateAlarm({ ...alarm, enabled: false });
    } else {
      const { granted } = await ensureNotificationPermission();
      if (granted) {
        await scheduleAlarmNotification(alarm.id, alarm.label, alarm.hour, alarm.minute, alarm.repeatDaily);
      }
      await updateAlarm({ ...alarm, enabled: granted });
    }
  };

  const sendTestNotification = async () => {
    setError(null);
    try {
      const { granted, canAskAgain: canAsk } = await ensureNotificationPermission();
      setCanAskAgain(canAsk);
      if (!granted) {
        setError(
          canAsk
            ? 'Bildiriş icazəsi verilmədi.'
            : 'Bildiriş icazəsi bağlıdır. Telefon ayarlarından bu app üçün bildirişlərə icazə verin.'
        );
        return;
      }
      await scheduleTestNotification();
      setTestSent(true);
      setTimeout(() => setTestSent(false), 10000);
    } catch (e) {
      console.log('Test alarm error:', e);
      setError(`Xəta: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const deleteAlarm = async (id: string) => {
    await cancelAlarmNotification(id);
    await removeAlarm(id);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Alarmlar</Text>

      <Card style={styles.addCard}>
        {Platform.OS === 'android' && (
          <TouchableOpacity style={styles.timeBtn} onPress={() => setShowPicker(true)}>
            <Text style={styles.timeBtnText}>
              {String(pickerDate.getHours()).padStart(2, '0')}:{String(pickerDate.getMinutes()).padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        )}
        {showPicker && (
          <DateTimePicker
            value={pickerDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (date) setPickerDate(date);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Alarm adı (məs: Oyanış)"
          placeholderTextColor={colors.textMuted}
          value={label}
          onChangeText={setLabel}
        />

        <View style={styles.repeatRow}>
          <Text style={styles.repeatLabel}>Hər gün təkrarla</Text>
          <TouchableOpacity
            style={[styles.repeatToggle, repeatDaily && styles.repeatToggleActive]}
            onPress={() => setRepeatDaily((r) => !r)}
          >
            <Text style={[styles.repeatToggleText, repeatDaily && styles.repeatToggleTextActive]}>
              {repeatDaily ? 'Bəli' : 'Xeyr'}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View>
            <Text style={styles.error}>{error}</Text>
            {!canAskAgain && (
              <TouchableOpacity onPress={() => Linking.openSettings()}>
                <Text style={styles.settingsLink}>Ayarlara get →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.createBtn} onPress={createAlarm}>
          <Text style={styles.createBtnText}>Alarm qur</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testBtn} onPress={sendTestNotification}>
          <Text style={styles.testBtnText}>{testSent ? '✓ 8 saniyəyə real alarm çalacaq…' : 'Alarmı test et (8 san)'}</Text>
        </TouchableOpacity>
      </Card>

      <FlatList
        data={sorted}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => <AlarmItem alarm={item} onToggle={toggleAlarm} onRemove={deleteAlarm} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Hələ alarm yoxdur.</Text>}
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
  title: {
    ...typography.hero,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  addCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  timeBtn: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  timeBtnText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.blue,
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
    marginTop: spacing.sm,
  },
  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  repeatLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  repeatToggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  repeatToggleActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  repeatToggleText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  repeatToggleTextActive: {
    color: colors.white,
  },
  error: {
    ...typography.tiny,
    color: colors.critical,
    marginTop: spacing.sm,
  },
  settingsLink: {
    ...typography.tiny,
    color: colors.blue,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  createBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.blue,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  createBtnText: {
    color: colors.white,
    ...typography.body,
    fontWeight: '700',
  },
  testBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  testBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
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
