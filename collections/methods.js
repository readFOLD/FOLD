(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var changeFavorite;

changeFavorite = function(storyId, toFavorite) {
  var operator, storyOperation, userOperation;
  check(storyId, String);
  this.unblock();
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to favorite a story');
  }
  operator = toFavorite ? '$addToSet' : '$pull';
  storyOperation = {};
  storyOperation[operator] = {
    favorited: this.userId
  };
  userOperation = {};
  userOperation[operator] = {
    'profile.favorites': storyId
  };
  Stories.update({
    _id: storyId
  }, storyOperation);
  return Meteor.users.update({
    _id: this.userId
  }, userOperation);
};

Meteor.methods({
  favoriteStory: function(storyId) {
    return changeFavorite.call(this, storyId, true);
  },
  unfavoriteStory: function(storyId) {
    return changeFavorite.call(this, storyId, false);
  },
  saveNewStory: function(story) {
    var storyPathSegment, user;
    user = Meteor.users.findOne({
      _id: this.userId
    });
    storyPathSegment = (story.title ? _s.slugify(story.title.toLowerCase()) : 'unpublished-story') + '-' + Random.id(3);
    story = _.omit(story, ['favorited', 'views', 'published']);
    _.extend(story, {
      lastSaved: new Date,
      userPathSegment: user.username,
      storyPathSegment: storyPathSegment,
      authorId: this.userId,
      authorName: user.profile.name || 'Anonymous'
    });
    Stories.insert(story);
    return story;
  }
});

})();

//# sourceMappingURL=methods.coffee.js.map
