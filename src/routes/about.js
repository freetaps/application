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
    <h1>À propos</h1>

    <h2>Conditions d'utilisation</h2>
    <p>L’utilisateur est appelé à exercer son jugement avant de consommer l’eau fournie par les points référencés sur l’application.</p>
    <p>Les informations concernant ces points sont mises à disposition par FreeTaps et la communauté des utilisateurs, mais ne sauraient engager l’association ou ses prestataires. FreeTaps n’apporte aucune garantie quant à l’exactitude de la localisation des points d’eau, leur disponibilité ou la qualité de l’eau fournie.</p>
    <p>Cela est particulièrement à prendre en compte si vous comptez planifier un itinéraire : FreeTaps ne peut garantir ses informations, nous vous invitons à contacter aussi les offices de tourisme ou autres habitants des régions que vous comptez traverser pour vous assurer que des possibilités de trouver de l’eau existent bien sur votre itinéraire.</p>

    <h2>FreeTaps</h2>
    <p>FreeTaps est une association fondée en 2011 dont la mission est de référencer les points d’eau potable sur une application gratuite, collaborative, partout en France, en Europe et dans le monde.</p>
    <p>L’application s’enrichit constamment grâce aux villes et aux particuliers qui ajoutent des données : plus de 17000 points d’eau sont déjà disponibles !</p>
    <p>Si vous êtes une collectivité ou un acteur de l’eau qui voulez référencer des points, contactez-nous !</p>
    <p>FreeTaps a été créé par les fondateurs de Gobi.</p>

    <h2>Gobi</h2>
    <p>Gobi est une entreprise à impact dont la mission est d’accélérer le changement vers le réutilisable. Depuis 2011, Gobi propose des produits designs, éco-conçus et 100% fabriqués en France, alternatives durables aux objets à usage unique - gobelet, couverts, bouteilles jetables.</p>
    <p>Près de 10000 organisations ont déjà adopté nos produits. Grâce à cette communauté, des millions de kg de déchets ont été évités !</p>
    <p>Pour en savoir plus : <a href="https://www.gobilab.com/">www.gobilab.com</a>.</p>
  </div>
</ion-content>`;
  }
});
