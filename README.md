# 🎄🔌💡 Light Sockets 💡🔌🎄

Turns on/off lights (or anything else) connected to a Raspberry Pi's GPIO pins through a reactive socket-based web connection.

## Getting Started

```
cd /path/to/lights/
yarn  # install npm dependencies (frontend and backend)
```

### Frontend

Derived from `create-react-app`, the frontend behaves like any other CRA project;

```
yarn start  # run local development server e.g. http://localhost:3000/
yarn build  # ... or compile a build for production hosting
```

You'll want to `yarn build` and then go host the resulting `build/` dir somewhere when you're reading to go to production. It does not have to be hosted on the same server as the backend.

### Backend

Backend is just Node's http server wrapped in Express. The entire contents of the backend are in `server.js` while configuration variables are kept as env vars (Check .env file).

Start the backend server with:

```
yarn server
```

By default, the config stored in the `.env` file will be used. Adjust them to your liking (You'll need to restart your server process for changes to take effect):

```
export REACT_APP_DEBUG='true'
export REACT_APP_LIGHTS_BACKEND_PORT='8001'
export REACT_APP_LIGHTS_PIN_LIST='[11, 15, 16]'  # Pin position number
```

NOTE: These variables are also used in the frontend.

## Hardware Requirements

* Raspberry Pi 3 or Zero w/network connection
* 1+ Relay modules ([Example](https://www.amazon.com/Docreate-Channel-Module-Arduino-Raspberry/dp/B075FRJQL4/ref=sr_1_2?ie=UTF8&qid=1510668116&sr=8-2&keywords=8+chanel+relay))
