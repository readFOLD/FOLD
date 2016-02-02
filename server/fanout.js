var runFanout = function (options) {
  options = options || {};
  _.defaults(options, {logging: true})
  if(options.logging){
    console.log('Running fanout...');
  }

  var startTime = Date.now();
  var previousTimepoint = Date.now();

  var timeLogs = [];

  var pendingActivities = Activities.find({fanout: "pending"});

  timeLogs.push('pending activities fetch time: ' + ((Date.now() - previousTimepoint) / 1000) + ' seconds');
  previousTimepoint = Date.now();

  pendingActivities.forEach(fanoutActivity);
  timeLogs.push('activity fanout time: ' + ((Date.now() - previousTimepoint) / 1000) + ' seconds');
  previousTimepoint = Date.now();

  if(options.logging) {
    _.each(timeLogs, function (str) {
      console.log(str);
    });

    console.log('Total time to run fanout: ' + ((Date.now() - startTime) / 1000) + ' seconds');
  }

};

var jobWaitInSeconds = parseInt(process.env.JOB_WAIT) || 5 * 60; // default is every 5 minutes


if (process.env.PROCESS_TYPE === 'fanout_worker') { // if a worker process
  Meteor.startup(function () {
    while (true) {
      runFanout();
      Meteor._sleepForMs(jobWaitInSeconds * 1000);
    }
  });
} else if (process.env.NODE_ENV === 'development') { // however, in developement, run fanout more quickly
  Meteor.startup(function () {
    var backgroundFanout = function(){
      Meteor.setTimeout(function(){
        runFanout({logging: true});
        backgroundFanout();
      }, 1000);
    };
    backgroundFanout();
  });
}
