import Translator from '../i18n/i18n';

customElements.define('component-water-point-record', class extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
<div class="ion-content-safe-area">
  <ion-list lines="inset">
    <ion-list-header>
      <h1 class="water-point-title"></h1>
    </ion-list-header>
    <ion-item>
      <ion-icon aria-hidden="true" name="location-outline" slot="start"></ion-icon>
      <ion-label class="water-point-position"></ion-label>
      <ion-button class="water-point-position-link" data-i18n="position-link" slot="end"></ion-button>
    </ion-item>
    <ion-item lines="none">
      <ion-icon aria-hidden="true" name="checkmark" slot="start"></ion-icon>
      <ion-label class="water-point-use"></ion-label>
    </ion-item>
  </ion-list>
</div>`;

    this.$html = document.documentElement;
    this.$positionText = this.querySelector('.water-point-position');
    this.$positionLink = this.querySelector('.water-point-position-link');
    this.$title = this.querySelector('.water-point-title');
    this.$useText = this.querySelector('.water-point-use');
  }

  connectedCallback() {
    this._onLanguageChange();
    this.$html.addEventListener('languageChange', this._onLanguageChange);
  }

  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
  }

  /**
   * @param {import('maplibre-gl').MapGeoJSONFeature} feature
   */
  setFeature(feature) {
    this.feature = feature;

    this._updateText();
  }

  _computeUseText(nbOfUse) {
    if (nbOfUse === 0) {
      return this.translation.use['0'];
    }
    if (nbOfUse === 1) {
      return this.translation.use['1'];
    }

    return `${nbOfUse.toLocaleString()}${this.translation.use.multiple}`;
  }

  _onLanguageChange = () => {
    this.translation = Translator.getTranslation('map').waterPoint;

    this._updateText();
  }

  _updateText = () => {
    if (this.feature) {
      const [longitude, latitude] = this.feature.geometry.coordinates;

      this.$title.innerText = this.feature.properties.type === 'PRIVATE'
        ? this.feature.properties.source
        : this.translation.defaultTitle;
      this.$positionText.innerText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      this.$useText.innerText = this._computeUseText(this.feature.properties.nbOfUse);
      this.$positionLink.href = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    }
  }
});
