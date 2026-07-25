import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  tasks: '@assistant/tasks',
  dayLogs: '@assistant/dayLogs',
  alarms: '@assistant/alarms',
  goals: '@assistant/goals',
  budgetEntries: '@assistant/budgetEntries',
  budgetGoal: '@assistant/budgetGoal',
} as const;

async function load<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function save<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  keys: KEYS,
  load,
  save,
};
