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

this.Streams.remove({});

Meteor.call('ustreamVideoSearchList', function(error, result){
  if(error){
    throw error
  }

  if(!result.items || !result.items.length){
    throw 'no items!!'
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

});
