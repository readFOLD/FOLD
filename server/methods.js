var countStat = function(streamId, stat, details) {

  var connectionId = this.connection.id;
  var clientIP = this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;

  var story = Deepstreams.findOne({_id: streamId, onAir: true});

  if (!story){
    throw new Meteor.error('Deepstream not found for count ' + stat + ': ' + streamId); // this mostly confirms the stream has been published
  }

  var stats = DeepstreamStats.findOne({streamId: streamId}, {fields: {all: 0}});

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

  Deepstreams.update( {_id: streamId}, {$inc: inc });
  DeepstreamStats.upsert( {streamId: streamId} , {$inc: inc, $addToSet: addToSet, $push: push} );
};

Meteor.methods({
  countStoryView: function(streamId) {
    this.unblock();
    check(streamId, String);
    countStat.call(this, streamId, 'views');
  },
  countStoryShare: function(streamId, service) {
    this.unblock();
    check(streamId, String);
    countStat.call(this, streamId, 'shares', {service: service});
  },
  updateInitialTwitterUserInfoIncludingSignupCode: function (userInfo) {
    check(userInfo, Object);

    var user = Meteor.user();
    if (!user.tempUsername) {
      return
    }
    var username = userInfo.username,
      email = userInfo.email;

    if (!email) {
      throw new Meteor.Error('Please enter your email');
    }
    check(username, String);
    check(email, String);


    checkUserSignup(username, email);
    checkSignupCode(userInfo.signupCode);

    //get twitter info
    var res;
    if (user.services.twitter) {
      var twitterParams = {
        user_id: user.services.twitter.id
      };
      try {
        res = makeTwitterCall("users/show", twitterParams);
      }
      catch (err) {
        res = {};
      }
    }

    var bio = (res && res.description) ? res.description : "";

    return Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        "profile.name": userInfo.name || username,
        "displayUsername": username,
        "username": username,
        "profile.bio": bio
      },
      $unset: {"tempUsername": ""},
      $push: {
        "emails": {"address": userInfo.email, "verified": false}
      }
    });
  },
});
