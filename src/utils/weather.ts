import { Language } from '../i18n/translations';
import { WeatherSnapshot } from '../types';

// WMO weather codes -> description (per language) + icon
const WMO: Record<number, { az: string; en: string; icon: string }> = {
  0: { az: 'Açıq hava', en: 'Clear sky', icon: '☀️' },
  1: { az: 'Əsasən açıq', en: 'Mostly clear', icon: '🌤️' },
  2: { az: 'Yarımbuludlu', en: 'Partly cloudy', icon: '⛅' },
  3: { az: 'Buludlu', en: 'Cloudy', icon: '☁️' },
  45: { az: 'Duman', en: 'Fog', icon: '🌫️' },
  48: { az: 'Şaxtalı duman', en: 'Rime fog', icon: '🌫️' },
  51: { az: 'Yüngül çiskin', en: 'Light drizzle', icon: '🌦️' },
  53: { az: 'Çiskin', en: 'Drizzle', icon: '🌦️' },
  55: { az: 'Sıx çiskin', en: 'Dense drizzle', icon: '🌦️' },
  61: { az: 'Yüngül yağış', en: 'Light rain', icon: '🌧️' },
  63: { az: 'Yağış', en: 'Rain', icon: '🌧️' },
  65: { az: 'Güclü yağış', en: 'Heavy rain', icon: '🌧️' },
  71: { az: 'Yüngül qar', en: 'Light snow', icon: '🌨️' },
  73: { az: 'Qar', en: 'Snow', icon: '🌨️' },
  75: { az: 'Güclü qar', en: 'Heavy snow', icon: '❄️' },
  80: { az: 'Sağanaq', en: 'Rain showers', icon: '🌦️' },
  81: { az: 'Güclü sağanaq', en: 'Heavy showers', icon: '🌧️' },
  82: { az: 'Şiddətli sağanaq', en: 'Violent showers', icon: '⛈️' },
  95: { az: 'Tufan', en: 'Thunderstorm', icon: '⛈️' },
  96: { az: 'Dolulu tufan', en: 'Thunderstorm w/ hail', icon: '⛈️' },
  99: { az: 'Şiddətli dolulu tufan', en: 'Severe thunderstorm', icon: '⛈️' },
};

export function describeWeatherCode(code: number, language: Language): { label: string; icon: string } {
  const entry = WMO[code];
  if (!entry) return { label: language === 'az' ? 'Naməlum' : 'Unknown', icon: '🌡️' };
  return { label: entry[language], icon: entry.icon };
}

export async function fetchWeather(lat: number, lon: number): Promise<Omit<WeatherSnapshot, 'city' | 'updatedAt'>> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const json = await res.json();
  return {
    tempC: Math.round(json.current.temperature_2m),
    weatherCode: json.current.weather_code,
  };
}
