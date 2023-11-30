import { AttributionControl, LngLat, LngLatBounds, Map, ScaleControl } from 'maplibre-gl';
import { getCurrentPosition } from '../utils/geolocation';
import { fetchWaterPoints } from '../utils/water-points';
import MarkerHandler from '../utils/markers';
import Translator from '../i18n/i18n';

customElements.define('app-map', class extends HTMLElement {
  /**
   * @type import('maplibre-gl').MapOptions
   */
  static $mapOptions = {
    bounds: [-5.4534286, 41.2632185, 9.8678344, 51.268318], // France
    maxPitch: 0,
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
  };
  /**
   * @type import('maplibre-gl').SourceSpecification
   */
  static $sourceOptions = {
    type: 'geojson',
    cluster: true,
    clusterMaxZoom: this.$mapOptions.maxZoom - 2,
    clusterRadius: 80
  };

  $geolocationAccuracyMarker = MarkerHandler.createGeolocationAccuracyMarker();
  $geolocationMarker = MarkerHandler.createGeolocationMarker();
  $isGeolocationError = false;
  $loading = 0;

  connectedCallback() {
    this.innerHTML = `
<style>
  #map {
    height: 100%;
  }

  #rotation-button {
    margin: 0;
    margin-top: var(--ion-safe-area-top, 0);
  }

  .maplibregl-ctrl-top-left {
    left: var(--ion-safe-area-left, 0);
    top: var(--ion-safe-area-top, 0);
  }
  .maplibregl-ctrl-bottom-left {
    left: var(--ion-safe-area-left, 0);
  }

  ion-progress-bar {
    bottom: 0;
    left: 0;
    position: absolute;
    z-index: 1;
  }
</style>

<ion-fab horizontal="end" vertical="top">
  <ion-fab-button color="light" data-i18n-attr="title" data-i18n-attr-key="mapRotationButton" size="small" id="rotation-button">
    <ion-icon aria-hidden="true" color="dark" size="small" name="navigate"></ion-icon>
  </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
  <ion-fab-button data-i18n-attr="title" data-i18n-attr-key="mapGeolocationButton" id="geolocation-button">
    <ion-icon aria-hidden="true" name="locate"></ion-icon>
  </ion-fab-button>
</ion-fab>

<div id="map"></div>

<ion-progress-bar slot="fixed" type="indeterminate"></ion-progress-bar>`;

    this.$geolocationButton = document.getElementById('geolocation-button');
    this.$geolocationButtonIcon = this.$geolocationButton.querySelector('ion-icon');
    this.$rotationButton = document.getElementById('rotation-button');
    this.$progressBar = this.querySelector('ion-progress-bar');
    this.$mapContainer = document.getElementById('map');
    this.$observer = new ResizeObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.contentRect.height > 0) {
          this._setupMap();
          observer.disconnect();
          break;
        }
      }
    });

    this._updateProgressBar();
    this._updateGeolocationButton();
    this._updateRotationButton();

    this.$observer.observe(this.$mapContainer);
    this.$rotationButton.addEventListener('click', this._onRotationButtonClick);
    this.$geolocationButton.addEventListener('click', this._onGeolocationButtonClick);
  }

  disconnectedCallback() {
    this.$markerHandler.clear();
    this.$observer.disconnect();
    this.$rotationButton.removeEventListener('click', this._onRotationButtonClick);
    this.$geolocationButton.removeEventListener('click', this._onGeolocationButtonClick)
    this.$map.off('data', this._onData);
    this.$map.off('load', this._onMapLoad);
    this.$map.off('move', this.$markerHandler.updateMarkers);
    this.$map.off('rotate', this._updateRotationButton);
    this.$map.off('zoom', this._updateGeolocationAccuracyMarker);
  }

  _onData = ({ isSourceLoaded, sourceId }) => {
    if (sourceId === 'water-points' && isSourceLoaded) {
      this.$markerHandler.updateMarkers();
      this.$map.off('data', this._onData);
      this.$map.on('move', this.$markerHandler.updateMarkers);
    }
  };

  /**
   * Inspired from https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/control/geolocate_control.ts
   */
  _onGeolocationButtonClick = async () => {
    this.$isGeolocationError = false;

    this._updateProgressBar(true);
    this._updateGeolocationButton();

    const previousPosition = this.$position;
    this.$position = await getCurrentPosition();

    if (this.$position) {
      const center = new LngLat(this.$position.coords.longitude, this.$position.coords.latitude);

      this.$geolocationAccuracyMarker.setLngLat(center);
      this.$geolocationMarker.setLngLat(center);

      if (!previousPosition) {
        this.$geolocationAccuracyMarker.addTo(this.$map);
        this.$geolocationMarker.addTo(this.$map);
      }

      this._updateGeolocationAccuracyMarker();
      this._updateCamera(previousPosition);
    } else {
      this.$isGeolocationError = true;

      if (previousPosition) {
        this.$geolocationAccuracyMarker.remove();
        this.$geolocationMarker.remove();
      }
    }

    this._updateProgressBar(false);
    this._updateGeolocationButton();
  }

  _onMapLoad = async () => {
    this._updateGeolocationButton();
    this._updateRotationButton();

    this.$map.on('rotate', this._updateRotationButton);
    this.$map.on('zoom', this._updateGeolocationAccuracyMarker);

    this._updateProgressBar(true);

    const waterPoints = await fetchWaterPoints();

    this._updateProgressBar(false);

    if (waterPoints) {
      this.$map.on('data', this._onData);
      this.$map.addSource(
        'water-points',
        {
          ...this.constructor.$sourceOptions,
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
  }

  _onRotationButtonClick = () => {
    this.$map.rotateTo(0);
  }

  /**
   * The map should be properly setup in theses cases:
   * - initial load of home (all platforms)
   * - initial load of home > navigate to another page > navigate home (all platforms)
   * - initial load of another page > navigate home (web)
   */
  _setupMap() {
    this.$map = new Map({
      ...this.constructor.$mapOptions,
      container: this.$mapContainer,
      locale: Translator.getTranslation('map').locale
    });
    this.$markerHandler = new MarkerHandler(this.$map);

    this.$map.on('load', this._onMapLoad);
    this.$map.addControl(new AttributionControl(), 'top-left');
    this.$map.addControl(new ScaleControl(), 'bottom-left');
  }

  _updateCamera(previousPosition) {
    const isOutOfView = !this.$map.getBounds().contains(
      new LngLat(this.$position.coords.longitude, this.$position.coords.latitude)
    );

    if (!previousPosition || isOutOfView) {
      this.$map.fitBounds(
        LngLatBounds.fromLngLat(
          new LngLat(this.$position.coords.longitude, this.$position.coords.latitude),
          this.$position.coords.accuracy
        ),
        {
          bearing: this.$map.getBearing(),
          maxZoom: 12,
          speed: 4
        }
      );
    }
  };

  _updateGeolocationAccuracyMarker = () => {
    if (this.$position) {
      const bounds = this.$map.getBounds();
      const element = this.$geolocationAccuracyMarker.getElement();
      const mapHeightInMeters = bounds.getSouthEast().distanceTo(bounds.getNorthEast());
      const mapHeightInPixels = this.$mapContainer.clientHeight;
      const circleDiameterInPixels = Math.ceil(2 * (this.$position.coords.accuracy / (mapHeightInMeters / mapHeightInPixels)));

      element.style.width = `${circleDiameterInPixels}px`;
      element.style.height = `${circleDiameterInPixels}px`;
    }
  }

  _updateGeolocationButton() {
    if (this.$isGeolocationLoading) {
      this.$geolocationButton.setAttribute('disabled', '');
    } else if (this.$isGeolocationError) {
      this.$progressBar.style.display = 'none';
      this.$geolocationButton.removeAttribute('disabled');
      this.$geolocationButton.setAttribute('color', 'light');
      this.$geolocationButtonIcon.setAttribute('color', 'danger');
    } else {
      this.$geolocationButton.setAttribute('color', 'primary');
      this.$geolocationButtonIcon.setAttribute('color', 'light');

      if (this.$map) {
        this.$geolocationButton.removeAttribute('disabled');
      } else {
        this.$geolocationButton.setAttribute('disabled', '');
      }
    }
  }

  _updateProgressBar(isLoading) {
    if (isLoading === true) {
      this.$loading++;
    } else if (isLoading === false) {
      this.$loading--;
    }

    if (this.$loading > 0) {
      this.$progressBar.style.display = 'initial';
    } else {
      this.$progressBar.style.display = 'none';
    }
  }

  _updateRotationButton = () => {
    const rotation = this.$map?.getBearing() ?? 0;

    this.$rotationButton.style.transform = `rotate(${-rotation - 45}deg)`;

    if (this.$map) {
      this.$rotationButton.removeAttribute('disabled');
    } else {
      this.$rotationButton.setAttribute('disabled', '');
    }
  }
});
