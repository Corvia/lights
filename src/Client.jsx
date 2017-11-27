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

const BEN_PINS = JSON.parse('[11, 15, 16, 18, 22, 32, 36, 38]')
const JAMIE_PINS = JSON.parse('[8, 10, 12, 16, 18, 22, 24, 26]')

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
  const setLight = (slave, pin, state) => (
    e => {
      socket.emit('CHANGE_LIGHT', {
        slave: slave,
        state: {
          id: pin,
          on: state === 'low' ? true : false
        }
      })
      e.stopPropagation()
      e.preventDefault()
    }
  );

  const burstLight = (slave, state) => e => {
    socket.emit('BURST_LIGHT', {
      slave: slave,
      state: {
        on: state === 'low' ? true : false
      }
    })
    e.stopPropagation()
    e.preventDefault()
  }

  const spiralLight = (slave, state) => e => {
    socket.emit('SPIRAL_LIGHT', {
      slave: slave,
      state: {
        on: state === 'low' ? true : false
      }
    })
    e.stopPropagation()
    e.preventDefault()
  }

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
        <label><FontAwesome name="map-marker" fixedWidth /> B's Office</label>
        {_.map(BEN_PINS, pin => (
          <button
            key={pin}
            onMouseDown={setLight('BEN_BOX', pin, 'low')} onTouchStart={setLight('BEN_BOX', pin, 'low')}
            onMouseUp={setLight('BEN_BOX', pin, 'high')} onTouchEnd={setLight('BEN_BOX', pin, 'high')}
          >
            {pin}
          </button>
        ))}
        <button
          onMouseDown={burstLight('BEN_BOX', 'low')} onTouchStart={burstLight('BEN_BOX', 'low')}
          onMouseUp={burstLight('BEN_BOX', 'high')} onTouchEnd={burstLight('BEN_BOX', 'high')}
        >
          BURST
        </button>
        <button
          onMouseDown={spiralLight('BEN_BOX', 'low')} onTouchStart={spiralLight('BEN_BOX', 'low')}
          onMouseUp={spiralLight('BEN_BOX', 'high')} onTouchEnd={spiralLight('BEN_BOX', 'high')}
        >
          SPIRAL
        </button>
      </div>

      <div className="pads">
        <label><FontAwesome name="map-marker" fixedWidth /> J's Office</label>
        {_.map(JAMIE_PINS, pin => (
          <button
            key={pin}
            onMouseDown={setLight('JAMIE_BOX', pin, 'low')} onTouchStart={setLight('JAMIE_BOX', pin, 'low')}
            onMouseUp={setLight('JAMIE_BOX', pin, 'high')} onTouchEnd={setLight('JAMIE_BOX', pin, 'high')}
          >
            {pin}
          </button>
        ))}
        <button
          onMouseDown={burstLight('JAMIE_BOX', 'low')} onTouchStart={burstLight('JAMIE_BOX', 'low')}
          onMouseUp={burstLight('JAMIE_BOX', 'high')} onTouchEnd={burstLight('JAMIE_BOX', 'high')}
        >
          BURST
        </button>
        <button
          onMouseDown={spiralLight('JAMIE_BOX', 'low')} onTouchStart={spiralLight('JAMIE_BOX', 'low')}
          onMouseUp={spiralLight('JAMIE_BOX', 'high')} onTouchEnd={spiralLight('JAMIE_BOX', 'high')}
        >
          SPIRAL
        </button>
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
