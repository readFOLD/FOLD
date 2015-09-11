var numUStreamPagesGuess = 30; // starting guess

var refreshUStreamDB = Meteor.wrapAsync(function(finalCallback){
  var numUStreamPagesGuesses = [];

  var allUStreamsLoaded = false;


  var maxUStreamPages = parseInt(process.env.MAX_USTREAM_PAGES) || parseInt(Meteor.settings.MAX_USTREAM_PAGES) || 999999999999;

  var ustreamInsertCallback = function(error, result, page, cb){
    console.log('Received ustream response for page: ' + page);

    if(error){
      allUStreamsLoaded = true;
      console.log('Error returned from ustream on page: ' + localCurrentPage)
      return cb();
    }

    if(!result.items || !result.items.length){
      allUStreamsLoaded = true;
      numUStreamPagesGuesses.push(page - 1);
      return cb();
    }
    Streams.batchInsert(_.map(result.items, function(doc) {

      return _.extend(doc, {
        _source: 'ustream',
        username: doc.user.userName,
        currentViewers: parseInt(doc.viewersNow),
        totalViews: parseInt(doc.totalViews)
      });
    }));

    console.log('Added ustreams to database for page: ' + page);
    return cb();
  };


  var numAsyncUStreamPages = Math.min(numUStreamPagesGuess, maxUStreamPages);
  var waitBetweenUStreamCalls = 10; // ms
  var currentPage;
  console.log('Current guess for number of UStream pages: ' + numUStreamPagesGuess);
  console.log('Begin async ustream calls')
  async.each(_.range(numAsyncUStreamPages), function(i, cb){
    Meteor.setTimeout(function(){
      currentPage = i+1;
      console.log('Async ustream call for page: ' + currentPage);
      var localCurrentPage = currentPage;

      Meteor.call('ustreamVideoSearchList', undefined, undefined, currentPage, function(err, result){
        try{
          ustreamInsertCallback(err, result, localCurrentPage, cb);
        } catch(err){
          console.log('Error in async ustream callback page: ' + localCurrentPage)
          console.error(err)
          return cb();
        }
      });
    }, waitBetweenUStreamCalls * i)
  }, function(err){
      console.log('Finish async ustream calls');
      if(err){
        finalCallback(err);
      } else {
        console.log('Begin sync ustream calls');
        currentPage += 1;

        while(!allUStreamsLoaded && currentPage <= maxUStreamPages){
          console.log('Sync ustream call for page: ' + currentPage);

          Meteor.call('ustreamVideoSearchList', undefined, undefined, currentPage, function(err, result){
            ustreamInsertCallback(err, result, currentPage, function(err){
              if(err){
                return finalCallback(err);
              }
            })
          });
          currentPage += 1;
        }
        if(allUStreamsLoaded){
          console.log("BBBBBBBB")
          console.log(numUStreamPagesGuesses)
          numUStreamPagesGuess = _.min(numUStreamPagesGuesses)
        } else {
          console.log("CCCCCCC")
          console.log(currentPage)
          numUStreamPagesGuess = currentPage - 1;
        }
        console.log('Finish sync ustream calls');
        console.log('UStream API calls complete!');
        console.log((currentPage - 1) + ' ustream pages loaded');


        Streams.remove({ current: true }); // remove previous batch
        Streams.update({} , { $set: {current: true  }}, {multi: true}); // recent batch is now loaded
        console.log('UStream results refreshed');
        return finalCallback();
      }
    }
  );

});

var updateStreamStatus = function(deepstream){
  // TODO track how many streams are live and update deepstream accordingly
  var ustream;
  _.each(deepstream.streams, function(stream){
    var streamSourceId = stream.reference.id;
    switch(stream.source){
      case 'ustream':
        console.log('check ustream')
        if(ustream = Streams.findOne({'id' : streamSourceId})){
          // TODO update views and such
          Deepstreams.update({_id: deepstream._id, 'streams.reference.id': streamSourceId}, {$set : {'streams.$.live': true}});
        } else {
          // TODO update views and such
          Deepstreams.update({_id: deepstream._id, 'streams.reference.id': streamSourceId}, {$set : {'streams.$.live': false}});
        }
        break;
      case 'bambuser':
        // TODO
        break;
      case 'youtube':
        console.log('check youtube')

        // TODO maybe only if we think youtube video is live
        // TODO check youtube videos at API and update with live or not live
        Meteor.call('youtubeVideoInfo', streamSourceId, function(err, data){  // TODO this request can be done in a batch for all youtube videos we have...
          if(err){
            throw(err);
          }
          var videos = data.items;
          var video = videos[0];
          console.log('youtube video info')
          console.log(streamSourceId)
          if(video){
            //console.log(video.snippet)
            if(video.snippet.liveBroadcastContent === 'live'){
              console.log('LIIIIIIVE')
              // TODO update views and such (statistis.viewCount)
              // and current viewers liveStreamingDetails.concurrentViewers
              // TODO, this line below shouldn't be necessary since youtube doesn't go live again after it's dead, we think...
              Deepstreams.update({_id: deepstream._id, 'streams.reference.id': streamSourceId}, {$set : {'streams.$.live': true}});

            } else {
              // TODO update views and such
              console.log('DEEEAAAADDD')
              Deepstreams.update({_id: deepstream._id, 'streams.reference.id': streamSourceId}, {$set : {'streams.$.live': false}});
            } // video isn't live
          } else { // video not found, so not live
            console.log('NOT FOUUUUUND')
            Deepstreams.update({_id: deepstream._id, 'streams.reference.id': streamSourceId}, {$set : {'streams.$.live': false}});
          }
        });
        break;

    }
  });
};

var updateStreamStatuses = function(){
  Deepstreams.find({}, {fields: {streams : 1}}).forEach(updateStreamStatus);
};

var updateDeepstreamStatuses = function(){

  // TODO only check active stream when in director mode
  // TODO restrict to published?

  var dsLive = Deepstreams.update({'streams.live': true}, {$set: {live: true}}, {multi: true});
  var dsDead = Deepstreams.update({'streams': {$not : {$elemMatch : {live: true}}}}, {$set: {live: false}}, {multi: true});

  console.log(dsLive + ' deepstreams are live');
  console.log(dsDead + ' deepstreams are dead');

};

var runJobs = function(){
  console.log('calllled run jobs')
  var startTime = Date.now();
  refreshUStreamDB();
  var ustreamRefreshTime = Date.now() - startTime;
  updateStreamStatuses();
  var streamUpdateTime = Date.now() - startTime - ustreamRefreshTime;
  updateDeepstreamStatuses();
  var deepstreamUpdateTime = Date.now() - startTime - streamUpdateTime - ustreamRefreshTime;


  console.log('ustream refresh time: ' + (ustreamRefreshTime / 1000) + ' seconds');
  console.log('stream update time: ' + (streamUpdateTime / 1000) + ' seconds');
  console.log('deepstream update time: ' + (deepstreamUpdateTime / 1000) + ' seconds');
  console.log('Total time to run jobs: ' + ((Date.now() - startTime) / 1000) + ' seconds');
  // ????findMoreRecentUStreamEmbedForDeadChannels????
  // ????findMoreRecentBambuserEmbedForDeadChannels????
};

var jobIntervalInSeconds = parseInt(process.env.JOB_INTERVAL) || 20; // default is every 10 minutes


Meteor.startup(function() {
  Meteor.setTimeout(function(){
    while(true){
      runJobs();
      Meteor._sleepForMs(jobIntervalInSeconds * 1000)
    }
  });
});

//if (process.env.PROCESS_TYPE === 'worker'){ // if a worker process
//  Meteor.startup(function() {
//    Meteor.setTimeout(function(){
//      while(true){
//        runJobs();
//        Meteor._sleepForMs(jobIntervalInSeconds * 1000)
//      }
//    });
//  });
//} else if (process.env.NODE_ENV === 'development'){ // however, in developement, run jobs on startup
//  Meteor.startup(function(){
//    Meteor.setTimeout(runJobs)
//  });
//}
