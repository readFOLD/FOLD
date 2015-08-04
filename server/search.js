SearchSource.defineSource('streams', function(searchText) {
  var options = {limit: 20};


  if(searchText) {
    //var regExp = buildRegExp(searchText);
    //var selector = {$or: [
    //  {title: regExp},
    //  {description: regExp}
    //]};

    //console.log(Streams.find({ $text: { $search: 'ISS', $language: 'en' } }).fetch())
    //console.log(Streams.find({}).fetch())
    return(Streams.find({ $text: { $search: searchText, $language: 'en' } }).fetch())

    //return Streams.find(selector, options).fetch();
  } else {
    return Streams.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
