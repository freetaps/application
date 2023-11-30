const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      align-items: center;
      background: var(--ion-color-primary);
      border-radius: 50%;
      display: flex;
      height: 30px;
      justify-content: center;
      pointer-events: none;
      width: 30px;
    }

    ion-icon {
      font-size: 1.2rem;
    }
  </style>

  <ion-icon aria-hidden="true" color="light" name="water"></ion-icon>
`;

// TODO: improve a11y
customElements.define('app-map-water-point', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true)
    );
  }
});
