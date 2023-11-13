import Translator from '../i18n/i18n';

customElements.define('page-home', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-menu content-id="home-tabs" id="home-menu" side="end">
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button data-i18n="menu-close" onclick="document.querySelector('#home-menu').close()"></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item disabled>
        <ion-icon aria-hidden="true" name="star" slot="start"></ion-icon>
        <ion-label data-i18n="menu-favorites"></ion-label>
      </ion-item>
      <ion-item disabled>
        <ion-icon aria-hidden="true" name="add" slot="start"></ion-icon>
        <ion-label data-i18n="menu-add"></ion-label>
      </ion-item>
      <ion-item href="#/water-bottle">
        <ion-icon aria-hidden="true" name="water-outline" slot="start"></ion-icon>
        <ion-label data-i18n="menu-water-bottle"></ion-label>
      </ion-item>
      <ion-item href="#/about">
        <ion-icon aria-hidden="true" name="information-circle-outline" slot="start"></ion-icon>
        <ion-label data-i18n="menu-about"></ion-label>
      </ion-item>
    </ion-list>
  </ion-content>

  <menu-footer></menu-footer>
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
      <ion-label data-i18n="tabs-add"></ion-label>
    </ion-tab-button>

    <ion-tab-button disabled>
      <ion-icon aria-hidden="true" name="star"></ion-icon>
      <ion-label data-i18n="tabs-favorites"></ion-label>
    </ion-tab-button>

    <ion-tab-button onclick="document.querySelector('#home-menu').open()">
      <ion-icon aria-hidden="true" name="menu"></ion-icon>
      <ion-label data-i18n="tabs-menu"></ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>`;

    this.$homeTabs = document.querySelector('#home-tabs');
    this.$html = document.documentElement;
    this.$ionRouter = document.querySelector('ion-router');
    this._onLanguageChange = () => Translator.translatePage(this, 'home');

    this._onLanguageChange();
    this.$homeTabs.select('map');
    this.$html.addEventListener('languageChange', this._onLanguageChange);
    this.$ionRouter.addEventListener('ionRouteDidChange', this._initMap);
  }

  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
    this.$ionRouter.removeEventListener('ionRouteDidChange', this._initMap);
  }

  _initMap() {
    const map = L.map('map').fitWorld();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
  }
});
