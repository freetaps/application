import Translator from '../i18n/i18n';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    ion-fab-button {
      --box-shadow: none;
      height: 36px;
      width: 36px;
    }
    ion-fab-button[aria-current] {
      --border-width: 3px;
      --border-style: solid;
      --border-color: var(--ion-color-base);
    }
  </style>

  <ion-fab-button data-i18n-attr="title" data-i18n-attr-key="waterPointButton">
    <ion-icon aria-hidden="true" color="light" name="water" size="small"></ion-icon>
  </ion-fab-button>
`;

// TODO: improve a11y
customElements.define('component-map-water-point', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true)
    );

    this.$button = this.shadowRoot.querySelector('ion-fab-button');
    this.$html = document.documentElement;
  }

  connectedCallback() {
    this._onLanguageChange();
    this.classList.add('ion-color-light');
    this.$button.addEventListener('click', this._onClick);
    this.$html.addEventListener('languageChange', this._onLanguageChange);
  }

  disconnectedCallback() {
    this.$button.removeEventListener('click', this._onClick);
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
  }

  setCurrent(isCurrent) {
    if (isCurrent) {
      this.$button.setAttribute('aria-current', 'location');
    } else {
      this.$button.removeAttribute('aria-current');
    }
  }

  /**
   * @param {import('maplibre-gl').MapGeoJSONFeature} feature
   */
  setFeature(feature) {
    this.feature = feature;
  }

  _onClick = () => {
    this.dispatchEvent(
      new CustomEvent('waterPointClick', { detail: this.feature , composed: true, bubbles: true })
    );
  }

  _onLanguageChange = () => {
    Translator.translateElementAttribute(this.$button, 'home');
  }
});
