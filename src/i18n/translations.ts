export type Language = 'az' | 'en';

export interface TranslationDict {
  tabs: { home: string; budget: string; planning: string; health: string; alarms: string; settings: string };

  greeting: { night: string; morning: string; day: string; evening: string };

  home: {
    todayTasks: string;
    remaining: string;
    addTaskPlaceholder: string;
    noTasks: string;
    water: string;
    calorie: string;
    goal: string;
    weatherLoading: string;
    weatherRetry: string;
  };

  budget: {
    title: string;
    thisMonth: string;
    income: string;
    expense: string;
    expenseGoal: string;
    newEntry: string;
    namePlaceholder: string;
    amountPlaceholder: string;
    add: string;
    monthlyGoal: string;
    perMonth: string;
    entries: string;
    noEntries: string;
    remove: string;
  };

  planning: {
    title: string;
    today: string;
    addPlaceholder: string;
    noTasks: string;
  };

  health: {
    title: string;
    water: string;
    calorie: string;
    dailyGoals: string;
    waterGoal: string;
    calorieGoal: string;
    resetToday: string;
    history: string;
    noHistory: string;
  };

  alarms: {
    title: string;
    namePlaceholder: string;
    repeatDaily: string;
    yes: string;
    no: string;
    create: string;
    test: string;
    testSent: string;
    noAlarms: string;
    remove: string;
    permissionDenied: string;
    permissionBlocked: string;
    openSettings: string;
    everyDay: string;
    once: string;
  };

  ring: {
    snooze: string;
    stop: string;
    defaultLabel: string;
  };

  summary: {
    noTasks: string;
    tasksLeft: (n: number) => string;
    addHint: string;
    start: string;
  };

  settings: {
    title: string;
    language: string;
    appearance: string;
    light: string;
    dark: string;
    system: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  az: {
    tabs: { home: 'Ana', budget: 'Büdcə', planning: 'Planlama', health: 'Sağlamlıq', alarms: 'Alarmlar', settings: 'Ayarlar' },

    greeting: { night: 'Sağlam gecə', morning: 'Sabahınız xeyir', day: 'Gününüz xeyir', evening: 'Axşamınız xeyir' },

    home: {
      todayTasks: 'Bugünkü tapşırıqlar',
      remaining: 'qalıb',
      addTaskPlaceholder: 'Yeni tapşırıq əlavə et…',
      noTasks: 'Bu gün üçün tapşırıq yoxdur. Yuxarıdan əlavə et.',
      water: 'Su',
      calorie: 'Kalori',
      goal: 'Hədəf',
      weatherLoading: 'Hava yüklənir…',
      weatherRetry: 'yenidən cəhd et',
    },

    budget: {
      title: 'Büdcə',
      thisMonth: 'Bu ay',
      income: 'Gəlir',
      expense: 'Xərc',
      expenseGoal: 'Xərc hədəfi',
      newEntry: 'Yeni qeyd',
      namePlaceholder: 'Ad (məs: Market)',
      amountPlaceholder: 'Məbləğ (₼)',
      add: 'Əlavə et',
      monthlyGoal: 'Aylıq xərc hədəfi',
      perMonth: '₼ / ay',
      entries: 'Qeydlər',
      noEntries: 'Bu ay üçün büdcə qeydi yoxdur',
      remove: 'Sil',
    },

    planning: {
      title: 'Planlama',
      today: 'Bu gün',
      addPlaceholder: 'Bu tarix üçün plan yaz…',
      noTasks: 'Bu tarix üçün plan yoxdur.',
    },

    health: {
      title: 'Sağlamlıq',
      water: 'Su',
      calorie: 'Kalori',
      dailyGoals: 'Gündəlik hədəflər',
      waterGoal: 'Su hədəfi (ml)',
      calorieGoal: 'Kalori hədəfi (kcal)',
      resetToday: 'Bugünkü hesabı sıfırla',
      history: 'Tarixçə',
      noHistory: 'Hələ keçmiş qeyd yoxdur.',
    },

    alarms: {
      title: 'Alarmlar',
      namePlaceholder: 'Alarm adı (məs: Oyanış)',
      repeatDaily: 'Hər gün təkrarla',
      yes: 'Bəli',
      no: 'Xeyr',
      create: 'Alarm qur',
      test: 'Alarmı test et (8 san)',
      testSent: '✓ 8 saniyəyə real alarm çalacaq…',
      noAlarms: 'Hələ alarm yoxdur.',
      remove: 'Sil',
      permissionDenied: 'Bildiriş icazəsi verilmədi — alarm zəng edə bilməyəcək.',
      permissionBlocked: 'Bildiriş icazəsi bağlıdır. Telefon ayarlarından bu app üçün bildirişlərə icazə verin.',
      openSettings: 'Ayarlara get →',
      everyDay: 'Hər gün',
      once: 'Bir dəfə',
    },

    ring: {
      snooze: 'Təxirə sal (5 dəq)',
      stop: 'Dayandır',
      defaultLabel: 'Alarm',
    },

    summary: {
      noTasks: 'Bu gün üçün planlaşdırılmış işiniz yoxdur.',
      tasksLeft: (n: number) => `Bu gün etməli olduğunuz ${n} iş var:`,
      addHint: 'Planlama bölməsindən yeni tapşırıq əlavə edə bilərsiniz.',
      start: 'Başlayaq',
    },

    settings: {
      title: 'Ayarlar',
      language: 'Dil',
      appearance: 'Görünüş',
      light: 'İşıqlı',
      dark: 'Qaranlıq',
      system: 'Sistem',
    },
  },

  en: {
    tabs: { home: 'Home', budget: 'Budget', planning: 'Planning', health: 'Health', alarms: 'Alarms', settings: 'Settings' },

    greeting: { night: 'Good night', morning: 'Good morning', day: 'Good day', evening: 'Good evening' },

    home: {
      todayTasks: "Today's tasks",
      remaining: 'left',
      addTaskPlaceholder: 'Add a new task…',
      noTasks: 'No tasks for today. Add one above.',
      water: 'Water',
      calorie: 'Calories',
      goal: 'Goal',
      weatherLoading: 'Loading weather…',
      weatherRetry: 'retry',
    },

    budget: {
      title: 'Budget',
      thisMonth: 'This month',
      income: 'Income',
      expense: 'Expense',
      expenseGoal: 'Expense goal',
      newEntry: 'New entry',
      namePlaceholder: 'Name (e.g. Groceries)',
      amountPlaceholder: 'Amount (₼)',
      add: 'Add',
      monthlyGoal: 'Monthly expense goal',
      perMonth: '₼ / month',
      entries: 'Entries',
      noEntries: 'No budget entries this month',
      remove: 'Remove',
    },

    planning: {
      title: 'Planning',
      today: 'Today',
      addPlaceholder: 'Write a plan for this date…',
      noTasks: 'No plan for this date.',
    },

    health: {
      title: 'Health',
      water: 'Water',
      calorie: 'Calories',
      dailyGoals: 'Daily goals',
      waterGoal: 'Water goal (ml)',
      calorieGoal: 'Calorie goal (kcal)',
      resetToday: "Reset today's totals",
      history: 'History',
      noHistory: 'No past entries yet.',
    },

    alarms: {
      title: 'Alarms',
      namePlaceholder: 'Alarm name (e.g. Wake up)',
      repeatDaily: 'Repeat daily',
      yes: 'Yes',
      no: 'No',
      create: 'Set alarm',
      test: 'Test alarm (8s)',
      testSent: '✓ Real alarm will ring in 8 seconds…',
      noAlarms: 'No alarms yet.',
      remove: 'Remove',
      permissionDenied: 'Notification permission denied — the alarm will not be able to ring.',
      permissionBlocked: 'Notification permission is blocked. Allow notifications for this app in phone settings.',
      openSettings: 'Open settings →',
      everyDay: 'Every day',
      once: 'Once',
    },

    ring: {
      snooze: 'Snooze (5 min)',
      stop: 'Stop',
      defaultLabel: 'Alarm',
    },

    summary: {
      noTasks: 'You have nothing planned for today.',
      tasksLeft: (n: number) => `You have ${n} thing${n === 1 ? '' : 's'} to do today:`,
      addHint: 'You can add a new task from the Planning tab.',
      start: "Let's go",
    },

    settings: {
      title: 'Settings',
      language: 'Language',
      appearance: 'Appearance',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },
};
