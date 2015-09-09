var refreshUStreamDB = function(){
  Streams.remove({}); // TODO don't erase db until new ones loaded

  var allUStreamsLoaded = false;

  var page = 1;

  var maxUStreamPages = parseInt(process.env.MAX_USTREAM_PAGES) || parseInt(Meteor.settings.MAX_USTREAM_PAGES) || 999999999999;

  var ustreamInsertCallback = function(error, result){
    if(error){
      allUStreamsLoaded = true;
      throw error
    }

    if(!result.items || !result.items.length){
      allUStreamsLoaded = true;
      console.log((page - 1) + ' ustream pages loaded');
      return
    }

    console.log('ustreams loaded')
    _.each(result.items, function(doc) {

      _.extend(doc, {
        _source: 'ustream',
        username: doc.user.userName,
        currentViewers: parseInt(doc.viewersNow),
        totalViews: parseInt(doc.totalViews)
      });
      Streams.insert(doc);
    })

  };


  while(!allUStreamsLoaded && page <= maxUStreamPages){
    Meteor.call('ustreamVideoSearchList', undefined, undefined, page, ustreamInsertCallback);
    page += 1;
  }
};

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

        // TODO maybe only if we think youtube video is live
        console.log('lalala')
        // TODO check youtube videos at API and update with live or not live
        Meteor.call('youtubeVideoInfo', streamSourceId, function(err, videos){  // TODO this request can be done in a batch for all youtube videos we have...
          if(err){
            throw(err) // TODO must this be in setTimeout??
          }
          var video = videos[0];
          if(video){
            if(video.snippet.liveBroadcastContent === 'live'){
              // TODO update views and such (statistis.viewCount)
              // and current viewers liveStreamingDetails.concurrentViewers
            } else {
              // TODO update views and such
              Deepstreams.update({_id: deepstream._id, 'streams.reference.id': streamSourceId}, {$set : {'streams.$.live': false}});
            } // video isn't live
          } else { // video not found, so not live
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

var runJobs = function(){
  refreshUStreamDB();
  updateStreamStatuses();
  // ????findMoreRecentUStreamEmbedForDeadChannels????
  // ????findMoreRecentBambuserEmbedForDeadChannels????
};

var jobIntervalInSeconds = parseInt(process.env.JOB_INTERVAL) || 10 * 60; // default is every 10 minutes

if (process.env.PROCESS_TYPE === 'worker'){ // if a worker process
  Meteor.startup(function() {
    Meteor.setTimeout(runJobs, 0); // run jobs immediately
    Meteor.setInterval(runJobs, jobIntervalInSeconds * 1000); // then run them at interval
  });
} else if (process.env.NODE_ENV === 'development'){ // however, in developement, run jobs on startup
  Meteor.startup(function(){
    Meteor.setTimeout(runJobs)
  });
}
