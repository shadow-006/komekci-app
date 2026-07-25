import { registerRootComponent } from 'expo';
import notifee, { EventType } from '@notifee/react-native';

import App from './App';
import { SNOOZE_ACTION_ID, STOP_ACTION_ID, snoozeAlarmNotification, stopAlarm } from './src/utils/notifications';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS) return;

  const data = detail.notification?.data;
  const alarmId = data?.alarmId ? String(data.alarmId) : undefined;
  const label = data?.label ? String(data.label) : 'Alarm';
  if (!alarmId) return;

  if (detail.pressAction?.id === STOP_ACTION_ID) {
    await stopAlarm(alarmId);
  } else if (detail.pressAction?.id === SNOOZE_ACTION_ID) {
    await stopAlarm(alarmId);
    await snoozeAlarmNotification(alarmId, label, 5);
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
