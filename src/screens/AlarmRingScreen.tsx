import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { formatTime } from '../utils/date';

type Props = {
  visible: boolean;
  label: string;
  onStop: () => void;
  onSnooze: () => void;
};

export function AlarmRingScreen({ visible, label, onStop, onSnooze }: Props) {
  const [now, setNow] = useState(new Date());
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible, pulse]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent presentationStyle="fullScreen">
      <View style={styles.screen}>
        <Animated.Text style={[styles.icon, { transform: [{ scale: pulse }] }]}>⏰</Animated.Text>
        <Text style={styles.time}>{formatTime(now.getHours(), now.getMinutes())}</Text>
        <Text style={styles.label}>{label || 'Alarm'}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.snoozeBtn} onPress={onSnooze}>
            <Text style={styles.snoozeBtnText}>Təxirə sal (5 dəq)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
            <Text style={styles.stopBtnText}>Dayandır</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    fontSize: 96,
    marginBottom: spacing.lg,
  },
  time: {
    ...typography.hero,
    fontSize: 56,
    color: colors.white,
  },
  label: {
    ...typography.h1,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    position: 'absolute',
    bottom: spacing.xxl,
    gap: spacing.md,
  },
  snoozeBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  snoozeBtnText: {
    color: colors.white,
    ...typography.h2,
  },
  stopBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.critical,
  },
  stopBtnText: {
    color: colors.white,
    ...typography.h2,
    fontWeight: '700',
  },
});
