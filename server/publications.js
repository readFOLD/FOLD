Stories._ensureIndex({
  userPathSegment: 1,
  storyPathSegment: 1
}, {
  unique: 1
});

Meteor.publish("exploreStoriesPub", function(filter, category, skip) {
  return Stories.find({
    published: true
  });
});

Meteor.publish("ownStoriesPub", function() {
  return Stories.find({
    authorId: this.userId
  });
});

Meteor.publish("readStoryPub", function(userPathSegment, storyPathSegment) {
  return Stories.find({
    userPathSegment: userPathSegment,
    storyPathSegment: storyPathSegment,
    published: true
  });
});

Meteor.publish("readStoriesPub", function(ids) {
  return Stories.find({
    _id: {
      $in: ids
    },
    published: true
  });
});

Meteor.publish("createStoryPub", function(userPathSegment, storyPathSegment) {
  return Stories.find({
    userPathSegment: userPathSegment,
    storyPathSegment: storyPathSegment
  });
});

Meteor.publish("storiesPub", function() {
  return Stories.find();
});

Meteor.publish("contextBlocksPub", function() {
  return ContextBlocks.find();
});

Meteor.publish("publicUserPub", function(id) {
  return Meteor.users.find({
    _id: id
  }, {
    fields: {
      'profile.name': 1
    }
  });
});

