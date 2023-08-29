import { html, render } from 'lit';
import '../solid-login.js';

/**
 * This method is called by <solid-login> after the user has logged in.
 * @param {object} args - The details about the logged-in user.
 */
function afterLoggingIn(args) {
  const {fetch, session} = args;
  console.log(fetch);
  console.log(session);
}

render(
  html`
        <solid-login .loggedInCallback=${afterLoggingIn}>
          some light-dom
        </solid-login>
      `,
  document.querySelector('#demo')
);
