import Translator from '../i18n/i18n';

customElements.define('page-about', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button data-i18n-attr="text" data-i18n-attr-key="header-back" default-href="/"></ion-back-button>
    </ion-buttons>

    <ion-title data-i18n="header-title"></ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <div class="ion-content-safe-area">
    <h1 data-i18n="title"></h1>

    <h2 data-i18n="terms-title"></h2>
    <p data-i18n="terms-text-1"></p>
    <p data-i18n="terms-text-2"></p>
    <p data-i18n="terms-text-3"></p>

    <h2 data-i18n="freetaps-title"></h2>
    <p data-i18n="freetaps-text-1"></p>
    <p data-i18n="freetaps-text-2"></p>
    <p data-i18n="freetaps-text-3"></p>
    <p data-i18n="freetaps-text-4"></p>

    <h2 data-i18n="gobi-title"></h2>
    <p data-i18n="gobi-text-1"></p>
    <p data-i18n="gobi-text-2"></p>
    <p data-i18n="gobi-text-3"></p>
  </div>
</ion-content>`;

    this.$html = document.documentElement;

    this._onLanguageChange();

    this.$html.addEventListener('languageChange', this._onLanguageChange);
  }

  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
  }

  _onLanguageChange = () => {
    Translator.translatePage(this, 'about');
  }
});
