ContextBlocks._ensureIndex({
  authorId: 1
});

ContextBlocks._ensureIndex({
  storyShortId:1
});

StoryStats._ensureIndex({
  storyId: 1
});

ActivityFeedItems._ensureIndex({
  uId: 1
});

Meteor.users._ensureIndex({
  username: 1
});


minimalUserFields = {
    "profile": 1,
    "username": 1,
    displayUsername: 1,
    "services.twitter.id": 1,
    "followersTotal": 1,
    "followingTotal": 1
};



Meteor.publish("contextBlocksPub", function(storyShortId) {
  if(!storyShortId || !this.userId){
    return this.ready();
  }
  return ContextBlocks.find({
    storyShortId: storyShortId,
    authorId: this.userId,
    deleted: {$ne: true}
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
    fields: minimalUserFields
  });
});

Meteor.publish("adminOtherUserPub", function(userId) {
  if (!userId || !this.userId || !Meteor.users.findOne(this.userId).admin) {
    return this.ready();
  }
  return Meteor.users.find({ _id: userId }, {
    fields: {
      "profile": 1,
      "username": 1,
      "services.twitter.id": 1,
      "services.twitter.screenName": 1,
      "emails.address": 1
    },
    limit: 1
  });
});

Meteor.publish("adminMostFavoritesUsersPub", function() {
  if (!this.userId || !Meteor.users.findOne(this.userId).admin) {
    return this.ready();
  }
  return Meteor.users.find({ $where: "this.profile.favorites && this.profile.favorites.length > 5"}, {
    fields: {
      "services.twitter.screenName": 1,
      "emails.address": 1,
      "profile": 1
    }
  });
});

Meteor.publish("adminContextBlocksPub", function(storyShortId) {
  if(!storyShortId || !this.userId || !Meteor.users.findOne(this.userId).admin){
    return this.ready();
  }

  return ContextBlocks.find({
    storyShortId: storyShortId,
    deleted: {$ne: true}
  },{
    fields : {
      fullDetails: 0
    },
    limit: 1000
  });
});



Meteor.publish("adminRecentActivitiesPub", function(options) {


  options = options || {};
  options.more = options.more || 0;

  if(!this.userId || !Meteor.users.findOne(this.userId).admin){
    return this.ready();
  }

  return Activities.find({}, {
    sort: {
      published: -1
    },
    limit: 250 * Math.pow(2, options.more)
  });
});


Meteor.publish("userProfilePub", function(username) { // includes user profile and favorited stories

  var userCursor = Meteor.users.find({
    username: username.toLowerCase()
  }, {
    fields: {
      "profile" : 1,
      "username" : 1,
      "displayUsername" : 1,
      "services.twitter.id": 1,
      "followers": 1,
      "followingTotal": 1,
      "followersTotal": 1,
      "favoritesTotal": 1
    },
    limit: 1
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
      fields : previewStoryFields,
      limit: 100 // initial limit
  })]
});


Meteor.publish("activityFeedItemsPub", function() {
  if (this.userId) {
    return ActivityFeedItems.find({
      uId: this.userId
    }, {
      limit: 50,
      sort: {
        r: -1
      }
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
        'tempUsername': 1,
        "admin": 1,
        "privileges": 1,
        "profile": 1,
        "followers": 1
      },
      limit: 1
      });
  } else {
    this.ready();
  }
});


// this publishes info on server facts (used on /stats page)
Facts.setUserIdFilter(function (userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.admin;
});
