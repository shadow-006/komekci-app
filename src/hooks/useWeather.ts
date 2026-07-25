import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { WeatherSnapshot } from '../types';
import { fetchWeather } from '../utils/weather';

type WeatherState = {
  loading: boolean;
  error: string | null;
  data: WeatherSnapshot | null;
};

export function useWeather() {
  const [state, setState] = useState<WeatherState>({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ loading: false, error: 'Lokasiya icazəsi verilmədi', data: null });
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;

      const [weather, places] = await Promise.all([
        fetchWeather(latitude, longitude),
        Location.reverseGeocodeAsync({ latitude, longitude }),
      ]);

      const city = places?.[0]?.city ?? places?.[0]?.region ?? places?.[0]?.subregion ?? 'Yerin';

      setState({
        loading: false,
        error: null,
        data: { ...weather, city, updatedAt: Date.now() },
      });
    } catch (e) {
      setState({ loading: false, error: 'Hava məlumatı alınmadı', data: null });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
