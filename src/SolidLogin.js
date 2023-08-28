import {html, css, LitElement} from 'lit';
import {fetch, handleIncomingRedirect, getDefaultSession, login} from '@inrupt/solid-client-authn-browser';


export class SolidLogin extends LitElement {
  static styles = css`
    :host {
      font-family: var(--solid-login-font-family, Helvetica, sans-serif);
    }

    #radios {
      padding-bottom: 10px;
    }

    .hidden {
      display: none;
      visibility: hidden;
    }
  `;

  static properties = {
    selectedOption: {type: String},
    loginCallback: {type: Function},
    loggedInCallback: {
      type: Function
    },
    currentWebId: {type: String, state: true}
  };

  constructor() {
    super();
    this.selectedOption = 'webid';
    this.currentWebId = null;
    console.log(this.loggedInCallback);
    console.log(this.loginCallback);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('load', this._onLoad.bind(this));
  }

  async _onLoad() {
    console.log('On load called');
    await handleIncomingRedirect(
      {
        url: window.location.href,
        restorePreviousSession: true,
      }
    );

    console.log(getDefaultSession().info);
    this.currentWebId = getDefaultSession().info.webId;
    console.log(this.currentWebId);

    if (getDefaultSession().info.isLoggedIn && this.loggedInCallback) {
      console.log('Calling loggedInCallback')
      this.loggedInCallback({fetch, session: getDefaultSession()});
    }
  }

  _clickRadioButton(e) {
    this.selectedOption = e.target.value;
  }

  async _clickLogin() {
    console.log('Login button clicked.');

    if (this.loginCallback) {
      console.log('Using callback');
      this.loginCallback({
        type: this.selectedOption,
        value: this.renderRoot.querySelector(`#${this.selectedOption}`).value
      });
    } else {
      console.log('Use inrupt library');
      let idp;

      if (this.selectedOption === 'idp') {
        idp = this.renderRoot.querySelector(`#${this.selectedOption}`).value;
      }

      // TODO: Query IDP from WebID
      // https://github.com/SolidLabResearch/solid-web-app-template/blob/main/src/js/index.js

      if (idp) {
        await login({
          oidcIssuer: idp,
          redirectUrl: window.location.href
        });
      } else {
        console.log('No IDP. Not logging in.');
      }
    }
  }

  render() {
    return html`
      <div id="radios" class=${this.currentWebId ? 'hidden' : ''}>
        <input type="radio" id="webid-radio" name="webIdorIdp" value="webid"
               ?checked=${this.selectedOption === 'webid'}
               @click="${this._clickRadioButton}"
        >
        <label for="webid-radio">WebID</label>
        <input type="radio" id="idp-radio" name="webIdorIdp" value="idp"
               ?checked=${this.selectedOption === 'idp'}
               @click="${this._clickRadioButton}"
        >
        <label for="idp-radio">Identity Provider</label><br>
      </div>
      <div id="login-form" class=${this.currentWebId ? 'hidden' : ''}>
        <input type="text" id="webid" placeholder="Enter your WebID"
               class=${this.selectedOption === 'webid' ? '' : 'hidden'}>
        <input type="text" id="idp" placeholder="Enter your Identity Provider"
               class=${this.selectedOption === 'idp' ? '' : 'hidden'}>
        <button id="login-btn" @click="${this._clickLogin}">Log in</button>
      </div>
      <div id="welcome" class=${this.currentWebId ? '' : 'hidden'}>
        <p>Logged in with <span>${this.currentWebId}</span></p>
      </div>
    `;
  }
}
