import {html, css, LitElement, TemplateResult} from 'lit';
import {fetch, handleIncomingRedirect, getDefaultSession, login, logout} from '@inrupt/solid-client-authn-browser';
import {QueryEngine} from '@comunica/query-sparql';

export class SolidLogin extends LitElement {
  static styles = css`
    :host {
      font-family: var(--solid-login-font-family, Helvetica, sans-serif);
    }

    #radios {
      padding-bottom: 10px;
    }

    #error {
      padding-top: 10px;
      color: red;
    }

    .hidden {
      display: none;
      visibility: hidden;
    }
  `;

  static properties = {
    selectedOption: {type: String},
    loginCallback: {type: Function},
    loggedInCallback: {type: Function},
    loggedOutCallback: {type: Function},
    currentWebId: {type: String, state: true},
    errorMessage: {type: String, state: true},
    handleIncomingRedirectOptions: {type: Object},
    loginOptions: {type: Object},
    showWelcomeMessage: {type: Boolean}
  };

  /**
   *
   */
  constructor() {
    super();
    this.selectedOption = 'webid';
    this.showWelcomeMessage = true;
    this.currentWebId = null;
    this.errorMessage = null;
    this.defaultHandleIncomingRedirectOptions = {
      url: window.location.href,
      restorePreviousSession: true
    };
    this.defaultLoginOptions = {
      redirectUrl: window.location.href
    };
  }

  /**
   * This method is invoked when the component is added to the document's DOM.
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('load', this.onLoad.bind(this));
  }

  /**
   * This method should be called when the window has loaded.
   * It checks if the app is reloaded after a redirect that happened after logging in.
   * @returns {Promise<void>}
   */
  async onLoad() {
    console.log('On load called');
    const options = {...this.defaultHandleIncomingRedirectOptions, ...this.handleIncomingRedirectOptions};
    await handleIncomingRedirect(options);

    console.log(getDefaultSession().info);
    this.currentWebId = getDefaultSession().info.webId;
    console.log(this.currentWebId);

    if (getDefaultSession().info.isLoggedIn && this.loggedInCallback) {
      console.log('Calling loggedInCallback');
      this.loggedInCallback({fetch, session: getDefaultSession()});
    }
  }

  /**
   * This method handles the clicking on a radio button.
   * @param {Event} e - The event of the click.
   * @private
   */
  _clickRadioButton(e) {
    this.selectedOption = e.target.value;
  }

  /**
   * This method handles the clicking on the login button.
   * @private
   */
  async _clickLogin() {
    console.log('Login button clicked.');
    this.errorMessage = null;

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
        try {
          idp = await this._getOidcIssuerFromWebID(this.renderRoot.querySelector(`#${this.selectedOption}`).value);
        } catch (e) {
          this.errorMessage = 'An error occurred when getting the OIDC issuer from the WebID.';
          console.error(e);
          return;
        }

        if (!idp) {
          this.errorMessage = 'We found no OIDC issuer in the WebID.';
          return;
        }
      }

      console.log('Using IDP', idp);
      const options = {...this.defaultLoginOptions, ...this.loginOptions};
      options.oidcIssuer = idp;

      try {
        await login(options);
      } catch (e) {
        this.errorMessage = 'An error occurred when logging in.';
        console.error(e);
      }
    }
  }

  /**
   * This function returns the OIDC issuer of a WebID.
   * @param  {string} webId - The WebID from which to get the OIDC issuer.
   * @returns {string} The OIDC issuer of the WebID.
   * @private
   */
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
        console.warn('More than 1 OIDC issuer is present in the WebID. Using the first one returned by Comunica.');
      }

      return bindings[0].get('oidcIssuer').id;
    } else {
      return null;
    }
  }

  /**
   * This method handles the clicking on the logout button.
   * @returns {Promise<void>}
   * @private
   */
  async _clickLogout() {
    await logout();
    this.currentWebId = null;

    if (this.loggedOutCallback) {
      this.loggedOutCallback();
    }
  }

  /**
   * This method checks if the keyup event is an enter and starts the login process if this is the case.
   * @param {object} args - The arguments given to a keyup event handler.
   * @private
   */
  _checkForEnter(args) {
    const {key} = args;
    if (key === 'Enter') {
      this._clickLogin();
    }
  }

  /**
   * This function return the error HTML.
   * @returns {TemplateResult<1>} The error HTML.
   * @private
   */
  _errorTemplate() {
    return html`
      <div id="error" class=${this.errorMessage === null ? 'hidden' : ''}>
        ${this.errorMessage}
      </div>
    `;
  }

  /**
   * This method returns the radio group for filling in a WebID or IDP.
   * @returns {TemplateResult<1>} A radio group for filling in a WebID or IDP.
   * @private
   */
  _radiosTemplate() {
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
    `;
  }

  /**
   * This function returns the login form.
   * @returns {TemplateResult<1>} A login form.
   * @private
   */
  _loginFormTemplate() {
    return html`
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
    `;
  }

  /**
   * This method returns the template that needs to be shown after logging in.
   * @returns {TemplateResult<1>} Post-login HTML
   * @private
   */
  _postLoginTemplate() {
    return html`
      <div id="welcome" class=${this.currentWebId && this.showWelcomeMessage ? '' : 'hidden'}>
        <p>Logged in with <span>${this.currentWebId}</span></p>
      </div>
      <button id="logout-btn"
              class=${this.currentWebId ? '' : 'hidden'}
              @click="${this._clickLogout}">Log out
      </button>
    `;
  }

  /**
   * This function returns the HTML of this Web Component.
   * @returns {TemplateResult<1>} The HTML of this Web Component.
   */
  render() {
    return html`
      ${this._radiosTemplate()}
      ${this._loginFormTemplate()}
      ${this._errorTemplate()}
      ${this._postLoginTemplate()}
    `;
  }
}
