customElements.define('page-home', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-menu content-id="home-tabs" id="home-menu" side="end">
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button onclick="document.querySelector('#home-menu').close()">Fermer</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item disabled>
        <ion-icon aria-hidden="true" name="star" slot="start"></ion-icon>
        <ion-label>Favoris</ion-label>
      </ion-item>
      <ion-item disabled>
        <ion-icon aria-hidden="true" name="add" slot="start"></ion-icon>
        <ion-label>Ajouter un point</ion-label>
      </ion-item>
      <ion-item href="#/water-bottle">
        <ion-icon aria-hidden="true" name="water-outline" slot="start"></ion-icon>
        <ion-label>Bien laver sa gourde</ion-label>
      </ion-item>
      <ion-item href="#/about">
        <ion-icon aria-hidden="true" name="information-circle-outline" slot="start"></ion-icon>
        <ion-label>À propos</ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</ion-menu>

<ion-tabs id="home-tabs">
  <ion-tab tab="map">
    <ion-content>
      <div id="map"></div>
    </ion-content>
  </ion-tab>

  <ion-tab-bar slot="bottom">
    <ion-tab-button disabled>
      <ion-icon aria-hidden="true" name="add"></ion-icon>
      <ion-label>Ajouter un point</ion-label>
    </ion-tab-button>

    <ion-tab-button disabled>
      <ion-icon aria-hidden="true" name="star"></ion-icon>
      <ion-label>Favoris</ion-label>
    </ion-tab-button>

    <ion-tab-button onclick="document.querySelector('#home-menu').open()">
      <ion-icon aria-hidden="true" name="menu"></ion-icon>
      <ion-label>Menu</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>`;

    document.querySelector('#home-tabs').select('map');
    document.querySelector('ion-router').addEventListener('ionRouteDidChange', this.initMap);
  }

  disconnectedCallback() {
    document.querySelector('ion-router').removeEventListener('ionRouteDidChange', this.initMap);
  }

  initMap() {
    const map = L.map('map').fitWorld();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
  }
});
