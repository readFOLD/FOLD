var GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;
var SOUNDCLOUD_CLIENT_ID = Meteor.settings.SOUNDCLOUD_CLIENT_ID;
var IMGUR_CLIENT_ID = Meteor.settings.IMGUR_CLIENT_ID;
var FLICKR_API_KEY = Meteor.settings.FLICKR_API_KEY;
var GIPHY_API_KEY = Meteor.settings.GIPHY_API_KEY;
var TWITTER_API_KEY = process.env.TWITTER_API_KEY || Meteor.settings.TWITTER_API_KEY;
var TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || Meteor.settings.TWITTER_API_SECRET;
var EMBEDLY_KEY = Meteor.settings.EMBEDLY_KEY;
var VIMEO_API_KEY = Meteor.settings.VIMEO_API_KEY;
var VIMEO_API_SECRET = Meteor.settings.VIMEO_API_SECRET;
var VIMEO_ACCESS_TOKEN = Meteor.settings.VIMEO_ACCESS_TOKEN;

var Twit = Meteor.npmRequire('twit');
var Vimeo = Meteor.npmRequire('vimeo-api').Vimeo;

if (!GOOGLE_API_SERVER_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}

var decrementByOne = function(bigInt) {
    var intArr = bigInt.split("");
    if (intArr.length === 1) {
        return (intArr[0] -1).toString()
    }
    
    var result = [],
        borrow = 0;
    for (var i=intArr.length ; i--;) {
        var temp = intArr[i] - borrow - (i === intArr.length -1 ? 1 :0) ;
        borrow = temp < 0 ? 1 : 0;
        result.unshift(((borrow * 10) + temp).toString());
    }
    return result.join("")
};

var makeTwitterCall = function(apiCall, params) {
  var res;
  var user = Meteor.user();
  var client = new Twit({
    consumer_key: TWITTER_API_KEY,
    consumer_secret: TWITTER_API_SECRET,
    access_token: user.services.twitter.accessToken,
    access_token_secret: user.services.twitter.accessTokenSecret
  });

  var twitterResultsSync = Meteor.wrapAsync(client.get, client);
  try {
    res = twitterResultsSync(apiCall, params);
  } 
  catch (err) {
    if (err.statusCode !== 404) { 
      throw err;
    }  
    res = {};  
  }
  return res;
};

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
  updateInitialTwitterUserInfo: function(userInfo) {
    check(userInfo, Object);

    var user = Meteor.user();
    if (!user.tempUsername) {
      return
    }
    var username = userInfo.username,
        email = userInfo.email;

    if (!email){
      throw new Meteor.Error('Please enter your email');
    }
    check(username, String);
    check(email, String);


    checkUserSignup(username, email);

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
          "emails": {  "address" : userInfo.email,  "verified" : false }
         }
      });
  },
  setBioFromTwitter: function() {
    var user = Meteor.user();
    if (user && user.profile && user.services.twitter) {
      var res;
      var twitterParams = {
          user_id: user.services.twitter.id
        };
      res = makeTwitterCall("users/show", twitterParams);

      var bio = res.description;

      if (bio){
        return Meteor.users.update({
          _id: this.userId
        }, {
          $set: {
            "profile.bio": bio
          }
        });
      }
    }
  },
  countStoryView: function(storyId) {
    this.unblock();
    check(storyId, String);
    countStat.call(this, storyId, 'views');
  },
  countStoryShare: function(storyId, service) {
    this.unblock();
    check(storyId, String);
    countStat.call(this, storyId, 'shares', {service: service});
  }
});
