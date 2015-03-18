var GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;
var SOUNDCLOUD_CLIENT_ID = Meteor.settings.SOUNDCLOUD_CLIENT_ID;
var IMGUR_CLIENT_ID = Meteor.settings.IMGUR_CLIENT_ID;
var FLICKR_API_KEY = Meteor.settings.FLICKR_API_KEY;
var TWITTER_API_KEY = process.env.TWITTER_API_KEY || Meteor.settings.TWITTER_API_KEY;
var TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || Meteor.settings.TWITTER_API_SECRET;

var Twit = Meteor.npmRequire('twit');


if (!GOOGLE_API_SERVER_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}


S3.config = {
  key: Meteor.settings.AWS_ACCESS_KEY,
  secret: Meteor.settings.AWS_SECRET_KEY,
  bucket: Meteor.settings["public"].AWS_BUCKET
};

Meteor.methods({
  updateUserInfo: function(userInfo) {
    if (Meteor.user().tempUsername) {
      var username = userInfo.username;
      checkSignupCode(userInfo.signupCode);
      checkUsername(username);
      return Meteor.users.update({
        _id: this.userId
      }, {
          $set: {
            "profile.name": userInfo.name || username,
            "profile.displayUsername": username, // this will keep caps
            "username": username
          },
          $unset: {"tempUsername": ""},
          $push: {
            "emails": {  "address" : userInfo.email,  "verified" : false }
           }
        });
    }
  },

  ///////////////////////////////////
  /////// SEARCH API METHODS ///////
  //////////////////////////////////
  /*

  input: (query, option, page (optional))
  output: {items: [..], nextPage: any constant value})

  */
  flickrImageSearchList: function(query, option, page) {
    check(query, String);
    page = page || 1;  // flickr starts from 1
    this.unblock();

    var url = "https://api.flickr.com/services/rest/?&method=flickr.photos.search";

    var requestParams = {
      tags: query.replace(' ', ','),
      text: query,
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
      'items': items,
      'nextPage': page + 1
    };
  },
  imgurImageSearchList: function(query, option, page) {
    var res;
    check(query, String);
    this.unblock();
    page = page || 0;

    var authorizationStr = "Client-ID " + IMGUR_CLIENT_ID;

    var items = [];

    if (query.indexOf('imgur.com') !==-1) { // if paste in an image link, just grab it
      var id = _.chain(query.split('/')).compact().last().value().split('.')[0]; // if it's a url just send the final path segment without any extension;
      try{
        res = HTTP.get("https://api.imgur.com/3/image/" + id, {
          headers: {"Content-Type": "text", "Authorization": authorizationStr}
        });
      } catch (err) {
        if(!err.response || err.response.statusCode !== 404) { // swallow 404's, rethrow others
          throw err;
        }
      }
      if (res.data && res.data.data){
        items[0] = res.data.data;
      }
    }


    requestParams = {
      q: query
    };


    var url = 'https://api.imgur.com/3/gallery/search/top/' + page;
    // https://api.imgur.com/endpoints/gallery
    var res = HTTP.get(url, {
      params: requestParams,
      headers: {"Content-Type": "text", "Authorization": authorizationStr}
    });

    return {
      nextPage: page + 1,
      items: items.concat(_.filter(res.data.data, function(e) {
        return (e.type && e.type.indexOf('image') === 0)
      }))
    }
  }, 
  giphyGifSearchList: function(query, option, page) {
    var res;
    check(query, String);
    this.unblock();
    page = page || 0;
    requestParams = {
      q: query,
      api_key: 'dc6zaTOxFJmzC',
      offset: page,
      limit: 50
    };

    var res = HTTP.get('http://api.giphy.com/v1/gifs/search', {
      params: requestParams
    });

    var data = res.data;

    var totalCount = data.pagination.total_count;
    var nextPage = data.pagination.count + data.pagination.offset;

    if (nextPage >= totalCount){
      nextPage = 'end';
    }

    return {
      nextPage: nextPage,
      items: data.data
    }
  },
  soundcloudAudioSearchList: function(query, option, page) {
    var res;
    check(query, String);
    this.unblock();
    var offset = page || 0;
    var limit = 50;
    requestParams = {
      q: query,
      limit: limit,
      offset: offset,
      client_id: SOUNDCLOUD_CLIENT_ID
    };

    res = HTTP.get('http://api.soundcloud.com/tracks.json', {
      params: requestParams
    });

    var items = JSON.parse(res.content);

    return {
      'nextPage': offset + limit,
      'items': items
    }
  },
  twitterSearchList: function(query, option, page) {
    var res;
    var items;

    check(query, String);
    this.unblock();
    count = 15;
    var api = {
      'all' : "search/tweets",
      'user' : 'statuses/user_timeline',
      'favorites' : 'favorites/list'
    };
    
    var client = new Twit({
      consumer_key: TWITTER_API_KEY,
      consumer_secret: TWITTER_API_SECRET,
      access_token: Meteor.user().services.twitter.accessToken,
      access_token_secret: Meteor.user().services.twitter.accessTokenSecret,
    });
    var twitterResultsSync = Meteor.wrapAsync(client.get, client);

    params = {count: count};
    if (page) {params.max_id = page;}

    if (option === 'all') {
      params.q = query;
      try {
        res = twitterResultsSync(api[option], params);  
        page = res.search_metadata.next_results.match(/\d+/)[0];
        items = res.statuses;
      } catch(error) {
        items = [];
      }
    } else {
      params.screen_name = query;
      try {
        items = twitterResultsSync(api[option], params);
        var idString = items[items.length-1].id_str
        var start = idString.substring(0, idString.length-9);
        var end = idString.substring(idString.length-9);
        var newEnd = parseInt(end) -1;
        page = start + newEnd.toString();
      } catch(error) {
        items = [];
      }
    }


    if (!items.length){
      page = "end";
    }

    searchResults = {
      nextPage: page,
      items: items
    };

    return searchResults;
  },
  youtubeVideoSearchList: function(query, option, page) {
    var res;
    check(query, String);
    this.unblock();
    requestParams = {
      part: 'snippet',
      q: query,
      maxResults: 50,
      key: GOOGLE_API_SERVER_KEY
    };
    if (page) {
      requestParams['pageToken'] = page;
    }
    res = HTTP.get('https://www.googleapis.com/youtube/v3/search', {
      params: requestParams
    });

    nextPageToken = res.data.nextPageToken || 'end';

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
      'nextPage': nextPageToken,
      'items': items
    }
  }
});
