import _ from 'lodash';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import io from 'socket.io-client';

import 'font-awesome/css/font-awesome.css';
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

export default function Client() {

  // Set GPIO Pin state (HIGH or LOW)
  const setPin = (pin, state) => (
    e => socket.emit('CHANGE_LIGHT', {
      id: pin,
      on: state === 'low' ? true : false
    })
  );

  return (
    <div className="App">

      <div className="header">
        <a href="https://easttroy.org/">
          <FontAwesome name="angle-left" />
          <img src="./logo.png" className="logo" alt="easttroy.org" />
        </a>
        <div className="project-name">
          Village Square Lights
        </div>
      </div>

      <div className="pads">
        <label><FontAwesome name="map-marker" fixedWidth /> Ben's Office</label>
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

      <div className="more">
        <ul>
          <li><a href="#">Add More Lights! <FontAwesome name="angle-right" /></a></li>
          <li><a href="#">Become a Sponsor <FontAwesome name="angle-right" /></a></li>
        </ul>
      </div>

      <p className="footer">Village Square Lights is a collaboration between the East Troy Area Chamber of Commerce, East Troy Computer Club and Corvia Technologies, LLC. </p>
      <p className="footer">
        <a href="https://github.com/Corvia/lights" target="_blank" rel="noopener noreferrer">
        <FontAwesome name="heart" fixedWidth /> Let's build cool stuff together
        </a>
      </p>

    </div>
  );
}
