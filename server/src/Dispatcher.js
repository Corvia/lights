var Rx = require('rxjs');

const Dispatcher = new Rx.ReplaySubject(1, Rx.Scheduler.queue);

Dispatcher.subscribe((event) => {
  console.log(event)
});

exports.Dispatcher = Dispatcher;
