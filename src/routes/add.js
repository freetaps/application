import { Dialog } from '@capacitor/dialog';
import { Marker } from 'maplibre-gl';
import Translator from '../i18n/i18n';
import { addWaterPoint } from '../utils/water-points';

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

<ion-content class="ion-padding" scroll-x="false" scroll-y="false">
  <div class="ion-content-safe-area">
    <form id="add-form">
      <ion-checkbox data-i18n="is-private-label" name="is-private"></ion-checkbox>
      <ion-input
        data-i18n-attr="label"
        data-i18n-attr-key="source-label"
        disabled
        label-placement="stacked"
        maxlength="256"
        name="source"
      ></ion-input>
    </form>

    <div class="map-container">
      <component-map is-small></component-map>
    </div>
  </div>

  <ion-progress-bar style="display: none" type="indeterminate"></ion-progress-bar>
</ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-button data-i18n="submit-button" disabled expand="block" form="add-form" type="submit"></ion-button>
  </ion-toolbar>
</ion-footer>`;

    this.$html = document.documentElement;
    this.$form = this.querySelector('form');
    this.$checkbox = this.querySelector('ion-checkbox');
    this.$input = this.querySelector('ion-input');
    this.$mapContainer = this.querySelector('.map-container');
    this.$mapComponent = this.querySelector('component-map');
    this.$progressBar = this.querySelector('ion-progress-bar');
    this.$submitButton = this.querySelector('ion-button');

    this._onLanguageChange();

    this.$html.addEventListener('languageChange', this._onLanguageChange);
    this.$form.addEventListener('submit', this._onSubmit);
    this.$checkbox.addEventListener('ionChange', this._onIsPrivateChange);
    this.$mapComponent.addEventListener('load', this._onMapLoad);
  }

  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
    this.$form.removeEventListener('submit', this._onSubmit);
    this.$checkbox.removeEventListener('ionChange', this._onIsPrivateChange);
    this.$mapComponent.removeEventListener('load', this._onMapLoad);
  }

  _onIsPrivateChange = ({ detail }) => {
    if (detail.checked) {
      this.$input.disabled = false;

      requestAnimationFrame(() => {
        this.$input.setFocus();
      });
    } else {
      this.$input.disabled = true;
    }
  }

  _onLanguageChange = () => {
    this.translation = Translator.getTranslation('add').confirm;

    Translator.translatePage(this, 'add');
  }

  _onMapLoad = () => {
    const marker = new Marker();
    this.$submitButton.disabled = false;

    this.$mapContainer.appendChild(marker.getElement());
  }

  _onSubmit = async (event) => {
    event.preventDefault();

    const { value } = await Dialog.confirm(this.translation);

    if (value) {
      this.$submitButton.disabled = true;
      this.$progressBar.style.display = 'initial';

      const formData = new FormData(event.target);
      const center = this.$mapComponent.$map.getCenter();
      const result = await addWaterPoint({
        isPrivate: formData.get('is-private') === 'on',
        latitude: center.lat,
        longitude: center.lng,
        source: formData.get('source')
      });

      if (result) {
        this.$html.querySelector('ion-router').push('/add-success')
      }

      this.$submitButton.disabled = false;
      this.$progressBar.style.display = 'none';
    }
  }
});
