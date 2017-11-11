var Rx = require('rxjs');

const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

const Dispatcher = new Rx.ReplaySubject(1, Rx.Scheduler.queue);

Dispatcher.subscribe((event) => {
  // Adds an empty value to the subId
  // if (_.isNil(event.subId)) {
  //   event = _.merge({}, event, { subId: '' });
  // }
  console.log(event)
}, (error) => {
  if (isDev) {
    console.error(error);
  }
});

export default Dispatcher;
