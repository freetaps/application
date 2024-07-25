import { isPlatform } from '@ionic/core';
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
    <ion-item lines="none">
      <ion-buttons slot="start">
        <ion-button class="water-point-link" color="primary" fill="solid">
          <ion-icon aria-hidden="true" name="map" slot="start"></ion-icon>
          <span data-i18n="position-link"></span>
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item>
      <ion-icon aria-hidden="true" name="location-outline" slot="start"></ion-icon>
      <ion-label class="water-point-position"></ion-label>
    </ion-item>
    <ion-item lines="none">
      <ion-icon aria-hidden="true" name="checkmark" slot="start"></ion-icon>
      <ion-label class="water-point-use"></ion-label>
    </ion-item>
    <ion-item lines="none">
      <ion-button class="water-point-report-link" color="danger" fill="clear">
        <ion-icon aria-hidden="true" name="alert-circle-outline" slot="start"></ion-icon>
        <span data-i18n="report-link"></span>
      </ion-button>
    </ion-item>
  </ion-list>
</div>`;

    this.$html = document.documentElement;
    this.$link = this.querySelector('.water-point-link');
    this.$positionText = this.querySelector('.water-point-position');
    this.$reportLink = this.querySelector('.water-point-report-link');
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
      this.$reportLink.href = `/report/${this.feature.properties.id}`;

      if (isPlatform('cordova') && isPlatform('android')) {
        this.$link.href = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
      } else if (isPlatform('cordova') && isPlatform('ios')) {
        this.$link.href = `maps://?q=${latitude},${longitude}`;
      }
    }
  }
});
