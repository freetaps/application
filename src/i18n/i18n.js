import { Preferences } from '@capacitor/preferences';
import en from './en.json';
import fr from './fr.json';

const TRANSLATIONS = {
  en,
  fr
};

/**
 * Inspired from https://codeburst.io/translating-your-website-in-pure-javascript-98b9fa4ce427
 */
const Translator = new class {
  setup() {
    Preferences.get({ key: 'language' }).then(({ value }) => this.setLanguage(value));
  }

  setLanguage(lang) {
    const value = lang ?? 'fr';

    document.documentElement.lang = value;
    document.documentElement.dispatchEvent(
      new CustomEvent('languageChange', { detail: value })
    );
    Preferences.set({
      key: 'language',
      value
    });
  }

  translatePage($page, pageName) {
    const lang = document.documentElement.lang;

    $page.querySelectorAll('[data-i18n]').forEach(($element) => {
      const key = $element.dataset.i18n;
      const translation = TRANSLATIONS[lang]?.[pageName]?.[key];

      if (translation) {
        $element.innerHTML = translation;
      } else {
        console.error(`Could not find translation for: ${pageName} ${key}`);
      }
    });

    $page.querySelectorAll('[data-i18n-attr]').forEach(($element) => {
      const attr = $element.dataset.i18nAttr;
      const key = $element.dataset.i18nAttrKey;
      const translation = TRANSLATIONS[lang]?.[pageName]?.[key];

      if (translation) {
        $element.setAttribute(attr, translation);
      } else {
        console.error(`Could not find translation for: ${pageName} ${key}`);
      }
    });
  }
}

export default Translator;
