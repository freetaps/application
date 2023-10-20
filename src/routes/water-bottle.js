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
    <h1>Bien laver sa gourde</h1>
    <p>Comment bien laver sa gourde ?</p>
    <p>3 conseils pour profiter de votre gourde le plus longtemps possible :</p>

    <h2>Un rapide rinçage quotidien</h2>
    <p>Important, surtout pour les amateurs de jus ou de sirop. Rincez bien, puis laissez votre gourde sécher à l’air libre pour éviter qu’elle ne garde une odeur d’humidité.</p>

    <h2>Un passage au lave-vaisselle de temps à autre</h2>
    <p>Vérifiez bien que le matériau de votre gourde supporte le lavage au lave-vaisselle - souvent, la température est de 65°C. Rapprochez-vous du fabricant pour avoir plus d’informations.</p>
    <p>Notez que si votre gourde possède une décoration (sérigraphie, film plastique), il se peut que le lave-vaisselle dégrade progressivement cette décoration.</p>

    <h2>En cas de mauvaises odeurs</h2>
    <p>Remplissez votre gourde à moitié avec de l’eau, et ajoutez une cuillère à café de bicarbonate de soude. Fermez votre gourde, et secouez vigoureusement. Videz, puis rincez plusieurs fois, puis laissez sécher votre gourde.</p>

    <div class="youtube-iframe-wrapper">
      <iframe
        src="https://www.youtube-nocookie.com/embed/YrCS5cGjSaI?si=KMkbQhQC3u7oYPgK"
        title="Vidéo tutorielle de Gobi pour bien laver sa gourde"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</ion-content>`;
  }
});
