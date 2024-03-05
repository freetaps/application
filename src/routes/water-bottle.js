import Translator from '../i18n/i18n';

customElements.define('page-water-bottle', class extends HTMLElement {
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
    <p data-i18n="introduction-text"></p>

    <h2 data-i18n="step-1-title"></h2>
    <p data-i18n="step-1-text"></p>

    <h2 data-i18n="step-2-title"></h2>
    <p data-i18n="step-2-text-1"></p>
    <p data-i18n="step-2-text-2"></p>

    <h2 data-i18n="step-3-title"></h2>
    <p data-i18n="step-3-text"></p>

    <div class="youtube-iframe-wrapper">
      <iframe
        data-i18n-attr="title"
        data-i18n-attr-key="video-title"
        src="https://www.youtube-nocookie.com/embed/YrCS5cGjSaI?si=KMkbQhQC3u7oYPgK"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
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
    Translator.translatePage(this, 'water-bottle');
  }
});
