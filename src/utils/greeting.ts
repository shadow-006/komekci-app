import { TranslationDict } from '../i18n/translations';

export function greetingForHour(hour: number, t: TranslationDict): string {
  if (hour < 6) return t.greeting.night;
  if (hour < 12) return t.greeting.morning;
  if (hour < 18) return t.greeting.day;
  return t.greeting.evening;
}
