import _ from 'lodash';
import React from 'react';
import io from 'socket.io-client';

import './Client.css';

// Variables pulled in from env vars. We share these vars with the backend.
const BACKEND_HOST = process.env.REACT_APP_LIGHTS_BACKEND_HOST;
const CLIENT_PORT = process.env.REACT_APP_LIGHTS_CLIENT_PORT;
const DEBUG = process.env.REACT_APP_LIGHTS_DEBUG === 'true' ? true : false
const PIN_LIST = JSON.parse(process.env.REACT_APP_LIGHTS_PIN_LIST);

// Create a socket connection to the backend
let socket = io.connect(DEBUG
  ? `http://${BACKEND_HOST}:${CLIENT_PORT}`
  : `https://${BACKEND_HOST}`);

// Verbose console logging for debugging purposes
if (DEBUG) {
  socket.on('LIGHT', data => {
    console.log(data);
  });
}

export default function App() {

  // Set GPIO Pin state (HIGH or LOW)
  const setPin = (pin, state) => (
    e => socket.emit('CHANGE_LIGHT', {
      id: pin,
      on: state === 'low' ? true : false
    })
  );

  return (
    <div className="App">

      {_.map(PIN_LIST, pin => (
        <button
          key={pin}
          onMouseDown={setPin(pin, 'low')} onTouchStart={setPin(pin, 'low')}
          onMouseUp={setPin(pin, 'high')} onTouchEnd={setPin(pin, 'high')}
        >
          {pin}
        </button>
      ))}

    </div>
  );
}
