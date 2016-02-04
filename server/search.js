SearchSource.defineSource('stories', function(searchText, options) {
  options = options || {};
  _.defaults(options, {
    page: 0
  });
  var findOptions = {
    sort: [
      ["editorsPickAt", "desc"],
      ["favoritedTotal", "desc"],
      ["savedAt", "desc"]
    ],
    limit: PUB_SIZE * (options.page + 1),
    fields: previewStoryFields
  };

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [{title: regExp},{ keywords: regExp},{ authorName: regExp},{ authorDisplayUsername: regExp}],
      published: true
    };
    return Stories.find(selector, findOptions).fetch();
  } else {
    return []
  }
});

SearchSource.defineSource('people', function(searchText, options) {
  options = options || {};
  _.defaults(options, {
    page: 0
  });
  var findOptions = {
    sort: [
      ["followersTotal", "desc"],
      ["followingTotal", "desc"],
      ["favoritesTotal", "desc"],
      ["createdAt", "desc"]
    ],
    limit: 3 * (options.page + 1),
    fields: minimalUserFields
  };

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [{username: regExp},{ 'profile.name': regExp}]
    };
    return Meteor.users.find(selector, findOptions).fetch();
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
