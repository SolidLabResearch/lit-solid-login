import { html, render } from 'lit';
import '../solid-login.js';

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
