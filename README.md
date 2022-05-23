# Small Minecraft Panel

## Configuration

The configuration step is quite simple, but mandatory. Create a `.env` or `.env.local` file in the root of the project. ([the difference between them is just about the .gitignore file](https://vitejs.dev/guide/env-and-mode.html#env-files))

This is an example of an env file:

```env
VITE_SERVER_NAME="Minecraft Server"
VITE_WEBSOCKET_ADDRESS='ws://example.com:3001'
VITE_WEBSOCKET_RELOAD_TIME=10
VITE_FETCH_PLAYER_HEADS=1
```

**All environment variables are mandatory**
`VITE_SERVER_NAME`defines the name in the topbar of the website and in the tab title.
`VITE_WEBSOCKET_ADDRESS` defines address to which the website will connect to get graph and player data from the server.
`VITE_WEBSOCKET_RELOAD_TIME` defines the time (in seconds) that it takes for the website to re-attempt a websocket connection between each failure/deconnection
`VITE_SERVER_NAME` defines if the website should make API calls to fetch the players skin's heads. If `0`, every head will show up as Steve.

## Docker

Follow the Configuration step above before doing anything.

For a quick solution, do
`docker build . -t <image_name>`
This will build the app. Then to launch it, use
`docker run -p <desired port>:3000 -d <image_name>`
This will launch the app on `<desired_port>`
