import Translator from '../i18n/i18n';

customElements.define('app-menu-footer', class extends HTMLElement {
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

    this.$html.addEventListener('languageChange', this._onLanguageChange);
    this.$ionSegment.addEventListener('ionChange', this._onSegmentChange);
  }

  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
    this.$ionSegment.removeEventListener('ionChange', this._onSegmentChange);
  }

  _onLanguageChange = ({ detail }) => {
    this.$ionSegment.setAttribute('value', detail);
  }

  _onSegmentChange = ({ detail }) => {
    Translator.setLanguage(detail.value);
  }
});
