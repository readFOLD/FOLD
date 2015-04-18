Stories._ensureIndex({
  shortId: 1
}, {
  unique: 1
});

Meteor.publish("exploreStoriesPub", function(filter, category, skip) {

  if (this.userId) { // TODO launch Remove

    return Stories.find({
      published: true
    }, {
      fields: {
        draftStory: 0,
        history: 0
      }
    });
  } else {
    this.ready()
  }
});

Meteor.publish("readStoryPub", function(userPathSegment, shortId) {
  if (this.userId) { // TODO launch Remove
    return Stories.find({
      userPathSegment: userPathSegment,
      shortId: shortId,
      published: true
    }, {
      fields: {
        draftStory: 0,
        history: 0
      }
    });
  } else {
    this.ready();
  }
});

Meteor.publish("readStoriesPub", function(ids) {
  if (this.userId) { // TODO launch Remove
    return Stories.find({
      _id: {
        $in: ids
      },
      published: true
    }, {
      fields: {
        draftStory: 0,
        history: 0
      }
    });
  } else {
    this.ready();
  }
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
  return ContextBlocks.find({},{
    fields : {
      fullDetails: 0
    }
  });
});

Meteor.publish("minimalUsersPub", function(userIds) { // includes user profile and published stories
  return Meteor.users.find({_id: {
    $in: userIds
  }}, {
    fields: {
      "profile.profilePicture": 1,
      "username": 1,
      "services.twitter.id": 1
    }
  });
});

Meteor.publish("userProfilePub", function(username) { // includes user profile and published stories

  userCursor = Meteor.users.find({
    username: username.toLowerCase()
  }, {
    fields: {
      "profile" : 1,
      "username" : 1,
      "services.twitter.id": 1
    }
  });

  var user = userCursor.fetch()[0];

  if (!user){
    return this.ready();
  }

  var userFavorites = user.profile.favorites;
  return [
    userCursor,
    Stories.find({
      _id: {
        $in: userFavorites
      },
      published: true
    }, {
      fields : {
        history: 0,
        draftStory: 0
      }
  })]
});

Meteor.publish("userStoriesPub", function(username) { // only published stories
  // TODO simplify once stories have author username on them
  var user = Meteor.users.findOne({
    username: username.toLowerCase()
  });

  if (!user) {
    return this.ready();
  }

  var userId = user._id;

  return Stories.find({
    authorId: userId,
    published: true
  },{
    fields : {
      history: 0,
      draftStory: 0
    }
  });
});

Meteor.publish("myStoriesPub", function() {
  if (this.userId) {
    return Stories.find({
      authorId: this.userId
    }, {
      fields: {
        history: 0
      }
    });
  } else {
    return this.ready();
  }
});

Meteor.publish("tempUsernamePub", function() {
  if (this.userId) {
    return Meteor.users.find(this.userId, {
      fields: {
        'tempUsername': 1
      }
    });
  } else {
    this.ready();
  }
});

// this publishes info one server facts (used on /stats page)
Facts.setUserIdFilter(function (userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.admin;
});
