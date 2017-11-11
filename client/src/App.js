import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client'

var socket = io.connect('http://localhost:8000');

socket.on('LIGHT', data => {
  console.log(data)
})

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            onMouseDown={e => socket.emit('CHANGE_LIGHT', { id: 1, on: true })}
            onMouseUp={e => socket.emit('CHANGE_LIGHT', { id: 1, on: false })}
            src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
