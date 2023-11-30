import { Marker } from 'maplibre-gl';

/**
 * Inspired from https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/
 */
export default class MarkerHandler {
  $isAnimating = false;
  /**
   * @type {{ [markerId: string]: import('maplibre-gl').Marker }}
   */
  $markersCache = { };
  /**
   * @type {{ [markerId: string]: import('maplibre-gl').Marker }}
   */
  $markersOnScreen = { };

  /**
   * @param {import('maplibre-gl').Map} map
   */
  constructor(map) {
    this.$map = map;
  }

  static createGeolocationAccuracyMarker() {
    const element = document.createElement('div');

    element.className = 'maplibregl-user-location-accuracy-circle';

    return new Marker({ element });
  }

  static createGeolocationMarker() {
    const element = document.createElement('div');

    element.className = 'maplibregl-user-location-dot';

    return new Marker({ element });
  }

  clear() {
    cancelAnimationFrame(this.$animationHandle);
  }

  updateMarkers = () => {
    if (this.$isAnimating) {
      return
    }

    this.$isAnimating = true;
    this.$animationHandle = requestAnimationFrame(() => {
      this._updateMarkers();
      this.$isAnimating = false;
    });
  }

  _updateMarkers = () => {
    const features = this.$map.querySourceFeatures('water-points');
    const previousMarkersOnScreen = this.$markersOnScreen;
    const nextMarkersOnScreen = { };

    for (const feature of features) {
      const id = feature.properties.cluster
        ? feature.properties.cluster_id
        : feature.properties.id;
      const markerId = feature.properties.cluster
        ? `cluster-${id}`
        : `water-point-${id}`;
      const marker = this._createMarker(markerId, feature);

      nextMarkersOnScreen[markerId] = marker;

      // Add marker on map if it was not on screen
      if (!previousMarkersOnScreen[markerId]) {
        marker.addTo(this.$map);
      }
    }

    // Remove from map markers that are not on screen anymore
    for (const markerId in previousMarkersOnScreen) {
      if (!nextMarkersOnScreen[markerId]) previousMarkersOnScreen[markerId].remove();
    }

    this.$markersOnScreen = nextMarkersOnScreen;
  }

  _createClusterElement(count) {
    const element = document.createElement('app-map-cluster');

    element.setAttribute('count', count);
    element.innerHTML = `<ion-text color="dark"><strong>${count.toLocaleString()}</strong></ion-text>`;

    return element;
  }

  /**
   * 
   * @param {string} markerId
   * @param {import('maplibre-gl').MapGeoJSONFeature} feature
   * @returns {import('maplibre-gl').Marker}
   */
  _createMarker(markerId, { geometry, properties }) {
    if (this.$markersCache[markerId]) {
      return this.$markersCache[markerId];
    }

    const element = properties.cluster
      ? this._createClusterElement(properties.point_count)
      : this._createWaterPointElement();

    return this.$markersCache[markerId] = new Marker({ element }).setLngLat(geometry.coordinates);
  }

  _createWaterPointElement() {
    return document.createElement('app-map-water-point');
  }
}
