import Translator from '../i18n/i18n';

customElements.define('menu-footer', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-footer>
  <ion-toolbar>
    <ion-segment value="${document.documentElement.lang}">
      <ion-segment-button lang="fr" value="fr">
        <ion-label><span aria-hidden="true">🇫🇷 </span>Français</ion-label>
      </ion-segment-button>

      <ion-segment-button lang="en" value="en">
        <ion-label><span aria-hidden="true">🇬🇧 </span>English</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-footer>
</ion-toolbar>`;

    this.$html = document.documentElement;
    this.$ionSegment = this.querySelector('ion-segment');
    this._onLanguageChange = ({ detail }) => {
      this.$ionSegment.setAttribute('value', detail);
    };

    this.$html.addEventListener('languageChange', this._onLanguageChange);
    this.$ionSegment.addEventListener('ionChange', this._onIonChange);
  }
  
  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
    this.$ionSegment.removeEventListener('ionChange', this._onIonChange);
  }

  _onIonChange({ detail }) {
    Translator.setLanguage(detail.value);
  }
});
