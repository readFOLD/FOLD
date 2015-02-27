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
  updateStoryTitle: function(storyId, title){
    var storyPathSegment = _s.slugify(title.toLowerCase())+ '-' + Stories.findOne({_id: storyId}).shortId;
    return Stories.update({_id: storyId}, {$set: {'draftStory.title' : title, 'draftStory.storyPathSegment' : storyPathSegment }}, {removeEmptyStrings: false});
  },
  // TODO replace with specific methods
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
    if (setModifier = modifier.$set){
      console.log(_.pick(modifier.$set, 'draftStory.title'))
    }
    return Stories.update(selector, modifier, _.defaults(options || {}, {removeEmptyStrings: false}));
  },
  favoriteStory: function(storyId) {
    return changeFavorite.call(this, storyId, true);
  },
  unfavoriteStory: function(storyId) {
    return changeFavorite.call(this, storyId, false);
  },
  createStory: function() {
    var user = Meteor.users.findOne({ _id : this.userId });
    shortId = Random.id(8);
    return Stories.insert({
      lastSaved: new Date,
      userPathSegment: user.username,
      storyPathSegment: _s.slugify('new-story')+ '-' + shortId , // TODO DRY
      authorId: this.userId,
      authorName: user.profile.name || 'Anonymous',
      shortId: shortId
    });
  }
});
