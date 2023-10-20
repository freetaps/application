customElements.define('page-about', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button default-href="/" text="Retour"></ion-back-button>
    </ion-buttons>

    <ion-title>À propos</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <div class="ion-content-safe-area">
    <p>TODO: page À propos</p>
  </div>
</ion-content>`;
  }
});
