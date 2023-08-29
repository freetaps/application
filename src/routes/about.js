customElements.define('page-about', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button default-href="/"></ion-back-button>
    </ion-buttons>

    <ion-title>À propos</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <p>TODO: page À propos</p>
</ion-content>`;
  }
});
