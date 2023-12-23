const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      align-items: center;
      background: var(--ion-color-base);
      border: 3px solid var(--ion-color-primary);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      opacity: 0.9;
      pointer-events: none;
    }
  </style>

  <slot></slot>
`;

// TODO: improve a11y
customElements.define('component-map-cluster', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true)
    );
  }

  connectedCallback() {
    this.classList.add('ion-color-light');
  }

  /**
   * @param {import('maplibre-gl').MapGeoJSONFeature} feature
   */
  setFeature(feature) {
    const [fontSize, size] = this._computeSizes(feature.properties.point_count);

    this.style.fontSize = `${fontSize}px`;
    this.style.height = `${size}px`;
    this.style.width = `${size}px`;
  }

  _computeSizes(count) {
    if (count >= 1000) {
      return [22, 100];
    }
    if (count >= 100) {
      return [20, 64];
    }
    if (count >= 10) {
      return [18, 48];
    }

    return [16, 36];
  }
});
