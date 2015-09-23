var TWITTER_API_KEY = process.env.TWITTER_API_KEY || Meteor.settings.TWITTER_API_KEY;
var TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || Meteor.settings.TWITTER_API_SECRET;

var Twit = Meteor.npmRequire('twit');

var makeTwitterCall = function (apiCall, params) {
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

Meteor.methods({
  updateInitialTwitterUserInfo: function (userInfo) {
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
  setBioFromTwitter: function () {
    var user = Meteor.user();
    if (user && user.profile && user.services.twitter) {
      var res;
      var twitterParams = {
        user_id: user.services.twitter.id
      };
      res = makeTwitterCall("users/show", twitterParams);

      var bio = res.description;

      if (bio) {
        return Meteor.users.update({
          _id: this.userId
        }, {
          $set: {
            "profile.bio": bio
          }
        });
      }
    }
  }
});
