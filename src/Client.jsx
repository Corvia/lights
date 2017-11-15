import _ from 'lodash';
import React from 'react';
import io from 'socket.io-client';

import './Client.css';

// Variables pulled in from env vars. We share these vars with the backend.
const BACKEND_HOST = process.env.REACT_APP_LIGHTS_BACKEND_HOST;
const BACKEND_PORT = process.env.REACT_APP_LIGHTS_BACKEND_PORT;
const DEBUG = process.env.REACT_APP_LIGHTS_DEBUG === 'true' ? true : false
const PIN_LIST = JSON.parse(process.env.REACT_APP_LIGHTS_PIN_LIST);

// Create a socket connection to the backend
let socket = io.connect(`http://${BACKEND_HOST}:${BACKEND_PORT}`);

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

      <h1>Light Sockets</h1>

      <p>A reactive, socket-powered switch board to set GPIO pins HIGH/LOW on Raspberry Pi.</p>

      <h3>Momentary Switches</h3>
      {_.map(PIN_LIST, pin => (
        <button
          key={pin}
          onMouseDown={setPin(pin, 'low')} onTouchStart={setPin(pin, 'low')}
          onMouseUp={setPin(pin, 'high')} onTouchEnd={setPin(pin, 'high')}
        >
          {pin}
        </button>
      ))}

      <h4>Other Switch Types (TODO)</h4>
      <ul>
        <li>Toggle Switches</li>
        <li>Selector (Rotary/Level) Switches</li>
        <li>Joystick Switch</li>
        <li>Pressure Switch</li>
        <li>Temperature Switch</li>
        <li>Proximity Switch</li>
      </ul>

    </div>
  );
}
