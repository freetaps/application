import { Dialog } from '@capacitor/dialog';
import Translator from '../i18n/i18n';
import { reportWaterPoint } from '../utils/water-points';

customElements.define('page-report', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button data-i18n-attr="text" data-i18n-attr-key="header-back" default-href="/"></ion-back-button>
    </ion-buttons>

    <ion-title data-i18n="header-title"></ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form id="report-form">
    <ion-list lines="none">
      <ion-radio-group name="reason" data-i18n-attr="value" data-i18n-attr-key="reason-nonexistent-label">
        <ion-item>
          <ion-radio
            data-i18n="reason-nonexistent-label"
            data-i18n-attr="value"
            data-i18n-attr-key="reason-nonexistent-label"
            justify="space-between"
          ></ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio
            data-i18n="reason-closed-label"
            data-i18n-attr="value"
            data-i18n-attr-key="reason-closed-label"
            justify="space-between"
          ></ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio
            data-i18n="reason-inaccessible-label"
            data-i18n-attr="value"
            data-i18n-attr-key="reason-inaccessible-label"
            justify="space-between"
          ></ion-radio>
        </ion-item>
        <ion-item lines="full">
          <ion-radio
            data-i18n="reason-other-label"
            data-i18n-attr="value"
            data-i18n-attr-key="reason-other-label"
            justify="space-between"
          ></ion-radio>
        </ion-item>
      </ion-radio-group>

      <ion-item>
        <ion-textarea
          auto-grow="true"
          counter="true"
          data-i18n-attr="label"
          data-i18n-attr-key="comment-label"
          label-placement="floating"
          maxlength="256"
          name="comment"
        ></ion-textarea>
      </ion-item>
    </ion-list>
  </form>

  <ion-progress-bar style="display: none" type="indeterminate"></ion-progress-bar>
</ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-button data-i18n="submit-button" expand="block" form="report-form" type="submit"></ion-button>
  </ion-toolbar>
</ion-footer>`;

    this.$html = document.documentElement;
    this.$form = this.querySelector('form');
    this.$radioGroup = this.querySelector('ion-radio-group');
    this.$textarea = this.querySelector('ion-textarea');
    this.$progressBar = this.querySelector('ion-progress-bar');
    this.$submitButton = this.querySelector('ion-button');

    this._onLanguageChange();

    this.$html.addEventListener('languageChange', this._onLanguageChange);
    this.$form.addEventListener('submit', this._onSubmit);
  }

  disconnectedCallback() {
    this.$html.removeEventListener('languageChange', this._onLanguageChange);
    this.$form.removeEventListener('submit', this._onSubmit);
  }

  _onLanguageChange = () => {
    this.translation = Translator.getTranslation('report').confirm;

    Translator.translatePage(this, 'report');
  }

  _onSubmit = async (event) => {
    event.preventDefault();

    const { value } = await Dialog.confirm(this.translation);

    if (value) {
      this.$submitButton.disabled = true;
      this.$progressBar.style.display = 'initial';
      
      const formData = new FormData(event.target);
      const reason = formData.get('comment') ?
        `${formData.get('reason')}\r\n${formData.get('comment')}` :
        formData.get('reason');
      const result = await reportWaterPoint({
        id: location.hash.split('/').reverse()[0],
        reason
      });

      if (result) {
        this.$html.querySelector('ion-router').push('/report-success');
      }

      this.$submitButton.disabled = false;
      this.$progressBar.style.display = 'none';
    }
  }
});
