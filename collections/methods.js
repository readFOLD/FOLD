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

var checkOwner = function(userId, doc) {
  return userId && userId === doc.authorId;
};

Meteor.methods({
  // TODO PREVENT FROM SAVING OTHER WAYS
  saveStory: function(selector, modifier, options) {
    console.log('saveStory!')
    //update: function(userId, doc, fieldNames) {
    //  var disallowedFields;
    //  disallowedFields = ['authorId', 'storyPathSegment', 'userPathSegment', 'favorited'];
    //  if (_.intersection(fieldNames, disallowedFields).length) {
    //    return false;
    //  }
    //  return checkOwner(userId, doc);
    //}
  //  if (titleField.isSet){
  //  return _s.slugify(titleField.value.toLowerCase())+ '-' + this.docId;
  //} else {
  //}
    return Stories.update(selector, modifier, _.defaults(options || {}, {removeEmptyStrings: false}));
  },
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
    story = _.omit(story, ['favorited', 'views', 'published']);
    _.extend(story, {
      lastSaved: new Date,
      userPathSegment: user.username,
      authorId: this.userId,
      authorName: user.profile.name || 'Anonymous'
    });
    Stories.insert(story);
    return story;
  }
});
