var GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;
var IMGUR_CLIENT_ID = Meteor.settings.IMGUR_CLIENT_ID;
var FLICKR_API_KEY = Meteor.settings.FLICKR_API_KEY;
var TWITTER_API_KEY = Meteor.settings.TWITTER_API_KEY;
var TWITTER_API_SECRET = Meteor.settings.TWITTER_API_SECRET;

var Twit = Meteor.npmRequire('twit');

if (!GOOGLE_API_SERVER_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}


Meteor.methods({
   twitterTweetSearchList: function() {
    var client = new Twit({
      consumer_key: TWITTER_API_KEY,
      consumer_secret: TWITTER_API_SECRET,
      access_token: '77660191-kyOfXkCC9tdLwj6CHRixXBA0Km3HeSThz30OfWgsk',
      access_token_secret: "zmBzEBHBDUX1ky3sZdmVrxbora71kQaFt1OUz0nr76jsv"
    });
    console.log(client);
    var params = {screen_name: 'readFold'};
    
    Meteor.wrapAsync(client.get('statuses/user_timeline', params, function(error, tweets, response){
      if (!error) {
        console.log(tweets);
      }
    }));
  },
  updateUserInfo: function(user_info) {
    if (Meteor.user().tempUsername) {
      return Meteor.users.update({
        _id: this.userId
      }, {
          $set: {
            "profile.name": user_info.name,
            "username": user_info.username,
          },
          $unset: {"tempUsername": ""},
          $push: {
            "emails": {  "address" : user_info.email,  "verified" : false }
           }
        });
    }
  },
  flickrImageSearchList: function(params) {
    check(params.q, String);
    var page = params.page + 1;  // flickr starts from 1
    this.unblock();

    var url = "https://api.flickr.com/services/rest/?&method=flickr.photos.search";

    var requestParams = {
      tags: params.q.replace(' ', ','),
      text: params.q,
      api_key: FLICKR_API_KEY,
      format: 'json',
      privacy_filter: 1,
      media: 'photos',
      nojsoncallback: 1,
      sort: 'relevance',
      license: '1,2,3,4,5,6,7,8',
      per_page: 200,
      page: page
    };

    var res = HTTP.get(url, {
      params: requestParams
    });
    var items = JSON.parse(res.content).photos.photo;

    return {
      'items': items
    };
  },
  imgurImageSearchList: function(params) {
    var res;
    check(params.q, String);
    var page = params.page;
    this.unblock();
    requestParams = {
      q: params.q
    };

    var authorizationStr = "Client-ID " + IMGUR_CLIENT_ID;
    var url = 'https://api.imgur.com/3/gallery/search/top/' + page;
    // https://api.imgur.com/endpoints/gallery
    var res = HTTP.get(url, {
      params: requestParams,
      headers: {"Content-Type": "text", "Authorization": authorizationStr}
    });

    return {
      'items': res.data.data
    }
  },
  youtubeVideoSearchList: function(params) {
    var res;
    check(params.q, String);
    this.unblock();
    requestParams = {
      part: 'snippet',
      q: params.q,
      maxResults: 50,
      key: GOOGLE_API_SERVER_KEY
    };
    if (params['pageToken']) {
      requestParams['pageToken'] = params['pageToken'];
    }
    res = HTTP.get('https://www.googleapis.com/youtube/v3/search', {
      params: requestParams
    });

    nextPageToken = res.data.nextPageToken;

    items = _.chain(res.data.items)
    .filter(function(element) {
      return element.id.videoId;
    })
    .map(function(element) {
      element.snippet.videoId = element.id.videoId; 
      return element.snippet;
    })
    .value();

    return {
      'nextPageToken': nextPageToken,
      'items': items
    }
  }
});
