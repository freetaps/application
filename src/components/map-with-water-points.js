import MarkerHandler from '../utils/markers';
import { fetchWaterPoints } from '../utils/water-points';
import { MAP_MAX_ZOOM } from './map';

customElements.define('component-map-with-water-points', class extends HTMLElement {
  /**
   * @type import('maplibre-gl').SourceSpecification
   */
  static sourceOptions = {
    type: 'geojson',
    cluster: true,
    clusterMaxZoom: MAP_MAX_ZOOM - 5,
    clusterRadius: 60
  };

  connectedCallback() {
    this.innerHTML = `
<component-map></component-map>
<ion-progress-bar style="display: none" type="indeterminate"></ion-progress-bar>`;

    this.$mapComponent = this.querySelector('component-map');
    this.$progressBar = this.querySelector('ion-progress-bar');

    this.$mapComponent.addEventListener('load', this._onMapLoad);
  }

  disconnectedCallback() {
    this.$mapComponent.removeEventListener('load', this._onMapLoad);

    if (this.$map) {
      this.$markerHandler.clear();
      this.$map.off('data', this._onData);
    }
  }

  _onMapLoad = async () => {
    this.$progressBar.style.display = 'initial';
    this.$map = this.$mapComponent.$map;
    this.$markerHandler = new MarkerHandler(this.$map);

    const waterPoints = await fetchWaterPoints();

    if (waterPoints) {
      this.$map.on('data', this._onData);
      this.$map.addSource(
        'water-points',
        {
          ...this.constructor.sourceOptions,
          data: waterPoints
        }
      );
      this.$map.addLayer({
        type: 'symbol',
        id: 'water-points',
        source: 'water-points',
        filter: ['!=', 'cluster', true]
      });
    }

    this.$progressBar.style.display = 'none';
  }

  _onData = ({ isSourceLoaded, sourceId }) => {
    if (sourceId === 'water-points' && isSourceLoaded) {
      this.$markerHandler.updateMarkers();
      this.$map.off('data', this._onData);
      this.$map.on('move', this.$markerHandler.updateMarkers);
    }
  };
});
