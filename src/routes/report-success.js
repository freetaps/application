import Translator from '../i18n/i18n';

customElements.define('page-report-success', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title data-i18n="header-title"></ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <div class="ion-content-safe-area">
    <ion-icon aria-hidden="true" color="medium" name="alert-circle-outline"></ion-icon>
    <h1 data-i18n="title"></h1>
    <p data-i18n="text"></p>
    <ion-button data-i18n="home-link" href="#/"></ion-button>
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
    Translator.translatePage(this, 'report-success');
  }
});
