# Solid Login Web Component

This is a [Web Component](https://github.com/SolidLabResearch/lit-solid-login) that enables users to log in with Solid-OIDC.
We used [Lit](https://lit.dev/) to build the component.
The component is framework-agnostic.
You can use it with vanilla JavaScript, but also frameworks such as React and Vue.
End-users have the option to use either their WebID or Identity Provider to log in.
This component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.
You find a screencast [here](https://cloud.ilabt.imec.be/index.php/s/gWfBDSp5WZKaySc).

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

The screenshot belows shows the result in a Web app.

![A screenshot from a Web app.
It contains two radio buttons next to each other:
one for "WebID" and one for "Identity Provider".
Below that there is a field where the user fills in either their WebID or
Identity Provider.
Next to the field is the login button.](screenshot.png)

Best to have a look at the code in the folder `demo` to see how we do it now.

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

1. Install the dependencies via

   ```shell
   npm i
   ```

2. Start the demo via

   ```shell
   npm start
   ```

   Keep the demo running.
3. In another terminal prepare the Solid pods via

   ```shell
   npm run prepare:pods
   ```

4. Start the Solid server with the pods via

   ```shell
   npm run start:pods
   ```

   The server is ready when the following message appears in the terminal

   ```text
   Listening to server at http://localhost:3000/
   ```

   Keep this process running.

5. Open a browser at <http://localhost:8080>.

## Tests

1. Install the dependencies via

   ```shell
   npm i
   ```

2. Start the demo via

   ```shell
   npm start
   ```

   Keep the demo running.
3. In another terminal prepare the Solid pods via

   ```shell
   npm run prepare:pods
   ```

4. Start the Solid server with the pods via

   ```shell
   npm run start:pods
   ```

   The server is ready when the following message appears in the terminal

   ```text
   Listening to server at http://localhost:3000/
   ```

   Keep this process running.
5. In another terminal run the tests via

   ```shell
   npm test
   ```
