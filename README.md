# Solid Login Web Component

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

This doesn't work (yet).

```shell
npm i solid-login
```

But the following does.

```shell
npm i https://github.com/SolidLabResearch/lit-solid-login
```

## Usage

```html
<script type="module">
  import 'solid-login/solid-login.js';
</script>

<solid-login />
```

Best to have a look at `demo/index.html` to see how we do it now.

## Options

All of these options are optional.

- `selectedOption` (String): If the default login is via WebID or IDP. Values: "webid" or "idp". Default is "webid".
- `loginCallback` (Function): The component calls this function when the login button is pressed.
This disables the default Solid-OIDC login process.
- `loggedInCallback` (Function): The component calls this function when the user is logged in.
- `loggedOutCallback` (Function): The component calls this function when the user is logged out.
- `handleIncomingRedirectOptions` (Object): This object overwrites the default options for `handleIncomingRedirect`.
- `loginOptions` (Object): This object overwrites the default options for `login`.
- `showWelcomeMessage` (Boolean): If this is true, then a message is shown when logged in. Default is true.

## Local Demo

1. Install dependencies via
   ```bash
   npm i
   ```
2. Start demo via 
   ```bash
   npm start
   ```
3. Open browser at <http://localhost:8080>.

## Tests

1. Install dependencies via
   ```shell
   npm i
   ```
2. Start demo via
   ```shell
   npm start
   ```
   Keep the demo running.
3. In another terminal prepare the Solid pods via
   ```shell
   npm run prepare:pods
   ```
4. Start Solid server with the pods via
   ```shell
   npm run start:pods
   ```
   The server is ready when the following message appears in the terminal
   ```
   Listening to server at http://localhost:3000/
   ```
   Keep this process running.
5. In another terminal run the tests via
   ```shell
   npm test
   ```
