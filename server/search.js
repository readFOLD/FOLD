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
      {description: regExp},
      {username: regExp}
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
