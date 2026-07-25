const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const ALARM_PERMISSIONS = [
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.USE_FULL_SCREEN_INTENT',
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.RECEIVE_BOOT_COMPLETED',
];

function withAlarmManifest(config) {
  config = AndroidConfig.Permissions.withPermissions(config, ALARM_PERMISSIONS);

  return withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const activities = mainApplication.activity ?? [];
    const mainActivity = activities.find((a) => a.$['android:name'] === '.MainActivity');

    if (mainActivity) {
      // Lets the alarm's full-screen notification open this activity directly
      // over the lock screen and wake the device, like a native alarm clock.
      mainActivity.$['android:showWhenLocked'] = 'true';
      mainActivity.$['android:turnScreenOn'] = 'true';
    }

    return config;
  });
}

function withAlarmSoundAsset(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const src = path.join(config.modRequest.projectRoot, 'assets', 'sounds', 'alarm.wav');
      const rawDir = path.join(config.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res', 'raw');
      fs.mkdirSync(rawDir, { recursive: true });
      fs.copyFileSync(src, path.join(rawDir, 'alarm.wav'));
      return config;
    },
  ]);
}

module.exports = function withAlarmAndroidConfig(config) {
  config = withAlarmManifest(config);
  config = withAlarmSoundAsset(config);
  return config;
};
