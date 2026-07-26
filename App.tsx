import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import notifee, { EventType } from '@notifee/react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { AlarmRingScreen } from './src/screens/AlarmRingScreen';
import { AlarmsScreen } from './src/screens/AlarmsScreen';
import { BudgetScreen } from './src/screens/BudgetScreen';
import { HealthScreen } from './src/screens/HealthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MorningSummaryScreen } from './src/screens/MorningSummaryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import {
  SNOOZE_ACTION_ID,
  STOP_ACTION_ID,
  snoozeAlarmNotification,
  stopAlarm,
} from './src/utils/notifications';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Budget: 'wallet',
  Planning: 'calendar',
  Health: 'water',
  Alarms: 'alarm',
  Settings: 'settings',
};

type RingingAlarm = { id: string; label: string };

function AppContent() {
  const { colors, t, isDark } = useSettings();
  const [ringingAlarm, setRingingAlarm] = useState<RingingAlarm | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    notifee.getInitialNotification().then((initial) => {
      const data = initial?.notification.data;
      if (data?.isAlarm === 'true') {
        setRingingAlarm({ id: String(data.alarmId), label: String(data.label ?? 'Alarm') });
      }
    });

    return notifee.onForegroundEvent(({ type, detail }) => {
      const data = detail.notification?.data;
      const alarmId = data?.alarmId ? String(data.alarmId) : undefined;
      const label = data?.label ? String(data.label) : 'Alarm';
      if (!alarmId) return;

      if (type === EventType.DELIVERED || type === EventType.PRESS) {
        setRingingAlarm({ id: alarmId, label });
      } else if (type === EventType.ACTION_PRESS && detail.pressAction?.id === STOP_ACTION_ID) {
        stopAlarm(alarmId);
        setRingingAlarm(null);
        setShowSummary(true);
      } else if (type === EventType.ACTION_PRESS && detail.pressAction?.id === SNOOZE_ACTION_ID) {
        stopAlarm(alarmId).then(() => snoozeAlarmNotification(alarmId, label, 5));
        setRingingAlarm(null);
      }
    });
  }, []);

  const handleStop = useCallback(async () => {
    if (ringingAlarm) await stopAlarm(ringingAlarm.id);
    setRingingAlarm(null);
    setShowSummary(true);
  }, [ringingAlarm]);

  const handleSnooze = useCallback(async () => {
    if (ringingAlarm) {
      await stopAlarm(ringingAlarm.id);
      await snoozeAlarmNotification(ringingAlarm.id, ringingAlarm.label, 5);
    }
    setRingingAlarm(null);
  }, [ringingAlarm]);

  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.blue,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
            tabBarIcon: ({ color, size, focused }) => {
              const base = ICONS[route.name];
              const name = (focused ? base : `${String(base)}-outline`) as keyof typeof Ionicons.glyphMap;
              return <Ionicons name={name} color={color} size={size} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t.tabs.home }} />
          <Tab.Screen name="Budget" component={BudgetScreen} options={{ tabBarLabel: t.tabs.budget }} />
          <Tab.Screen name="Planning" component={TasksScreen} options={{ tabBarLabel: t.tabs.planning }} />
          <Tab.Screen name="Health" component={HealthScreen} options={{ tabBarLabel: t.tabs.health }} />
          <Tab.Screen name="Alarms" component={AlarmsScreen} options={{ tabBarLabel: t.tabs.alarms }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: t.tabs.settings }} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <AlarmRingScreen
        visible={!!ringingAlarm}
        label={ringingAlarm?.label ?? ''}
        onStop={handleStop}
        onSnooze={handleSnooze}
      />

      <MorningSummaryScreen visible={showSummary} onClose={() => setShowSummary(false)} />
    </AppProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
