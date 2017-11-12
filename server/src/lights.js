var Dispatcher = require('./Dispatcher').Dispatcher

var rpio = require('rpio');

// Setup each pin that is available
rpio.open(11, rpio.OUTPUT, rpio.LOW);
console.log('Pin 11 is currently set ' + (rpio.read(11) ? 'high' : 'low'));

Dispatcher
  .filter(e => e.action === 'CHANGE_LIGHT')
  .debounceTime(10)
  .subscribe(e => write(e.value))

//Example State
// state {
//   id: //pin number
//   on: //bool for on or off
// }

function write(state) {
  rpio.write(state.id, state.on ? rpio.HIGH : rpio.LOW)
}
