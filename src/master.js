require('dotenv').config();

let Rx = require('rxjs');
let app = require('express')();

// Variables pulled in from env vars. We share these vars with the frontend
// which has it's own requirement: prepend any var names wishing to be used in a
// CRA project with `REACT_APP_`. Our backend does not use react, but we put up
// with this naming convention to keep frontend config by-the-book.
const DEBUG = process.env.REACT_APP_LIGHTS_DEBUG === 'true' ? true : false
const HOST = process.env.REACT_APP_LIGHTS_BACKEND_HOST;
const PORT = process.env.REACT_APP_LIGHTS_BACKEND_PORT;
const CLIENT_PORT = process.env.REACT_APP_LIGHTS_CLIENT_PORT;
const SLAVE_PORT = process.env.REACT_APP_LIGHTS_SLAVE_PORT;

// Setup an Rx Dispatcher
const Dispatcher = new Rx.ReplaySubject(1, Rx.Scheduler.queue);

// Verbose console logging for debugging purposes
if (DEBUG) {
  console.log(`DEBUG MODE IS ACTIVE\nBackend address: http://${HOST}:${CLIENT_PORT}`);
  Dispatcher.subscribe(event => console.log(event));
}

/***************** CLIENT *********************/

//Client connections
let client = require('http').Server(app);
let clientIO = require('socket.io')(client);

// Socked-based connection and listener for each connected client
clientIO.on('connection', function (socket) {
  if (DEBUG) {
    console.log('Client Connected');
  }
  socket.on('CHANGE_LIGHT', function (state) {
    Dispatcher.next({ action: 'CHANGE_LIGHT', value: state });
  });
});

// Attach HTTP server to an unregistered (high-numbered) port
client.listen(CLIENT_PORT);

/******************* SLAVE *********************/

//Slave connections
let slave = require('http').Server(app);
let slaveIO = require('socket.io')(slave);

// Socked-based connection and listener for each connected client
slaveIO.on('connection', function (socket) {
  if (DEBUG) {
    console.log('Slave Connected');
  }
});

// Update slave when light pressed
Dispatcher
  .filter(e => e.action === 'CHANGE_LIGHT')
  .debounceTime(10)
  .do(e => slaveIO.emit('LIGHT', e.value))
  .subscribe();

// Attach HTTP server to an unregistered (high-numbered) port
slave.listen(SLAVE_PORT);
