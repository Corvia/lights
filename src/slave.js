require('dotenv').config();

let Rx = require('rxjs');
let io = require('socket.io-client')
let rpio = require('rpio');

// Variables pulled in from env vars. We share these vars with the frontend
// which has it's own requirement: prepend any var names wishing to be used in a
// CRA project with `REACT_APP_`. Our backend does not use react, but we put up
// with this naming convention to keep frontend config by-the-book.
const DEBUG = process.env.REACT_APP_LIGHTS_DEBUG === 'true' ? true : false
const HOST = process.env.REACT_APP_LIGHTS_BACKEND_HOST;
const SLAVE_PORT = process.env.REACT_APP_LIGHTS_SLAVE_PORT;

// Create a socket connection to the backend
let socket = io.connect(`http://${HOST}:${SLAVE_PORT}`);

// Setup an Rx Dispatcher
const Dispatcher = new Rx.ReplaySubject(1, Rx.Scheduler.queue);

// Verbose console logging for debugging purposes
if (DEBUG) {
  console.log(`DEBUG MODE IS ACTIVE\nBackend address: http://${HOST}:${SLAVE_PORT}`);
  Dispatcher.subscribe(event => console.log(event));
}

// Setup each pin that is available
JSON.parse(process.env.REACT_APP_LIGHTS_PIN_LIST).forEach(function(pin) {
  rpio.open(pin, rpio.OUTPUT, rpio.LOW);
});

// Update GPIO state when the associated action is observed
Dispatcher
  .filter(e => e.action === 'CHANGE_LIGHT')
  .debounceTime(10)
  .subscribe(e => write(e.value));

// Set the state of a GPIO pin or, if not running on a pi, will automatically
// fallback in `raspi-3 mock mode` (See `rpio` npm package for details).
function write(state) {
  rpio.write(
    state.id,
    state.on ? rpio.HIGH : rpio.LOW
  );
}

socket.on('LIGHT', function (state) {
  console.log("TESTERERER")
  Dispatcher.next({ action: 'CHANGE_LIGHT', value: state });
  // io.emit('LIGHT', state);
});
