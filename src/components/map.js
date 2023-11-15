import { AttributionControl, Map, ScaleControl } from 'maplibre-gl';
import Translator from '../i18n/i18n';

customElements.define('app-map', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<style>
  .map {
    height: 100%;
  }

  .maplibregl-ctrl-bottom-left {
    left: var(--ion-safe-area-left, 0);
  }
  .maplibregl-ctrl-bottom-right {
    right: var(--ion-safe-area-right, 0);
  }
</style>

<div class="map"></div>`;

    this.$mapContainer = this.querySelector('.map');
    this.$observer = new ResizeObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.contentRect.height > 0) {
          this._setup();
          observer.disconnect();
          break;
        }
      }
    });

    this.$observer.observe(this.$mapContainer);
  }

  disconnectedCallback() {
    this.$observer.disconnect();
  }

  /**
   * The map should be properly setup in theses cases:
   * - initial load of home (all platforms)
   * - initial load of home > navigate to another page > navigate home (all platforms)
   * - initial load of another page > navigate home (web)
   */
  _setup() {
    this.$map = new Map({
      locale: Translator.getTranslation('map'),
      container: this.$mapContainer,
      bounds: [-5.4534286, 41.2632185, 9.8678344, 51.268318], // France
      maxZoom: 20,
      attributionControl: false,
      style: {
        version: 8,
        layers: [{
          id: 'osm',
          source: 'osm',
          type: 'raster'
        }],
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            // As advised in https://osmfoundation.org/wiki/Licence/Attribution_Guidelines
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        }
      }
    });

    this.$map.addControl(new ScaleControl(), 'bottom-left');
    this.$map.addControl(new AttributionControl(), 'bottom-right');
  }
});
