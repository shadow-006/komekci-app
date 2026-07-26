import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { spacing, typography } from '../theme';
import { describeWeatherCode } from '../utils/weather';
import { WeatherSnapshot } from '../types';

type Props = {
  loading: boolean;
  error: string | null;
  data: WeatherSnapshot | null;
  onRetry: () => void;
};

export function WeatherCard({ loading, error, data, onRetry }: Props) {
  const { colors, t, language } = useSettings();

  if (loading) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicator color={colors.blue} />
        <Text style={[typography.caption, { color: colors.textMuted, marginLeft: spacing.sm }]}>
          {t.home.weatherLoading}
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onRetry}>
        <Text style={[typography.caption, { color: colors.textMuted, marginLeft: spacing.sm }]}>
          {error ?? '—'} · {t.home.weatherRetry}
        </Text>
      </TouchableOpacity>
    );
  }

  const { label, icon } = describeWeatherCode(data.weatherCode, language);

  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onRetry} activeOpacity={0.7}>
      <Text style={{ fontSize: 34, marginRight: spacing.md }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{data.tempC}°C</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
          {label} · {data.city}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
