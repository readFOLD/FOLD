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
  }

  if(!_.contains(stats.deepAnalytics[stat].uniqueViewersByIP, clientIP)){
    addToSet['deepAnalytics.' + stat + '.uniqueViewersByIP'] = clientIP ;
    inc['analytics.' + stat + '.byIP'] = 1;
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
  }
});
