var servicesToFetch = [
  {
    serviceName: 'ustream',
    methodName: 'ustreamVideoSearchList',
    startingPage: 1,
    initialPagesGuess: 60,
    guessBias: 1,
    maxPages: parseInt(process.env.MAX_USTREAM_PAGES) || parseInt(Meteor.settings.MAX_USTREAM_PAGES) || 1000,
    asyncWaitTime: 10,
    mapFn: function (doc) {
      return _.extend(doc, {
        _streamSource: 'ustream',
        username: doc.user.userName,
        currentViewers: parseInt(doc.viewersNow),
        totalViews: parseInt(doc.totalViews),
        live: true
      })
    }
  },
  {
    serviceName: 'bambuser',
    methodName: 'bambuserVideoSearchList',
    startingPage: 0,
    initialPagesGuess: 5,
    guessBias: 1,
    maxPages: parseInt(process.env.MAX_BAMBUSER_PAGES) || parseInt(Meteor.settings.MAX_BAMBUSER_PAGES) || 1000,
    asyncWaitTime: 10,
    mapFn: function (doc) {
      _.extend(doc, {
        _streamSource: 'bambuser',
        username: doc.userName,
        //currentViewers: parseInt(doc.views), // no current viewers metric for bambuser
        totalViews: parseInt(doc.views_total),
        lengthSecs: doc.length,
        live: true
      });
      delete doc.length; // this only causes problems
      return doc;
    }
  }
];


var generateFetchFunction = function(serviceInfo){

  var serviceName = serviceInfo.serviceName;
  var numPagesGuess = serviceInfo.initialPagesGuess;
  var guessBias = serviceInfo.guessBias;
  var waitBetweenAsyncCalls = serviceInfo.asyncWaitTime; // ms
  var maxPages = serviceInfo.maxPages;
  var startingPage = serviceInfo.startingPage;



  return Meteor.wrapAsync(function (finalCallback) {
    var numPagesGuesses = [];

    var allStreamsLoaded = false;
    var numAsyncPages = Math.min(numPagesGuess, maxPages);

    var currentPage;

    var streamInsertCallback = function (error, result, page, cb) {
      console.log('Received ' + serviceName + ' response for page: ' + page);

      if (error) {
        allStreamsLoaded = true;
        console.log('Error returned from ' + serviceName + ' on page: ' + page);
        console.error(error);
        return cb();
      }

      if (!result.items || !result.items.length) {
        allStreamsLoaded = true;
        numPagesGuesses.push(page - 1 + guessBias);
        return cb();
      }
      Streams.batchInsert(_.map(result.items, serviceInfo.mapFn));

      console.log('Added ' + serviceName + ' streams to database for page: ' + page);
      return cb();
    };

    console.log('Current guess for number of ' + serviceName + ' pages: ' + numPagesGuess);
    console.log('Begin async ' + serviceName + ' calls')
    async.each(_.range(numAsyncPages), function (i, cb) {
        Meteor.setTimeout(function () {
          currentPage = i + 1;
          console.log('Async ' + serviceName + ' call for page: ' + currentPage);
          var localCurrentPage = currentPage;

          Meteor.call(serviceInfo.methodName, undefined, undefined, currentPage, function (err, result) {
            try {
              streamInsertCallback(err, result, localCurrentPage, cb);
            } catch (err) {
              console.log('Error in async ' + serviceName + ' callback page: ' + localCurrentPage)
              console.error(err)
              return cb();
            }
          });
        }, waitBetweenAsyncCalls * i)
      }, function (err) {
        console.log('Finish async ' + serviceName + ' calls');
        if (err) {
          finalCallback(err);
        } else {
          console.log('Begin sync ' + serviceName + ' calls');
          currentPage += 1;

          while (!allStreamsLoaded && currentPage < maxPages + startingPage) {
            console.log('Sync ' + serviceName + ' call for page: ' + currentPage);

            Meteor.call(serviceInfo.methodName, undefined, undefined, currentPage, function (err, result) {
              streamInsertCallback(err, result, currentPage, function (err) {
                if (err) {
                  return finalCallback(err);
                }
              })
            });
            currentPage += 1;
          }
          if (allStreamsLoaded) {
            numPagesGuess = _.min(numPagesGuesses)
          } else {
            numPagesGuess = currentPage - 1;
          }
          console.log('Finish sync ' + serviceName + ' calls');
          console.log(serviceName + ' API calls complete!');
          console.log((currentPage - 1) + ' ' + serviceName + ' pages loaded');


          console.log(serviceName + ' results refreshed');
          return finalCallback();
        }
      }
    );

  })
};

var updateStreamStatus = function (deepstream) {
  // TODO track how many streams are live and update deepstream accordingly
  var ustream;
  _.each(deepstream.streams, function (stream) {
    var streamSourceId = stream.reference.id;
    switch (stream.source) {
      case 'ustream':
        console.log('check ustream')
        if (ustream = Streams.findOne({'id': streamSourceId})) {
          // TODO update views and such
          Deepstreams.update({
            _id: deepstream._id,
            'streams.reference.id': streamSourceId
          }, {$set: {'streams.$.live': true}});
        } else {
          // TODO update views and such
          Deepstreams.update({
            _id: deepstream._id,
            'streams.reference.id': streamSourceId
          }, {$set: {'streams.$.live': false}});
        }
        break;
      case 'bambuser':
        // TODO
        break;
      case 'youtube':
        console.log('check youtube')

        // TODO maybe only if we think youtube video is live
        // TODO check youtube videos at API and update with live or not live
        Meteor.call('youtubeVideoInfo', streamSourceId, function (err, data) {  // TODO this request can be done in a batch for all youtube videos we have...
          if (err) {
            throw(err);
          }
          var videos = data.items;
          var video = videos[0];
          console.log('youtube video info')
          console.log(streamSourceId)
          if (video) {
            //console.log(video.snippet)
            if (video.snippet.liveBroadcastContent === 'live') {
              console.log('LIIIIIIVE')
              // TODO update views and such (statistis.viewCount)
              // and current viewers liveStreamingDetails.concurrentViewers
              // TODO, this line below shouldn't be necessary since youtube doesn't go live again after it's dead, we think...
              Deepstreams.update({
                _id: deepstream._id,
                'streams.reference.id': streamSourceId
              }, {$set: {'streams.$.live': true}});

            } else {
              // TODO update views and such
              console.log('DEEEAAAADDD')
              Deepstreams.update({
                _id: deepstream._id,
                'streams.reference.id': streamSourceId
              }, {$set: {'streams.$.live': false}});
            } // video isn't live
          } else { // video not found, so not live
            console.log('NOT FOUUUUUND')
            Deepstreams.update({
              _id: deepstream._id,
              'streams.reference.id': streamSourceId
            }, {$set: {'streams.$.live': false}});
          }
        });
        break;

    }
  });
};

var cycleStreamsCollection = function () {
  Streams.update({}, {$inc: {oneIfCurrent: 1}}, {multi: true}); // recent batch is now loaded
  Streams.remove({oneIfCurrent: {$gt: 1}}); // remove previous batch
};

var updateStreamStatuses = function () {
  Deepstreams.find({}, {fields: {streams: 1}}).forEach(updateStreamStatus);
};

var updateDeepstreamStatuses = function () {

  // TODO only check active stream when in director mode
  // TODO restrict to published?

  var dsLive = Deepstreams.update({'streams.live': true}, {$set: {live: true}}, {multi: true});
  var dsDead = Deepstreams.update({'streams': {$not: {$elemMatch: {live: true}}}}, {$set: {live: false}}, {multi: true});

  console.log(dsLive + ' deepstreams are live');
  console.log(dsDead + ' deepstreams are dead');

};

var runJobs = function () {
  console.log('Running jobs...')
  var startTime = Date.now();
  var previousTimepoint = Date.now();

  var timeLogs = [];

  _.each(servicesToFetch, function(serviceInfo){
    generateFetchFunction(serviceInfo)();
    timeLogs.push(serviceInfo.serviceName + ' fetch time: ' + ((Date.now() - previousTimepoint)/1000) + ' seconds');
    previousTimepoint = Date.now();
  });

  cycleStreamsCollection();
  timeLogs.push('stream db cycle time: ' + ((Date.now() - previousTimepoint) / 1000) + ' seconds');
  previousTimepoint = Date.now();

  updateStreamStatuses();
  timeLogs.push('stream update time: ' + ((Date.now() - previousTimepoint) / 1000) + ' seconds');
  previousTimepoint = Date.now();

  updateDeepstreamStatuses();
  timeLogs.push('deepstream update time: ' + ((Date.now() - previousTimepoint) / 1000) + ' seconds');
  previousTimepoint = Date.now();

  _.each(timeLogs, function(str){
    console.log(str);
  });

  console.log('Total time to run jobs: ' + ((Date.now() - startTime) / 1000) + ' seconds');
};

var jobWaitInSeconds = parseInt(process.env.JOB_WAIT) || 5 * 60; // default is every 5 minutes


if (process.env.PROCESS_TYPE === 'stream_worker') { // if a worker process
  Meteor.startup(function () {
    Meteor.setTimeout(function () {
      while (true) {
        runJobs();
        Meteor._sleepForMs(jobWaitInSeconds * 1000)
      }
    });
  });
} else if (process.env.NODE_ENV === 'development') { // however, in developement, run jobs on startup
  Meteor.startup(function () {
    Meteor.setTimeout(runJobs)
  });
}
