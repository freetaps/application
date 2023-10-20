customElements.define('page-water-bottle', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button default-href="/" text="Retour"></ion-back-button>
    </ion-buttons>

    <ion-title>Bien laver sa gourde</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <div class="ion-content-safe-area">
    <p>TODO: page Bien laver sa gourde</p>
  </div>
</ion-content>`;
  }
});
