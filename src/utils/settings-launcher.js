import { AppLauncher } from '@capacitor/app-launcher';
import { isPlatform } from '@ionic/core';

async function openUrl(url) {
  const canOpenResult = await AppLauncher.canOpenUrl({ url });

  if (canOpenResult.value) {
    return await AppLauncher.openUrl({ url });
  }

  return null;
}

export async function openAppSettings() {
  if (isPlatform('cordova') && isPlatform('android')) {
    // TODO: try to open app settings, android.settings.APPLICATION_SETTINGS should work
    await openUrl('com.android.settings');
  } else if (isPlatform('cordova') && isPlatform('ios')) {
    await openUrl('app-settings:');
  } else {
    console.log('Opening app settings...');
  }
}

/**
 * Inspired from https://stackoverflow.com/a/75661459/13993376
 */
export async function openLocationSettings() {
  if (isPlatform('cordova') && isPlatform('android')) {
    // TODO: try to open location settings, android.settings.LOCATION_SOURCE_SETTINGS should work
    await openUrl('com.android.settings');
  } else if (isPlatform('cordova') && isPlatform('ios')) {
    const prefixes = [
      'App-prefs:',
      'App-prefs:root=',
      'prefs:',
      'prefs:root='
    ];

    for (const prefix of prefixes) {
      const openResult = await openUrl(`${prefix}Privacy&path=LOCATION`);

      if (openResult?.completed) {
        break;
      }
    }
  } else {
    console.log('Opening location settings...');
  }
}
