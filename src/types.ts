export type Task = {
  id: string;
  title: string;
  done: boolean;
  date: string; // YYYY-MM-DD, the day this task belongs to
  time?: string; // HH:mm, optional scheduled time
  createdAt: number;
};

export type DayLog = {
  date: string; // YYYY-MM-DD
  waterMl: number;
  calories: number;
};

export type Alarm = {
  id: string;
  label: string;
  hour: number;
  minute: number;
  enabled: boolean;
  repeatDaily: boolean;
};

export type UserGoals = {
  waterGoalMl: number;
  calorieGoalKcal: number;
};

export type WeatherSnapshot = {
  tempC: number;
  weatherCode: number;
  city: string;
  updatedAt: number;
};

export type BudgetEntry = {
  id: string;
  title: string;
  amount: number; // always positive; sign comes from `type`
  type: 'income' | 'expense';
  date: string; // YYYY-MM-DD
  createdAt: number;
};
