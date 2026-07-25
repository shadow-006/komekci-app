import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../storage/storage';
import { Alarm, BudgetEntry, DayLog, Task, UserGoals } from '../types';
import { todayKey } from '../utils/date';

const DEFAULT_GOALS: UserGoals = { waterGoalMl: 2000, calorieGoalKcal: 2200 };
const DEFAULT_BUDGET_GOAL = 1000;

type AppContextValue = {
  ready: boolean;

  tasks: Task[];
  addTask: (title: string, date: string, time?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;

  dayLogs: DayLog[];
  todayLog: DayLog;
  addWater: (ml: number) => Promise<void>;
  addCalories: (kcal: number) => Promise<void>;
  resetToday: () => Promise<void>;

  goals: UserGoals;
  updateGoals: (goals: UserGoals) => Promise<void>;

  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => Promise<void>;
  updateAlarm: (alarm: Alarm) => Promise<void>;
  removeAlarm: (id: string) => Promise<void>;

  budgetEntries: BudgetEntry[];
  addBudgetEntry: (title: string, amount: number, type: 'income' | 'expense', date: string) => Promise<void>;
  removeBudgetEntry: (id: string) => Promise<void>;
  monthlyBudgetGoal: number;
  updateMonthlyBudgetGoal: (value: number) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

function emptyLog(date: string): DayLog {
  return { date, waterMl: 0, calories: 0 };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [monthlyBudgetGoal, setMonthlyBudgetGoal] = useState<number>(DEFAULT_BUDGET_GOAL);

  useEffect(() => {
    (async () => {
      const [t, d, a, g, b, bg] = await Promise.all([
        storage.load<Task[]>(storage.keys.tasks, []),
        storage.load<DayLog[]>(storage.keys.dayLogs, []),
        storage.load<Alarm[]>(storage.keys.alarms, []),
        storage.load<UserGoals>(storage.keys.goals, DEFAULT_GOALS),
        storage.load<BudgetEntry[]>(storage.keys.budgetEntries, []),
        storage.load<number>(storage.keys.budgetGoal, DEFAULT_BUDGET_GOAL),
      ]);
      setTasks(t);
      setDayLogs(d);
      setAlarms(a);
      setGoals(g);
      setBudgetEntries(b);
      setMonthlyBudgetGoal(bg);
      setReady(true);
    })();
  }, []);

  const persistTasks = useCallback(async (next: Task[]) => {
    setTasks(next);
    await storage.save(storage.keys.tasks, next);
  }, []);

  const persistDayLogs = useCallback(async (next: DayLog[]) => {
    setDayLogs(next);
    await storage.save(storage.keys.dayLogs, next);
  }, []);

  const persistAlarms = useCallback(async (next: Alarm[]) => {
    setAlarms(next);
    await storage.save(storage.keys.alarms, next);
  }, []);

  const addTask = useCallback(
    async (title: string, date: string, time?: string) => {
      const task: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        done: false,
        date,
        time,
        createdAt: Date.now(),
      };
      await persistTasks([task, ...tasks]);
    },
    [tasks, persistTasks]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      await persistTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    },
    [tasks, persistTasks]
  );

  const removeTask = useCallback(
    async (id: string) => {
      await persistTasks(tasks.filter((t) => t.id !== id));
    },
    [tasks, persistTasks]
  );

  const todayLog = useMemo(() => {
    const key = todayKey();
    return dayLogs.find((l) => l.date === key) ?? emptyLog(key);
  }, [dayLogs]);

  const upsertTodayLog = useCallback(
    async (patch: Partial<DayLog>) => {
      const key = todayKey();
      const existing = dayLogs.find((l) => l.date === key) ?? emptyLog(key);
      const updated = { ...existing, ...patch };
      const next = [updated, ...dayLogs.filter((l) => l.date !== key)];
      await persistDayLogs(next);
    },
    [dayLogs, persistDayLogs]
  );

  const addWater = useCallback(
    async (ml: number) => {
      await upsertTodayLog({ waterMl: Math.max(0, todayLog.waterMl + ml) });
    },
    [todayLog, upsertTodayLog]
  );

  const addCalories = useCallback(
    async (kcal: number) => {
      await upsertTodayLog({ calories: Math.max(0, todayLog.calories + kcal) });
    },
    [todayLog, upsertTodayLog]
  );

  const resetToday = useCallback(async () => {
    await upsertTodayLog({ waterMl: 0, calories: 0 });
  }, [upsertTodayLog]);

  const updateGoals = useCallback(async (next: UserGoals) => {
    setGoals(next);
    await storage.save(storage.keys.goals, next);
  }, []);

  const addAlarm = useCallback(
    async (alarm: Alarm) => {
      await persistAlarms([alarm, ...alarms]);
    },
    [alarms, persistAlarms]
  );

  const updateAlarm = useCallback(
    async (alarm: Alarm) => {
      await persistAlarms(alarms.map((a) => (a.id === alarm.id ? alarm : a)));
    },
    [alarms, persistAlarms]
  );

  const removeAlarm = useCallback(
    async (id: string) => {
      await persistAlarms(alarms.filter((a) => a.id !== id));
    },
    [alarms, persistAlarms]
  );

  const persistBudgetEntries = useCallback(async (next: BudgetEntry[]) => {
    setBudgetEntries(next);
    await storage.save(storage.keys.budgetEntries, next);
  }, []);

  const addBudgetEntry = useCallback(
    async (title: string, amount: number, type: 'income' | 'expense', date: string) => {
      const entry: BudgetEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        amount: Math.abs(amount),
        type,
        date,
        createdAt: Date.now(),
      };
      await persistBudgetEntries([entry, ...budgetEntries]);
    },
    [budgetEntries, persistBudgetEntries]
  );

  const removeBudgetEntry = useCallback(
    async (id: string) => {
      await persistBudgetEntries(budgetEntries.filter((b) => b.id !== id));
    },
    [budgetEntries, persistBudgetEntries]
  );

  const updateMonthlyBudgetGoal = useCallback(async (value: number) => {
    setMonthlyBudgetGoal(value);
    await storage.save(storage.keys.budgetGoal, value);
  }, []);

  const value: AppContextValue = {
    ready,
    tasks,
    addTask,
    toggleTask,
    removeTask,
    dayLogs,
    todayLog,
    addWater,
    addCalories,
    resetToday,
    goals,
    updateGoals,
    alarms,
    addAlarm,
    updateAlarm,
    removeAlarm,
    budgetEntries,
    addBudgetEntry,
    removeBudgetEntry,
    monthlyBudgetGoal,
    updateMonthlyBudgetGoal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
