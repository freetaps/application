import Translator from '../i18n/i18n';

customElements.define('page-home', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-content id="home-content" scroll-x="false" scroll-y="false">
  <component-map></component-map>

  <ion-modal initial-breakpoint="1" backdrop-breakpoint="1">
    <component-water-point-record></component-water-point-record>
  </ion-modal>
</ion-content>

<ion-tab-bar>
  <ion-tab-button href="#/add">
    <ion-icon aria-hidden="true" name="add"></ion-icon>
    <ion-label data-i18n="tabs-add"></ion-label>
  </ion-tab-button>

  <ion-tab-button href="#/favorites">
    <ion-icon aria-hidden="true" name="star"></ion-icon>
    <ion-label data-i18n="tabs-favorites"></ion-label>
  </ion-tab-button>

  <ion-tab-button id="home-tabs-menu-button">
    <ion-icon aria-hidden="true" name="menu"></ion-icon>
    <ion-label data-i18n="tabs-menu"></ion-label>
  </ion-tab-button>
</ion-tab-bar>

<ion-menu content-id="home-content" id="home-menu" side="end" swipe-gesture="false">
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button data-i18n="menu-close" id="home-menu-close-button"></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item href="#/favorites">
        <ion-icon aria-hidden="true" name="star" slot="start"></ion-icon>
        <ion-label data-i18n="menu-favorites"></ion-label>
      </ion-item>

      <ion-item href="#/add">
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

  <component-menu-footer></component-menu-footer>
</ion-menu>`;

    this.$html = document.documentElement;
    this.$menu = document.getElementById('home-menu');
    this.$menuCloseButton = document.getElementById('home-menu-close-button');
    this.$menuOpenButton = document.getElementById('home-tabs-menu-button');
    this.$waterPointModal = this.querySelector('ion-modal');
    this.$waterPointModal.breakpoints = [0, 1];
    this.$waterPointModalContent = this.$waterPointModal.querySelector('component-water-point-record');

    this._onLanguageChange();

    this.addEventListener('waterPointClick', this._onWaterPointClick);
    this.$html.addEventListener('languageChange', this._onLanguageChange);
    this.$menuCloseButton.addEventListener('click', this._onMenuClose);
    this.$menuOpenButton.addEventListener('click', this._onMenuOpen);
    this.$waterPointModal.addEventListener('didDismiss', this._onWaterPointModalDismiss);
  }

  disconnectedCallback() {
    this.removeEventListener('waterPointClick', this._onWaterPointClick);
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
    this.$menuCloseButton.removeEventListener('click', this._onMenuClose);
    this.$menuOpenButton.removeEventListener('click', this._onMenuOpen);
    this.$waterPointModal.removeEventListener('didDismiss', this._onWaterPointModalDismiss);
  }

  _onLanguageChange = () => {
    Translator.translatePage(this, 'home');
  }

  _onMenuClose = () => {
    this.$menu.close();
  }

  _onMenuOpen = () => {
    this.$menu.open();
  }

  _onWaterPointClick = (event) => {
    if (this.currentWaterPoint) {
      this.currentWaterPoint.setCurrent(false);
    }

    this.currentWaterPoint = event.target;
    this.$waterPointModal.isOpen = true

    this.currentWaterPoint.setCurrent(true);
    this.$waterPointModalContent.setFeature(event.detail);
  }

  _onWaterPointModalDismiss = () => {
    if (this.currentWaterPoint) {
      this.currentWaterPoint.setCurrent(false);
    }

    this.currentWaterPoint = null;
    this.$waterPointModal.isOpen = false;
  }
});
