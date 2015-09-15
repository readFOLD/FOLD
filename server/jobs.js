var numUStreamPagesGuess = 60; // starting guess
var guessBias = 1;

var refreshUStreamDB = Meteor.wrapAsync(function(finalCallback){
  var numUStreamPagesGuesses = [];

  var allUStreamsLoaded = false;


  var maxUStreamPages = parseInt(process.env.MAX_USTREAM_PAGES) || parseInt(Meteor.settings.MAX_USTREAM_PAGES) || 999999999999;

  var ustreamInsertCallback = function(error, result, page, cb){
    console.log('Received ustream response for page: ' + page);

    if(error){
      allUStreamsLoaded = true;
      console.log('Error returned from ustream on page: ' + page);
      console.error(error);
      return cb();
    }

    if(!result.items || !result.items.length){
      allUStreamsLoaded = true;
      numUStreamPagesGuesses.push(page - 1 + guessBias);
      return cb();
    }
    Streams.batchInsert(_.map(result.items, function(doc) {

      return _.extend(doc, {
        _streamSource: 'ustream',
        username: doc.user.userName,
        currentViewers: parseInt(doc.viewersNow),
        totalViews: parseInt(doc.totalViews),
        live: true
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
          numUStreamPagesGuess = _.min(numUStreamPagesGuesses)
        } else {
          numUStreamPagesGuess = currentPage - 1;
        }
        console.log('Finish sync ustream calls');
        console.log('UStream API calls complete!');
        console.log((currentPage - 1) + ' ustream pages loaded');


        try{
          Streams.update({_streamSource: 'ustream'}, { $inc: {oneIfCurrent: 1 }}, {multi: true}); // recent batch is now loaded

          Streams.remove({_streamSource: 'ustream', oneIfCurrent: {$gt: 1 }}); // remove previous batch

        } catch (err) {
          finalCallback(err);
        }

        console.log('UStream results refreshed');
        return finalCallback();
      }
    }
  );

});

var numBambuserPagesGuess = 60; // starting guess


var refreshBambuserDB = Meteor.wrapAsync(function(finalCallback){
  var numUStreamPagesGuesses = [];

  var allUStreamsLoaded = false;


  var maxUStreamPages = parseInt(process.env.MAX_USTREAM_PAGES) || parseInt(Meteor.settings.MAX_USTREAM_PAGES) || 999999999999;

  var bambuserInsertCallback = function(error, result, page, cb){
    console.log('Received bambuser response for page: ' + page);

    if(error){
      allUStreamsLoaded = true;
      console.log('Error returned from bambuser on page: ' + page)
      console.error(error);
      return cb();
    }

    console.log(result)

    if(!result.items || !result.items.length){
      allUStreamsLoaded = true;
      numUStreamPagesGuesses.push(page - 1 + guessBias);
      return cb();
    }
    Streams.batchInsert(_.map(result.items, function(doc) {

      return _.extend(doc, {
        _streamSource: 'bambuser',
        username: doc.userName,
        //currentViewers: parseInt(doc.views), // no current viewers metric for bambuser
        totalViews: parseInt(doc.views_total),
        live: true
      });
    }));

    console.log('Added bambusers to database for page: ' + page);
    return cb();
  };


  var numAsyncUStreamPages = Math.min(numBambuserPagesGuess, maxUStreamPages);
  var waitBetweenUStreamCalls = 10; // ms
  var currentPage;
  console.log('Current guess for number of UStream pages: ' + numBambuserPagesGuess);
  console.log('Begin async bambuser calls')
  async.each(_.range(numAsyncUStreamPages), function(i, cb){
      Meteor.setTimeout(function(){
        currentPage = i;
        console.log('Async bambuser call for page: ' + currentPage);
        var localCurrentPage = currentPage;

        Meteor.call('bambuserVideoSearchList', undefined, undefined, currentPage, function(err, result){
          try{
            bambuserInsertCallback(err, result, localCurrentPage, cb);
          } catch(err){
            console.log('Error in async bambuser callback page: ' + localCurrentPage)
            console.error(err)
            return cb();
          }
        });
      }, waitBetweenUStreamCalls * i)
    }, function(err){
      console.log('Finish async bambuser calls');
      if(err){
        finalCallback(err);
      } else {
        console.log('Begin sync bambuser calls');
        currentPage += 1;

        while(!allUStreamsLoaded && currentPage < maxUStreamPages){
          console.log('Sync bambuser call for page: ' + currentPage);

          Meteor.call('bambuserVideoSearchList', undefined, undefined, currentPage, function(err, result){
            bambuserInsertCallback(err, result, currentPage, function(err){
              if(err){
                return finalCallback(err);
              }
            })
          });
          currentPage += 1;
        }
        if(allUStreamsLoaded){
          numBambuserPagesGuess = _.min(numUStreamPagesGuesses)
        } else {
          numBambuserPagesGuess = currentPage - 1;
        }
        console.log('Finish sync ustream calls');
        console.log('UStream API calls complete!');
        console.log((currentPage - 1) + ' ustream pages loaded');


        try{
          Streams.update({_streamSource: 'bambuser'}, { $inc: {oneIfCurrent: 1 }}, {multi: true}); // recent batch is now loaded

          Streams.remove({_streamSource: 'bambuser', oneIfCurrent: {$gt: 1 }}); // remove previous batch

        } catch (err) {
          finalCallback(err);
        }

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
  console.log('BABMUSER')
  refreshBambuserDB();
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

var jobWaitInSeconds = parseInt(process.env.JOB_WAIT) || 5 * 60; // default is every 5 minutes


if (process.env.PROCESS_TYPE === 'stream_worker'){ // if a worker process
  Meteor.startup(function() {
    Meteor.setTimeout(function(){
      while(true){
        runJobs();
        Meteor._sleepForMs(jobWaitInSeconds * 1000)
      }
    });
  });
} else if (process.env.NODE_ENV === 'development'){ // however, in developement, run jobs on startup
  Meteor.startup(function(){
    Meteor.setTimeout(runJobs)
  });
}
