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

    this.translation = Translator.getTranslation('map').waterPoint;
    this.$positionText = this.querySelector('.water-point-position');
    this.$positionLink = this.querySelector('.water-point-position-link');
    this.$title = this.querySelector('.water-point-title');
    this.$useText = this.querySelector('.water-point-use');
  }

  /**
   * @param {import('maplibre-gl').MapGeoJSONFeature} feature
   */
  setFeature(feature) {
    const [longitude, latitude] = feature.geometry.coordinates;

    this.$title.innerText = feature.properties.type === 'PRIVATE'
      ? feature.properties.source
      : this.translation.defaultTitle;
    this.$positionText.innerText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    this.$useText.innerText = this._computeUseText(feature.properties.nbOfUse);
    this.$positionLink.href = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
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
});
