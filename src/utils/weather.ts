import { WeatherSnapshot } from '../types';

// WMO weather codes -> short Azerbaijani description + icon
const WMO: Record<number, { label: string; icon: string }> = {
  0: { label: 'Açıq hava', icon: '☀️' },
  1: { label: 'Əsasən açıq', icon: '🌤️' },
  2: { label: 'Yarımbuludlu', icon: '⛅' },
  3: { label: 'Buludlu', icon: '☁️' },
  45: { label: 'Duman', icon: '🌫️' },
  48: { label: 'Şaxtalı duman', icon: '🌫️' },
  51: { label: 'Yüngül çiskin', icon: '🌦️' },
  53: { label: 'Çiskin', icon: '🌦️' },
  55: { label: 'Sıx çiskin', icon: '🌦️' },
  61: { label: 'Yüngül yağış', icon: '🌧️' },
  63: { label: 'Yağış', icon: '🌧️' },
  65: { label: 'Güclü yağış', icon: '🌧️' },
  71: { label: 'Yüngül qar', icon: '🌨️' },
  73: { label: 'Qar', icon: '🌨️' },
  75: { label: 'Güclü qar', icon: '❄️' },
  80: { label: 'Sağanaq', icon: '🌦️' },
  81: { label: 'Güclü sağanaq', icon: '🌧️' },
  82: { label: 'Şiddətli sağanaq', icon: '⛈️' },
  95: { label: 'Tufan', icon: '⛈️' },
  96: { label: 'Dolulu tufan', icon: '⛈️' },
  99: { label: 'Şiddətli dolulu tufan', icon: '⛈️' },
};

export function describeWeatherCode(code: number): { label: string; icon: string } {
  return WMO[code] ?? { label: 'Naməlum', icon: '🌡️' };
}

export async function fetchWeather(lat: number, lon: number): Promise<Omit<WeatherSnapshot, 'city' | 'updatedAt'>> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Hava məlumatı alınmadı');
  const json = await res.json();
  return {
    tempC: Math.round(json.current.temperature_2m),
    weatherCode: json.current.weather_code,
  };
}
