import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import config from '../../dist/config.json';
import Translator from '../i18n/i18n';

async function alertError(message) {
  const translation = Translator.getTranslation('map').waterPoints;

  return Dialog.alert({
    message: `${translation.fetchErrorMessage}${message}`,
    title: translation.fetchErrorTitle
  });
}

// TODO: handle offline with @ionic/storage
export async function fetchWaterPoints() {
  const { identifier } = await Device.getId();
  const token = btoa(`${identifier}:${config.API_KEY}`);

  try {
    const response = await fetch(
      'https://api.freetaps.earth/waterpoints?format=geojson',
      {
        headers: { Authorization: `Basic ${token}` }
      }
    );

    if (response.ok) {
      return response.json();
    }
    console.log(response);
    await alertError(response?.statusText);
  } catch (error) {
    console.log(error);
    await alertError(error);
  }

  return null;
}
