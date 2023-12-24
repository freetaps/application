import Translator from '../i18n/i18n';

customElements.define('page-add', class extends HTMLElement {
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
    <component-work-in-progress></component-work-in-progress>
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
    Translator.translatePage(this, 'add');
  }
});
