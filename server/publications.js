Stories._ensureIndex({
  shortId: 1
}, {
  unique: 1
});

Meteor.publish("exploreStoriesPub", function(filter, category, skip) {
  return Stories.find({
    published: true
  },{
    fields : {
      draftStory: 0,
      history: 0
    }
  });
});

Meteor.publish("ownStoriesPub", function() {
  return Stories.find({
    authorId: this.userId
  });
});

Meteor.publish("readStoryPub", function(userPathSegment, shortId) {
  return Stories.find({
    userPathSegment: userPathSegment,
    shortId: shortId,
    published: true
  },{
    fields : {
      draftStory: 0,
      history: 0
    }
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

Meteor.publish("createStoryPub", function(userPathSegment, shortId) {
  return Stories.find({
    userPathSegment: userPathSegment,
    shortId: shortId
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

Meteor.publish("tempUsernamePub", function() {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                            {fields: {'tempUsername': 1,}});  
  } else {
    this.ready();
  }
});
