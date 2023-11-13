import { SplashScreen } from '@capacitor/splash-screen';
import Translator from './i18n/i18n';

import './components/menu-footer';

import './routes/about';
import './routes/home';
import './routes/water-bottle';

Translator.setup();
SplashScreen.hide();
