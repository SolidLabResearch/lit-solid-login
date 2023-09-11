import { html, render } from 'lit';
import '../solid-login.js';

let authFetch;

/**
 * This method is called by <solid-login> after the user has logged in.
 * @param {object} args - The details about the logged-in user.
 */
function afterLoggingIn(args) {
  const {fetch, session} = args;
  authFetch = fetch;
  console.log(session);
  document.getElementById('query-favourite-books').classList.remove('hidden');
}

function afterLoggingOut() {
  authFetch = null;
  document.getElementById('query-favourite-books').classList.add('hidden');
}

render(
  html`
        <solid-login .loggedInCallback=${afterLoggingIn} .loggedOutCallback=${afterLoggingOut} />
      `,
  document.querySelector('#top')
);

document.getElementById('query-wish-list').addEventListener('click', () => {
  queryAndShowResults('http://localhost:3000/example/wish-list');
});

document.getElementById('query-favourite-books').addEventListener('click', () => {
  queryAndShowResults('http://localhost:3000/example/favourite-books');
});

async function queryAndShowResults(url) {
  let currentFetch = authFetch || fetch;

  const response = await currentFetch(url);
  const text = await response.text();
  document.getElementById('result').innerText = text;
}
