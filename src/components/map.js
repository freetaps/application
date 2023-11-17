import { AttributionControl, LngLat, LngLatBounds, Map, Marker, ScaleControl } from 'maplibre-gl';
import Translator from '../i18n/i18n';
import { getCurrentPosition } from '../utils/geolocation';

customElements.define('app-map', class extends HTMLElement {
  $isGeolocationLoading = false;
  $isGeolocationError = false;

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
    <ion-icon aria-hidden="true" color="dark"  size="small" name="navigate"></ion-icon>
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
    this.$observer.disconnect();
    this.$rotationButton.removeEventListener('click', this._onRotationButtonClick);
    this.$geolocationButton.removeEventListener('click', this._onGeolocationButtonClick)
    this.$map.off('rotate', this._updateRotationButton);
    this.$map.off('zoom', this._updateGeolocationAccuracyMarker);
  }

  /**
   * Inspired from https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/control/geolocate_control.ts
   */
  _onGeolocationButtonClick = async () => {
    this.$isGeolocationError = false;
    this.$isGeolocationLoading = true;

    this._updateProgressBar();
    this._updateGeolocationButton();

    const previousPosition = this.$position;
    this.$position = await getCurrentPosition();

    if (this.$position) {
      if (!previousPosition) {
        const circle = document.createElement('div');
        const dot = document.createElement('div');

        circle.className = 'maplibregl-user-location-accuracy-circle';
        dot.className = 'maplibregl-user-location-dot';
        this.$geolocationAccuracyMarker = new Marker({
          element: circle,
          pitchAlignment: 'map'
        });
        this.$geolocationMarker = new Marker({ element: dot });
      }

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

    this.$isGeolocationLoading = false;

    this._updateProgressBar();
    this._updateGeolocationButton();
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
      locale: Translator.getTranslation('map').locale,
      container: this.$mapContainer,
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
    });

    this.$map.addControl(new AttributionControl(), 'top-left');
    this.$map.addControl(new ScaleControl(), 'bottom-left');

    this._updateGeolocationButton();
    this._updateRotationButton();

    this.$map.on('rotate', this._updateRotationButton);
    this.$map.on('zoom', this._updateGeolocationAccuracyMarker);
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
    if (this.$geolocationAccuracyMarker) {
      const element = this.$geolocationAccuracyMarker.getElement();
      const bounds = this.$map.getBounds();
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

  _updateProgressBar() {
    if (this.$isGeolocationLoading) {
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
