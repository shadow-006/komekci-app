import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import notifee, { EventType } from '@notifee/react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { AlarmRingScreen } from './src/screens/AlarmRingScreen';
import { AlarmsScreen } from './src/screens/AlarmsScreen';
import { BudgetScreen } from './src/screens/BudgetScreen';
import { HealthScreen } from './src/screens/HealthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MorningSummaryScreen } from './src/screens/MorningSummaryScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { colors } from './src/theme';
import {
  SNOOZE_ACTION_ID,
  STOP_ACTION_ID,
  snoozeAlarmNotification,
  stopAlarm,
} from './src/utils/notifications';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Ana: 'home',
  Büdcə: 'wallet',
  Planlama: 'calendar',
  Sağlamlıq: 'water',
  Alarmlar: 'alarm',
};

type RingingAlarm = { id: string; label: string };

export default function App() {
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
    <SafeAreaProvider>
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
            <Tab.Screen name="Ana" component={HomeScreen} />
            <Tab.Screen name="Büdcə" component={BudgetScreen} />
            <Tab.Screen name="Planlama" component={TasksScreen} />
            <Tab.Screen name="Sağlamlıq" component={HealthScreen} />
            <Tab.Screen name="Alarmlar" component={AlarmsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="dark" />

        <AlarmRingScreen
          visible={!!ringingAlarm}
          label={ringingAlarm?.label ?? ''}
          onStop={handleStop}
          onSnooze={handleSnooze}
        />

        <MorningSummaryScreen visible={showSummary} onClose={() => setShowSummary(false)} />
      </AppProvider>
    </SafeAreaProvider>
  );
}
