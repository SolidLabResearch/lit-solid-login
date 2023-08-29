# \<solid-login>

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

This doesn't work (yet).

```bash
npm i solid-login
```

## Usage

```html
<script type="module">
  import 'solid-login/solid-login.js';
</script>

<solid-login></solid-login>
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

```bash
npm i
```

```bash
npm start
```
