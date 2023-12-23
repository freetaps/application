import { Marker } from 'maplibre-gl';

/**
 * Inspired from https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/
 */
export default class MarkerHandler {
  isAnimating = false;
  /**
   * @type {{ [markerId: string]: import('maplibre-gl').Marker }}
   */
  markersCache = { };
  /**
   * @type {{ [markerId: string]: import('maplibre-gl').Marker }}
   */
  markersOnScreen = { };

  /**
   * @param {import('maplibre-gl').Map} map
   */
  constructor(map) {
    this.$map = map;
  }

  static createGeolocationAccuracyMarker() {
    const $element = document.createElement('div');

    $element.className = 'maplibregl-user-location-accuracy-circle';

    return new Marker({ element: $element });
  }

  static createGeolocationMarker() {
    const $element = document.createElement('div');

    $element.className = 'maplibregl-user-location-dot';

    return new Marker({ element: $element });
  }

  clear() {
    cancelAnimationFrame(this.animationHandle);
  }

  updateMarkers = () => {
    if (this.isAnimating) {
      return
    }

    this.isAnimating = true;
    this.animationHandle = requestAnimationFrame(() => {
      this._updateMarkers();
      this.isAnimating = false;
    });
  }

  _updateMarkers = () => {
    const features = this.$map.querySourceFeatures('water-points');
    const previousMarkersOnScreen = this.markersOnScreen;
    const nextMarkersOnScreen = { };

    for (const feature of features) {
      const markerId = feature.properties.cluster
        ? `cluster-${feature.properties.cluster_id}`
        : `water-point-${feature.properties.id}`;
      const $marker = this._createMarker(markerId, feature);

      nextMarkersOnScreen[markerId] = $marker;

      // Add marker on map if it was not on screen
      if (!previousMarkersOnScreen[markerId]) {
        $marker.addTo(this.$map);
      }
    }

    // Remove from map markers that are not on screen anymore
    for (const markerId in previousMarkersOnScreen) {
      if (!nextMarkersOnScreen[markerId]) previousMarkersOnScreen[markerId].remove();
    }

    this.markersOnScreen = nextMarkersOnScreen;
  }

  _createClusterElement(feature) {
    const $element = document.createElement('component-map-cluster');

    $element.setFeature(feature);
    $element.innerHTML = `<ion-text color="dark"><strong>${feature.properties.point_count.toLocaleString()}</strong></ion-text>`;

    return $element;
  }

  /**
   * 
   * @param {string} markerId
   * @param {import('maplibre-gl').MapGeoJSONFeature} feature
   * @returns {import('maplibre-gl').Marker}
   */
  _createMarker(markerId, feature) {
    if (this.markersCache[markerId]) {
      return this.markersCache[markerId];
    }

    const $element = feature.properties.cluster
      ? this._createClusterElement(feature)
      : this._createWaterPointElement(feature);

    return this.markersCache[markerId] = new Marker({ element: $element }).setLngLat(feature.geometry.coordinates);
  }

  _createWaterPointElement(feature) {
    const $element = document.createElement('component-map-water-point');

    $element.setFeature(feature);

    return $element;
  }
}
