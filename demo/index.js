import { html, render } from 'lit';
import '../solid-login.js';

function customLogin(options) {
  const {type, value} = options;
  console.log('My custom login function!', type, value);
}

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
