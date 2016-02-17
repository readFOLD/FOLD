var runFanout = function (options) {
  options = options || {};
  _.defaults(options, {logging: true});
  if(options.logging){
    console.log('Running fanout...');
  }

  var startTime = Date.now();
  var previousTimepoint = Date.now();

  var timeLogs = [];

  var pendingActivities;

  if (options.cleanup) {
    pendingActivities = Activities.find({fanout: "in_progress"}); // find partially fanned out activities
    pendingActivities.forEach(function(activity){
      ActivityFeedItems.remove({aId: activity._id}); // remove the related feed items
    });
    // then try to fan them out again

    timeLogs.push('in progress activities fetch and activity feed cleanup time: ' + ((Date.now() - previousTimepoint) / 1000) + ' seconds');
    previousTimepoint = Date.now();
  } else {
    pendingActivities = Activities.find({fanout: "pending"}); // this is the default
  }

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


var generateInitialViewActivities = function(){
  var stories = Stories.find({published: true}, {fields : {'analytics.views.byIP': 1}});
  stories.forEach((story) => {
    if(story && story.analytics && story.analytics.views){
      var uniqueViews = story.analytics.views.byIP;
      if(uniqueViews){
        var viewThresholdCrossed = (VIEW_THRESHOLDS[_.sortedIndex(VIEW_THRESHOLDS, uniqueViews) - 1]);
        if(viewThresholdCrossed){
          generateViewThresholdActivity(story._id, viewThresholdCrossed);
        }
      }
    }
  })

  console.log('View Activities Added!!')
}



var fanOutWaitInSeconds = parseInt(process.env.FANOUT_WAIT) || 5 * 60; // default is every 5 minutes


if (process.env.PROCESS_TYPE === 'fanout_worker') { // if a worker process
  Meteor.startup(function () {
    while (true) {
      runFanout();
      Meteor._sleepForMs(fanOutWaitInSeconds * 1000);
    }
  });
} else if (process.env.PROCESS_TYPE === 'cleanup_fanout_worker') { // don't run this while fanout worker is running
  Meteor.startup(function () {
    runFanout({cleanup: true});
    process.exit();
  });
} else if (process.env.PROCESS_TYPE === 'initial_view_threshold_worker') {
  Meteor.startup(function () {
    generateInitialViewActivities();
    // don't exit because activities are generate asynchronously
  });
} else if (process.env.NODE_ENV === 'development') { // however, in developement, run fanout more quickly
  Meteor.startup(function () {
    var backgroundFanout = function(){
      Meteor.setTimeout(function(){
        runFanout({logging: false});
        backgroundFanout();
      }, 1000);
    };
    backgroundFanout();
  });
}
