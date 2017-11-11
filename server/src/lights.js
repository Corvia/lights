var Dispatcher = require('./Dispatcher').Dispatcher

//var gpio = require('rpi-gpio');

// Setup each pin that is available
// gpio.setup(7, gpio.DIR_OUT, write);

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
  console.log("ATTEMPT TO WRITE LIGHT " + state.id + " to " + state.on)
    // gpio.write(state.id, state.on, function(err) {
    //     if (err) throw err;
    //     console.log('Written to pin');
    // });
}
