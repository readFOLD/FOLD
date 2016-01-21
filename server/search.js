SearchSource.defineSource('stories', function(searchText, options) {
  var options = {
    sort: [
      ["editorsPickAt", "desc"],
      ["favoritedTotal", "desc"]
    ],
    limit: PUB_SIZE,
    fields: previewStoryFields
  };

  if(searchText) {
    Meteor._sleepForMs(500);
    var regExp = buildRegExp(searchText);
    var selector = {$or: [{title: regExp},{ keywords: regExp},{ authorName: regExp},{ authorDisplayUsername: regExp}],
      published: true
    };
    return Stories.find(selector, options).fetch();
  } else {
    return []
  }
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}
