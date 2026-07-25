import notifee, {
  AlarmType,
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';

const ALARM_CHANNEL_ID = 'alarms';
export const STOP_ACTION_ID = 'stop-alarm';
export const SNOOZE_ACTION_ID = 'snooze-alarm';

export async function ensureNotificationPermission(): Promise<{ granted: boolean; canAskAgain: boolean }> {
  const settings = await notifee.requestPermission();
  const granted = settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  return { granted, canAskAgain: true };
}

async function ensureAlarmChannel(): Promise<void> {
  await notifee.createChannel({
    id: ALARM_CHANNEL_ID,
    name: 'Alarmlar',
    importance: AndroidImportance.HIGH,
    sound: 'alarm',
    vibration: true,
    vibrationPattern: [300, 500, 300, 500],
    bypassDnd: true,
  });
}

function nextTriggerTimestamp(hour: number, minute: number): number {
  const next = new Date();
  next.setSeconds(0, 0);
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

export async function scheduleAlarmNotification(
  alarmId: string,
  label: string,
  hour: number,
  minute: number,
  repeatDaily: boolean
): Promise<string> {
  await ensureAlarmChannel();

  return notifee.createTriggerNotification(
    {
      id: alarmId,
      title: '⏰ Alarm',
      body: label || 'Vaxtdır!',
      data: { alarmId, isAlarm: 'true', label: label || 'Alarm' },
      android: {
        channelId: ALARM_CHANNEL_ID,
        category: AndroidCategory.ALARM,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        ongoing: true,
        autoCancel: false,
        loopSound: true,
        showTimestamp: true,
        fullScreenAction: { id: 'default' },
        pressAction: { id: 'default' },
        actions: [
          { title: 'Təxirə sal', pressAction: { id: SNOOZE_ACTION_ID } },
          { title: 'Dayandır', pressAction: { id: STOP_ACTION_ID } },
        ],
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: nextTriggerTimestamp(hour, minute),
      repeatFrequency: repeatDaily ? RepeatFrequency.DAILY : undefined,
      alarmManager: { type: AlarmType.SET_ALARM_CLOCK },
    }
  );
}

export async function scheduleTestNotification(): Promise<string> {
  await ensureAlarmChannel();
  return notifee.createTriggerNotification(
    {
      id: 'test-alarm',
      title: '⏰ Test alarmı',
      body: 'Bu, real alarm zəngi kimi çalır!',
      data: { alarmId: 'test-alarm', isAlarm: 'true', label: 'Test alarmı' },
      android: {
        channelId: ALARM_CHANNEL_ID,
        category: AndroidCategory.ALARM,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        ongoing: true,
        autoCancel: false,
        loopSound: true,
        fullScreenAction: { id: 'default' },
        pressAction: { id: 'default' },
        actions: [
          { title: 'Təxirə sal', pressAction: { id: SNOOZE_ACTION_ID } },
          { title: 'Dayandır', pressAction: { id: STOP_ACTION_ID } },
        ],
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 8000,
      alarmManager: { type: AlarmType.SET_ALARM_CLOCK },
    }
  );
}

export async function snoozeAlarmNotification(alarmId: string, label: string, minutesFromNow: number): Promise<string> {
  await ensureAlarmChannel();
  return notifee.createTriggerNotification(
    {
      id: `${alarmId}-snooze`,
      title: '⏰ Alarm (təxirə salınıb)',
      body: label || 'Vaxtdır!',
      data: { alarmId, isAlarm: 'true', label: label || 'Alarm' },
      android: {
        channelId: ALARM_CHANNEL_ID,
        category: AndroidCategory.ALARM,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        ongoing: true,
        autoCancel: false,
        loopSound: true,
        fullScreenAction: { id: 'default' },
        pressAction: { id: 'default' },
        actions: [
          { title: 'Təxirə sal', pressAction: { id: SNOOZE_ACTION_ID } },
          { title: 'Dayandır', pressAction: { id: STOP_ACTION_ID } },
        ],
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + minutesFromNow * 60 * 1000,
      alarmManager: { type: AlarmType.SET_ALARM_CLOCK },
    }
  );
}

export async function stopAlarm(alarmId: string): Promise<void> {
  await notifee.cancelNotification(alarmId).catch(() => {});
  await notifee.cancelNotification(`${alarmId}-snooze`).catch(() => {});
}

export async function cancelAlarmNotification(alarmId: string): Promise<void> {
  await notifee.cancelTriggerNotification(alarmId).catch(() => {});
  await notifee.cancelNotification(alarmId).catch(() => {});
  await notifee.cancelTriggerNotification(`${alarmId}-snooze`).catch(() => {});
  await notifee.cancelNotification(`${alarmId}-snooze`).catch(() => {});
}
