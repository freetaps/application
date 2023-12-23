import { SplashScreen } from '@capacitor/splash-screen';
import Translator from './i18n/i18n';

import './components/map';
import './components/map-cluster';
import './components/map-water-point';
import './components/menu-footer';
import './components/water-point-record';

import './routes/about';
import './routes/home';
import './routes/water-bottle';

Translator.setup();

window.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.target.classList.contains('hydrated')) {
        SplashScreen.hide();
        observer.disconnect();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});
