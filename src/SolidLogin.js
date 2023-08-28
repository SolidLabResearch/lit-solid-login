import {html, css, LitElement} from 'lit';
import {fetch, handleIncomingRedirect, getDefaultSession, login} from '@inrupt/solid-client-authn-browser';
import {QueryEngine} from "@comunica/query-sparql";

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

      const result = this.renderRoot.querySelector(`#${this.selectedOption}`).reportValidity();
      if (!result) {
        return;
      }

      if (this.selectedOption === 'idp') {
        idp = this.renderRoot.querySelector(`#${this.selectedOption}`).value;
      } else {
        idp = await this._getOidcIssuerFromWebID(this.renderRoot.querySelector(`#${this.selectedOption}`).value);
      }

      if (idp) {
        console.log('Using IDP ', idp);
        await login({
          oidcIssuer: idp,
          redirectUrl: window.location.href
        });
      } else {
        console.log('No IDP. Not logging in.');
      }
    }
  }

  async _getOidcIssuerFromWebID(webId) {
    const myEngine = new QueryEngine();
    const bindingsStream = await myEngine.queryBindings(`
  PREFIX solid: <http://www.w3.org/ns/solid/terms#>
  SELECT ?oidcIssuer WHERE {
    <${webId}> solid:oidcIssuer ?oidcIssuer
  }`, {
      sources: [webId],
    });

    const bindings = await bindingsStream.toArray();

    if (bindings.length > 0) {
      if (bindings.length > 1) {
        console.warn(`More than 1 OIDC issuer is present in the WebID. Using the first one returned by Comunica.`);
      }

      return bindings[0].get('oidcIssuer').id;
    } else {
      return null;
    }
  }

  _checkForEnter({key}) {
    if (key === "Enter") {
      this._clickLogin();
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
        <input type="url" id="webid" placeholder="Enter your WebID"
               title="Enter your WebID"
               required
               class=${this.selectedOption === 'webid' ? '' : 'hidden'}
               @keyup="${this._checkForEnter}"
        >
        <input type="url" id="idp" placeholder="Enter your Identity Provider"
               title="Enter your Identity Provider"
               required
               class=${this.selectedOption === 'idp' ? '' : 'hidden'}
               @keyup="${this._checkForEnter}"
        >
        <button id="login-btn" @click="${this._clickLogin}">Log in</button>
      </div>
      <div id="welcome" class=${this.currentWebId ? '' : 'hidden'}>
        <p>Logged in with <span>${this.currentWebId}</span></p>
      </div>
    `;
  }
}
