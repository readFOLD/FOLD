Stories._ensureIndex({
  shortId: 1
}, {
  unique: 1
});

Stories._ensureIndex({
  published: 1
});

Stories._ensureIndex({
  authorId: 1
});

ContextBlocks._ensureIndex({
  authorId: 1
});

StoryStats._ensureIndex({
  storyId: 1
});

Meteor.users._ensureIndex({
  username: 1
});

Meteor.publish("curatedStoriesPub", function() {
  return Stories.find({
    published: true,
    editorsPick: true
  }, {
    fields: {
      draftStory: 0,
      history: 0
    },
    sort: {
      editorsPickAt: -1
    },
    limit: 40 // initial limit
  });
});

Meteor.publish("newestStoriesPub", function() { // for now, it's just publishedAt (later should maybe be firstPublishedAt)
  return Stories.find({
    published: true
  }, {
    fields: {
      draftStory: 0,
      history: 0
    },
    sort: {
      publishedAt: -1
    },
    limit: 40 // initial limit
  });
});

Meteor.publish("trendingStoriesPub", function() { // for now, it's just the most views
  return Stories.find({
    published: true
  }, {
    fields: {
      draftStory: 0,
      history: 0
    },
    sort: {
      views: -1
    },
    limit: 40 // initial limit
  });
});

Meteor.publish("favoriteStoriesPub", function(ids) { // requires ids to be passed in
  return Stories.find({
    published: true,
    _id: { $in : ids }
  }, {
    fields: {
      draftStory: 0,
      history: 0
    },
    sort: {
      publishedAt: -1
    },
    limit: 100 // initial limit
  });
});

Meteor.publish("readStoryPub", function(userPathSegment, shortId) {
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
});

Meteor.publish("createStoryPub", function(userPathSegment, shortId) {
  return Stories.find({
    userPathSegment: userPathSegment,
    shortId: shortId
  }, {
    fields: {
      history: 0
    }
  });
});

Meteor.publish("contextBlocksPub", function(storyShortId) {
  if(!storyShortId || !this.userId){
    return this.ready();
  }
  return ContextBlocks.find({
    storyShortId: storyShortId,
    authorId: this.userId
  },{
    fields : {
      fullDetails: 0
    },
    limit: 1000
  });
});

Meteor.publish("minimalUsersPub", function(userIds) {
  if (!userIds || !userIds.length || userIds.length > 1000) {
    return this.ready();
  }
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
      "displayUsername" : 1,
      "services.twitter.id": 1
    }
  });

  var user = userCursor.fetch()[0];

  if (!user){
    return this.ready();
  }

  var userFavorites = user.profile.favorites || [];
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
      },
      limit: 100 // initial limit
  })]
});

Meteor.publish("userStoriesPub", function(username) { // only published stories
  if (!username) {
    return this.ready();
  }

  return Stories.find({
    authorUsername: username,
    published: true
  },{
    fields : {
      history: 0,
      draftStory: 0
    },
    limit: 100 // initial limit
  });
});

Meteor.publish("myStoriesPub", function() {
  if (this.userId) {
    return Stories.find({
      authorId: this.userId
    }, {
      fields: {
        history: 0
      },
      limit: 1000 // initial limit
    });
  } else {
    return this.ready();
  }
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
      {fields: {
        'accessPriority': 1,
        "services.twitter.id": 1,
        "displayUsername": 1,
        "admin": 1
      }});
  } else {
    this.ready();
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
