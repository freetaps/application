import { Dialog } from '@capacitor/dialog';
import { Geolocation } from '@capacitor/geolocation';
import { isPlatform } from '@ionic/core';
import { openAppSettings, openLocationSettings } from './settings-launcher';
import Translator from '../i18n/i18n';

async function promptSettings() {
  const { value } = await Dialog.confirm(
    Translator.getTranslation('map').geolocationSettingsPrompt
  );

  return value;
}

export async function getCurrentPosition() {
  try {
    if (isPlatform('cordova')) {
      await Geolocation.requestPermissions({ permissions: ['location'] });
    }

    try {
      return await Geolocation.getCurrentPosition();
    } catch (error) {
      if (await promptSettings()) {
        await openAppSettings();
      }
    }
  } catch (error) {
    if (await promptSettings()) {
      await openLocationSettings();
    }
  }

  return null;
}