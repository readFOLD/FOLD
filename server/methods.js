var countStat = function(storyId, stat, details) {

  var connectionId = this.connection.id;
  var clientIP = this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;

  var story = Stories.findOne({_id: storyId, published: true});

  if (!story){
    throw new Meteor.error('Story not found for count ' + stat + ': ' + storyId); // this mostly confirms the story has been published
  }

  var stats = StoryStats.findOne({storyId: storyId}, {fields: {all: 0}});

  if(!stats){
    stats = {};
  }

  if (!stats.deepAnalytics){
    stats.deepAnalytics= {};
  }

  if (!stats.deepAnalytics[stat]){
    stats.deepAnalytics[stat] = {};
  }

  var addToSet = {};
  var inc = {};
  inc['analytics.' + stat + '.total'] = 1;

  if(!_.contains(stats.deepAnalytics[stat].uniqueViewersByConnection, connectionId)){
    addToSet['deepAnalytics.' + stat + '.uniqueViewersByConnection'] = connectionId ;
    inc['analytics.' + stat + '.byConnection'] = 1;
    if(stat === 'shares'){
      generateShareActivity(story._id, details.service);
    }
  }

  if(!_.contains(stats.deepAnalytics[stat].uniqueViewersByIP, clientIP)){
    addToSet['deepAnalytics.' + stat + '.uniqueViewersByIP'] = clientIP ;
    inc['analytics.' + stat + '.byIP'] = 1;
    if((stat === 'views') && stats.analytics && stats.analytics.views){
      var uniqueViews = stats.analytics.views.byIP + 1;
      console.log(uniqueViews)
      if(_.contains(VIEW_THRESHOLDS, uniqueViews)){
        generateViewThresholdActivity(story._id, uniqueViews);
      }
    }
  }

  if (this.userId && !_.contains(stats.deepAnalytics[stat].uniqueViewersByUserId, this.userId)){
    addToSet['deepAnalytics.' + stat + '.uniqueViewersByUserId'] = this.userId ;
    inc['analytics.' + stat + '.byId'] = 1;
  }

  var push = {};

  var fullData =  _.extend({}, _.omit(this.connection, ['close', 'onClose']), {date: new Date});

  if (this.userId){
    _.extend(fullData, {
      userId: this.userId,
      username: Meteor.user().username
    });
  };
  if (details){
    _.extend(fullData, details);
  };

  push['deepAnalytics.' + stat + '.all'] = fullData;

  Stories.update( {_id: storyId}, {$inc: inc });
  StoryStats.upsert( {storyId: storyId} , {$inc: inc, $addToSet: addToSet, $push: push} );
};

Meteor.methods({
  countStoryView: function(storyId) {
    this.unblock();
    check(storyId, String);
    countStat.call(this, storyId, 'views');
  },
  countStoryShare: function(storyId, service) {
    this.unblock();
    check(storyId, String);
    countStat.call(this, storyId, 'shares', {service: service});
  },
  countStoryRead: function(storyId, service) {
    this.unblock();
    check(storyId, String);
    countStat.call(this, storyId, 'reads', {service: service});
  },
  countStoryActiveHeartbeats: function(storyId, countMap) {
    this.unblock();
    check(storyId, String);
    check(countMap, Object);
    _.keys(countMap, function (e) {
      check(e, String); // these should be ids
      check(e, Match.Where(function (str) {
        return (/^[^.]*$/).test(str); // check has no periods
      }))
    });
    _.values(countMap, function (e) {
      check(e, Number);
    });

    var incMap = {};
    _.each(_.keys(countMap), function (k) {
      incMap['analytics.heartbeats.active.' + k] = countMap[k];
    });

    StoryStats.upsert({storyId: storyId}, {$inc: incMap});
    return Stories.update({_id: storyId}, {$inc: incMap});
  },
  impersonate: function(username) {
    check(username, String);

    var user = Meteor.user();
    if (!user || !user.admin || !user.privileges || !user.privileges.impersonation){
      throw new Meteor.Error(403, 'Permission denied');
    }

    var otherUser;
    if (!(otherUser = Meteor.users.findOne({username: username}))){
      throw new Meteor.Error(404, 'User not found');
    }

    this.setUserId(otherUser._id);
    return otherUser._id
  },
  getActivityFeed: function(aId){
    check(aId, Match.Optional(String));
    if(!this.userId){
      throw new Meteor.Error("Only users may get their activity feed");
    }

    var query = aId ? {uId: this.userId, aId: aId} : {uId: this.userId};

    var activityIds = ActivityFeedItems.find(query, {sort:{r: -1}, limit: 50, fields: {'aId' : 1}}).map(function(i){return i.aId});
    return Activities.find({_id: {$in: activityIds}}).fetch();
  }
});
