import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { describeWeatherCode } from '../utils/weather';
import { WeatherSnapshot } from '../types';

type Props = {
  loading: boolean;
  error: string | null;
  data: WeatherSnapshot | null;
  onRetry: () => void;
};

export function WeatherCard({ loading, error, data, onRetry }: Props) {
  if (loading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator color={colors.blue} />
        <Text style={styles.muted}>Hava yüklənir…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <TouchableOpacity style={styles.row} onPress={onRetry}>
        <Text style={styles.muted}>{error ?? 'Hava məlumatı yoxdur'} · yenidən cəhd et</Text>
      </TouchableOpacity>
    );
  }

  const { label, icon } = describeWeatherCode(data.weatherCode);

  return (
    <TouchableOpacity style={styles.row} onPress={onRetry} activeOpacity={0.7}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.temp}>{data.tempC}°C</Text>
        <Text style={styles.place}>
          {label} · {data.city}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 34,
    marginRight: spacing.md,
  },
  temp: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  place: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  muted: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
});
