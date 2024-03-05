import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import config from '../../dist/config.json';
import Translator from '../i18n/i18n';

async function alertError(message) {
  const translation = Translator.getTranslation('map').waterPoints;

  return Dialog.alert({
    message: `${translation.errorMessage}${message}`,
    title: translation.errorTitle
  });
}

async function getInfo() {
  const { identifier } = await Device.getId();
  const id = identifier.replace(/-/g, '').substring(0, 32);

  return {
    id,
    token: btoa(`${id}:${config.API_KEY}`)
  };
}

export async function addWaterPoint({latitude, longitude, isPrivate, source}) {
  const { id, token } = await getInfo();
  const computedSource = isPrivate ? source : id;

  try {
    const response = await fetch(
      `https://api.freetaps.earth/waterpoints/${latitude}/${longitude}/${encodeURIComponent(computedSource)}/${isPrivate}`,
      {
        headers: { Authorization: `Basic ${token}` },
        method: 'POST'
      }
    );

    if (response.ok) {
      return response.json();
    }

    await alertError(response?.statusText);
  } catch (error) {
    await alertError(error);
  }

  return null;
}

// TODO: handle offline with @ionic/storage
export async function fetchWaterPoints() {
  const { token } = await getInfo();

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

    await alertError(response?.statusText);
  } catch (error) {
    await alertError(error);
  }

  return null;
}
