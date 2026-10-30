# Voicing Drill

A touch-friendly piano practice app for rootless piano voicings. It generates three- and four-note chord prompts, highlights the pitches on a two-octave keyboard, and plays the voicing in the browser.

## Requirements

- Node.js 22.12 or newer
- npm, included with Node.js
- A modern browser such as Chrome, Edge, or Firefox

## Run on Windows, macOS, or Linux

1. Clone the repository from GitHub and open the project folder in a terminal.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

Vite opens the app in your default browser. If it does not, open the **Local** URL printed in the terminal, usually `http://localhost:5173/`.

## Run on a phone or tablet

You can use the development server on a phone or tablet connected to the same Wi-Fi network as your computer:

1. Start the server on your computer with `npm run dev`.
2. Find the **Network** URL printed by Vite, such as `http://192.168.1.23:5173/`.
3. On your phone or tablet, open that exact URL in a browser. Do not use `localhost`; on the mobile device, `localhost` refers to the device itself.

Keep the computer and development server running while you use the app. If the Network URL does not load, check that both devices are on the same non-guest Wi-Fi network and that your computer's firewall allows the Vite server on your private network. Avoid exposing the development server to a public network.

If your browser supports it, use its Share or browser menu to add a Home Screen shortcut. This is a shortcut to the website, not a fully installable offline app: the project does not include a service worker or offline cache, and the computer/server must remain available when using this local development setup.

For access without keeping your computer running, build and deploy the app to a static web host over HTTPS:

```sh
npm run build
```

Upload the generated `dist/` directory to the host. For GitHub Pages project sites, configure Vite's `base` to match the repository path before building.

## Tests and production build

Run the unit and UI tests:

```sh
npm test
```

Create a production build:

```sh
npm run build
```

The React app is served from `index.html`. The original standalone `voicing-drill.html` is also included as a legacy fallback.