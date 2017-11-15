require('dotenv').config();

let Rx = require('rxjs');
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let rpio = require('rpio');

// Variables pulled in from env vars. We share these vars with the frontend
// which has it's own requirement: prepend any var names wishing to be used in a
// CRA project with `REACT_APP_`. Our backend does not use react, but we put up
// with this naming convention to keep frontend config by the book.
const DEBUG = process.env.REACT_APP_LIGHTS_DEBUG === 'true' ? true : false
const HOST = process.env.REACT_APP_LIGHTS_BACKEND_HOST;
const PORT = process.env.REACT_APP_LIGHTS_BACKEND_PORT;

// Setup an Rx Dispatcher
const Dispatcher = new Rx.ReplaySubject(1, Rx.Scheduler.queue);

// Verbose console logging for debugging purposes
if (DEBUG) {
  console.log(`DEBUG MODE IS ACTIVE\nBackend address: http://${HOST}:${PORT}`);
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

// Socked-based connection and listener for each connected client
io.on('connection', function (socket) {
  if (DEBUG) {
    console.log('Client Connected');
  }
  socket.emit('connected', {});
  socket.on('CHANGE_LIGHT', function (state) {
    Dispatcher.next({ action: 'CHANGE_LIGHT', value: state });
    io.emit('LIGHT', state);
  });
});

// Attach HTTP server to an unregistered (high-numbered) port
server.listen(PORT);
