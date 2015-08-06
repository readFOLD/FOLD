SearchSource.defineSource('streams', function(searchText) {
  var options = {
    limit: 100,
    sort: {
      currentViewers: -1
    }
  };


  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {title: regExp},
      {description: regExp}
      //{ $text: { $search: searchText, $language: 'en' } }
    ]};

    //console.log(Streams.find({ $text: { $search: 'ISS', $language: 'en' } }).fetch())
    //console.log(Streams.find({}).fetch())
    //return(Streams.find(sel).fetch())

    return Streams.find(selector, options).fetch();
  } else {
    return Streams.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

// load UStreams into database
Meteor.startup(function(){
  Meteor.setTimeout(function(){

    Streams.remove({});

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
          currentViewers: parseInt(doc.viewersNow),
          totalViews: parseInt(doc.totalViews)
        });
        Streams.insert(doc);
      })

    }


    while(!allUStreamsLoaded && page <= maxUStreamPages){
      Meteor.call('ustreamVideoSearchList', undefined, undefined, page, ustreamInsertCallback);
      page += 1;
    };
  })

})
