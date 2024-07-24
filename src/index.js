import { SplashScreen } from '@capacitor/splash-screen';
import Translator from './i18n/i18n';

import './components/map';
import './components/map-cluster';
import './components/map-water-point';
import './components/map-with-water-points';
import './components/menu-footer';
import './components/water-point-record';
import './components/work-in-progress';

import './routes/add';
import './routes/add-success';
import './routes/about';
import './routes/favorites';
import './routes/home';
import './routes/report';
import './routes/report-success';
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
