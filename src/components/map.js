import { AttributionControl, LngLat, LngLatBounds, Map, ScaleControl } from 'maplibre-gl';
import { getCurrentPosition, hasGeolocationPermission } from '../utils/geolocation';
import MarkerHandler from '../utils/markers';
import Translator from '../i18n/i18n';

export const MAP_MAX_ZOOM = 20;

customElements.define('component-map', class extends HTMLElement {
  /**
   * @type import('maplibre-gl').MapOptions
   */
  static mapOptions = {
    bounds: [-5.4534286, 41.2632185, 9.8678344, 51.268318], // France
    maxPitch: 0,
    maxZoom: MAP_MAX_ZOOM,
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

  $geolocationAccuracyMarker = MarkerHandler.createGeolocationAccuracyMarker();
  $geolocationMarker = MarkerHandler.createGeolocationMarker();
  loading = 0;

  connectedCallback() {
    this.innerHTML = `
<ion-fab horizontal="end" vertical="top">
  <ion-fab-button color="light" data-i18n-attr="title" data-i18n-attr-key="mapRotationButton" size="small" class="rotation-button">
    <ion-icon aria-hidden="true" color="dark" size="small" name="navigate"></ion-icon>
  </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
  <ion-fab-button data-i18n-attr="title" data-i18n-attr-key="mapGeolocationButton" class="geolocation-button">
    <ion-icon aria-hidden="true" name="locate"></ion-icon>
  </ion-fab-button>
</ion-fab>

<div class="map"></div>`;

    this.$geolocationButton = this.querySelector('.geolocation-button');
    this.$geolocationButtonIcon = this.$geolocationButton.querySelector('ion-icon');
    this.$rotationButton = this.querySelector('.rotation-button');
    this.$mapContainer = this.querySelector('.map');
    this.observer = new ResizeObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.contentRect.height > 0) {
          this._setupMap();
          observer.disconnect();
          break;
        }
      }
    });

    this._updateGeolocationButton(false);
    this._updateRotationButton();

    if (this.getAttribute('is-small') != null) {
      this.$geolocationButton.setAttribute('size', 'small');
      this.$geolocationButtonIcon.setAttribute('size', 'small');
    }

    this.observer.observe(this.$mapContainer);
    this.$rotationButton.addEventListener('click', this._onRotationButtonClick);
    this.$geolocationButton.addEventListener('click', this._geolocate);
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.$rotationButton.removeEventListener('click', this._onRotationButtonClick);
    this.$geolocationButton.removeEventListener('click', this._geolocate)
    this.$map.off('load', this._onMapLoad);
    this.$map.off('rotate', this._updateRotationButton);
    this.$map.off('zoom', this._updateGeolocationAccuracyMarker);
  }

  /**
   * Inspired from https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/control/geolocate_control.ts
   */
  _geolocate = async () => {
    this._updateGeolocationButton(true);

    const previousPosition = this.position;
    this.position = await getCurrentPosition();

    if (this.position) {
      const center = new LngLat(this.position.coords.longitude, this.position.coords.latitude);

      this.$geolocationAccuracyMarker.setLngLat(center);
      this.$geolocationMarker.setLngLat(center);

      if (!previousPosition) {
        this.$geolocationAccuracyMarker.addTo(this.$map);
        this.$geolocationMarker.addTo(this.$map);
      }

      this._updateGeolocationAccuracyMarker();
      this._updateCamera();
    } else if (previousPosition) {
      this.$geolocationAccuracyMarker.remove();
      this.$geolocationMarker.remove();
    }

    this._updateGeolocationButton(false);
  }

  _onMapLoad = async () => {
    this._updateGeolocationButton(false);
    this._updateRotationButton();

    this.$map.on('rotate', this._updateRotationButton);
    this.$map.on('zoom', this._updateGeolocationAccuracyMarker);

    if (await hasGeolocationPermission()) {
      this._geolocate();
    }

    this.dispatchEvent(new CustomEvent('load'));
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
      ...this.constructor.mapOptions,
      container: this.$mapContainer,
      locale: Translator.getTranslation('map').locale
    });

    this.$map.on('load', this._onMapLoad);
    this.$map.addControl(new AttributionControl(), 'top-left');
    this.$map.addControl(new ScaleControl(), 'bottom-left');
  }

  _updateCamera() {
    this.$map.fitBounds(
      LngLatBounds.fromLngLat(
        new LngLat(this.position.coords.longitude, this.position.coords.latitude),
        this.position.coords.accuracy
      ),
      {
        bearing: this.$map.getBearing(),
        speed: 4,
        zoom: 12
      }
    );
  };

  _updateGeolocationAccuracyMarker = () => {
    if (this.position) {
      const bounds = this.$map.getBounds();
      const element = this.$geolocationAccuracyMarker.getElement();
      const mapHeightInMeters = bounds.getSouthEast().distanceTo(bounds.getNorthEast());
      const mapHeightInPixels = this.$mapContainer.clientHeight;
      const circleDiameterInPixels = Math.ceil(2 * (this.position.coords.accuracy / (mapHeightInMeters / mapHeightInPixels)));

      element.style.width = `${circleDiameterInPixels}px`;
      element.style.height = `${circleDiameterInPixels}px`;
    }
  }

  _updateGeolocationButton(isGeolocationLoading) {
    if (isGeolocationLoading) {
      this.$geolocationButton.setAttribute('disabled', '');
    } else {
      if (this.$map) {
        this.$geolocationButton.removeAttribute('disabled');
      } else {
        this.$geolocationButton.setAttribute('disabled', '');
      }
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
