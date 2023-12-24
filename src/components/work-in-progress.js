customElements.define('component-work-in-progress', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-icon aria-hidden="true" color="medium" name="construct"></ion-icon>
<h1 data-i18n="title"></h1>
<p data-i18n="text"></p>
<ion-button data-i18n="home-link" href="#/"></ion-button>`;
  }
});
