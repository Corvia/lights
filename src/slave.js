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
const SLAVE_NAME = process.env.REACT_APP_SLAVE_NAME;
const PINS = JSON.parse(process.env.REACT_APP_LIGHTS_PIN_LIST);

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
PINS.forEach(function(pin) {
  rpio.open(pin, rpio.OUTPUT, rpio.LOW);
});

// Set the state of a GPIO pin or, if not running on a pi, will automatically
// fallback in `raspi-3 mock mode` (See `rpio` npm package for details).
function write(state) {
  rpio.write(
    state.id,
    state.on ? rpio.HIGH : rpio.LOW
  );
}

socket.on('CHANGE_LIGHT', function (state) {
  Dispatcher.next({ action: 'CHANGE_LIGHT', value: state });
});

socket.on('BURST_LIGHT', function (state) {
  Dispatcher.next({ action: 'BURST_LIGHT', value: state });
});

socket.on('SPIRAL_LIGHT', function (state) {
  Dispatcher.next({ action: 'SPIRAL_LIGHT', value: state });
});

/* ***************  LIGHT SHOW MODES ***************** */

// Listen for only this slave
const SlaveDispatches$ = Dispatcher
  .filter(e => e.value.slave === SLAVE_NAME)
  .throttleTime(10)

// Mode: Light Change
// Stream of light changes
const doChange$ = SlaveDispatches$
  .filter(e => e.action === 'CHANGE_LIGHT')
  .do(e => write(e.value.state));

// Mode: Light Burst
// Stream of light bursts
const doBurst$ = SlaveDispatches$
  .filter(e => e.action === 'BURST_LIGHT')
  .flatMap(e => Rx.Observable.from(PINS)
    .map(pin => ({ id: pin, on: e.value.state.on }))
    .zip(Rx.Observable.interval(5))
    .map(e => e[0]))
  .do(e => write(e));

// Mode: Light Spiral
// Listen for spirals
const spiral$ = SlaveDispatches$
  .filter(e => e.action === 'SPIRAL_LIGHT')

// Listen for turning off spirals
const spiralOff$ = spiral$
  .filter(e => e.value.state.on === false)

// Stream of spirals
const doSpiral$ = spiral$
    .filter(e => e.value.state.on === true)
    .switchMap(e => Rx.Observable.interval(200)
      .map(num => PINS[num % 8])
      .map(pin => ({ id: pin, on: true }))
      .takeUntil(spiralOff$))
    .do(e => write(e))
    .delay(200)
    .map(e => ({ id: e.id, on: false }))
    .do(e => write(e));

// Subscribe to all streams at one time
const subscribe = doSpiral$
  .merge(doBurst$)
  .merge(doChange$)
  .subscribe()
