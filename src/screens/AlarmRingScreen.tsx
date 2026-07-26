import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing, typography } from '../theme';
import { formatTime } from '../utils/date';

const alarmSound = require('../../assets/sounds/alarm.wav');

type Props = {
  visible: boolean;
  label: string;
  onStop: () => void;
  onSnooze: () => void;
};

export function AlarmRingScreen({ visible, label, onStop, onSnooze }: Props) {
  const { t } = useSettings();
  const [now, setNow] = useState(new Date());
  const pulse = useRef(new Animated.Value(1)).current;
  const player = useAudioPlayer(alarmSound);

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

  // Play via the media stream (bypasses the phone's ringer/silent switch) and
  // loop it continuously until the user stops or snoozes the alarm.
  useEffect(() => {
    if (!visible) {
      player.pause();
      return;
    }
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
    }).catch(() => {});
    player.loop = true;
    player.volume = 1;
    player.seekTo(0);
    player.play();
    return () => {
      player.pause();
    };
  }, [visible, player]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent presentationStyle="fullScreen">
      <View style={styles.screen}>
        <Animated.Text style={[styles.icon, { transform: [{ scale: pulse }] }]}>⏰</Animated.Text>
        <Text style={styles.time}>{formatTime(now.getHours(), now.getMinutes())}</Text>
        <Text style={styles.label}>{label || t.ring.defaultLabel}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.snoozeBtn} onPress={onSnooze}>
            <Text style={styles.snoozeBtnText}>{t.ring.snooze}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
            <Text style={styles.stopBtnText}>{t.ring.stop}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0b0b0b',
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
    color: '#ffffff',
  },
  label: {
    ...typography.h1,
    color: '#ffffff',
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
    borderColor: '#ffffff',
  },
  snoozeBtnText: {
    color: '#ffffff',
    ...typography.h2,
  },
  stopBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: '#d03b3b',
  },
  stopBtnText: {
    color: '#ffffff',
    ...typography.h2,
    fontWeight: '700',
  },
});
