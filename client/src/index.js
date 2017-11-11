import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import io from 'socket.io-client'
//
// var socket = io.connect('http://localhost:8000');
//
// socket.on('connected', function (data) {
//   console.log(data);
//   socket.emit('CHANGE_LIGHT', { id: 1, on: true });
// });
//
// socket.on('LIGHT', data => {
//   console.log(data)
// })

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
