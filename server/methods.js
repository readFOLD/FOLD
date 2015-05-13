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
  },

  ///////////////////////////////////
  /////// SEARCH API METHODS ///////
  //////////////////////////////////
  /*

  input: (query, option, page (optional))
  output: {items: [..], nextPage: any constant value})

  */
  flickrImageSearchList: function(query, option, page) {
    var items, nextPage, linkSearch, path, requestParams;
    check(query, String);

    if ((query.indexOf('flickr.com') !==-1) && (query.indexOf('/photos/') !==-1)){
      //search photo: flickr.com/photos/{user-id}/{photo-id}/in/photolist-{search-info}
      //individual photo:  flickr.com/photos/{user-id}/{photo-id}
      var split = _.compact(query.split('/'));
      var offset = split.indexOf('photos');
      if (split[offset+2]) {
        var photo_id = (split[offset+2]).match(/[\d]*/)[0];
        linkSearch = true;
      } else {
        linkSearch = false;
      }
    } else if ((query.indexOf('flic.kr') !==-1) && (query.indexOf('/p/') !==-1)){
      //short url: https://flic.kr/p/{base58-photo-id}
      var photo_id = _.chain(query.split('/')).compact().last().value().match(/[\d\w]*/)[0];
      linkSearch = true;
    } else {
      linkSearch = false;
    }

    page = page || 1;  // flickr starts from 1
    this.unblock();

    if (linkSearch) {
      path = 'flickr.photos.getInfo';
      requestParams = {
        photo_id: photo_id,
        api_key: FLICKR_API_KEY,
        format: 'json',
        nojsoncallback: 1,
      };
    } else {
      path = 'flickr.photos.search';
      requestParams = {
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
        extras: ['owner_name', 'date_upload'],
        page: page
      };
    } 

    var url = "https://api.flickr.com/services/rest/?&method=" + path;

    var res = HTTP.get(url, {
      params: requestParams
    });

    if (res.data) {
      var results = res.data;
    }

    if (results && (results.photos)) {
      items = results.photos.photo;
    } else if (results && results.photo) {
      items = [results.photo];
    } else {
      items = []
    }
    
    if (items.length){
      nextPage = page + 1;
    } else {
      nextPage = 'end';
    }

    return {
      'items': items,
      'nextPage': nextPage
    };
  },
  imgurImageSearchList: function(query, option, page) {
    var res;
    var fullSearchItems
    check(query, String);
    this.unblock();
    var nextPage;
    page = page || 0;

    var authorizationStr = "Client-ID " + IMGUR_CLIENT_ID;

    var urlItems = [];

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
        urlItems[0] = res.data.data;
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

    if (res.data && res.data.data) {
      fullSearchItems = _.filter(res.data.data, function (e) {
        return (e.type && e.type.indexOf('image') === 0)
      });
      if (fullSearchItems.length) {
        nextPage = page + 1;
      } else {
        nextPage = 'end'
      }
    } else {
      fullSearchItems = []
    }

    if (!fullSearchItems.length){
      nextPage = 'end'
    }

    return {
      nextPage: nextPage,
      items: urlItems.concat(fullSearchItems)
    }
  },
  giphyGifSearchList: function(query, option, page) {
    var res;
    var items;
    var nextPage;
    check(query, String);
    this.unblock();
    page = page || 0;
    requestParams = {
      q: query,
      api_key: GIPHY_API_KEY,
      offset: page,
      limit: 50
    };

    var res = HTTP.get('http://api.giphy.com/v1/gifs/search', {
      params: requestParams
    });

    var data = res.data;

    if (data.data) {
      items = data.data;
    } else {
      items = [];
    }

    if (items.length && data.pagination){
      var totalCount = data.pagination.total_count;
      nextPage = data.pagination.count + data.pagination.offset;

      if (nextPage >= totalCount){
        nextPage = 'end';
      }
    } else {
      nextPage = 'end';
    }

    return {
      nextPage: nextPage,
      items: items
    }
  },
  soundcloudAudioSearchList: function(query, option, page) {
    var res;
    var items, nextPage, linkSearch, path, requestParams;
    check(query, String);

    if (query.indexOf('soundcloud.com') !==-1) {
      linkSearch = true;
    } else {
      linkSearch = false;
    }

    var offset = page || 0;
    var limit = 50;
    if (linkSearch) {
      path = 'resolve';
      requestParams = {
        url: query,
        client_id: SOUNDCLOUD_CLIENT_ID
      };
    } else {
      path = 'tracks';  
      requestParams = {
        q: query,
        limit: limit,
        offset: offset,
        client_id: SOUNDCLOUD_CLIENT_ID
      };

    }

    this.unblock();
  
    var res = HTTP.get('http://api.soundcloud.com/' + path + '.json', {
      params: requestParams
    });

    var results;
    if (res && res.data) {
      results = res.data.length ? res.data : [res.data];
      if (results && (results[0].kind === 'track')) {
        items = results;
      } else {
        items = [];
      }
    } else {
      items = [];
    }

    if (items.length) {
      nextPage = offset + limit;
    } else {
      nextPage = 'end';
    }
    
    return {
      'nextPage': nextPage,
      'items': items
    }
  },
  twitterSearchList: function(query, option, page) {
    var res;
    var items =[];
    var isId = false;

    check(query, String);
    if (query.indexOf('twitter.com') !==-1) {
      var newQuery = _.chain(query.split('/')).compact().last().value().match(/[\d\w_]*/)[0];
      query = newQuery || query;
      isId = (/^\d+$/).test(query);
    }
    this.unblock();
    count = 30;
    var api = {
      'all' : 'search/tweets',
      'all_url' : 'statuses/show', 
      'user' : 'statuses/user_timeline',
      'favorites' : 'favorites/list'
    };

    params = {count: count};
    if (page) {params['max_id'] = page;}
    if (option === 'all' && isId) {
      option = 'all_url';
      params['id'] = query;
    } else if (option === 'all') {
      params['q'] = query;
    } else {
      params['screen_name'] = query;
    }

    res = makeTwitterCall(api[option], params);

    if (option === 'all_url') {
      items[0] = res;
      page = "end";
    } else if (option === 'all') {
      items = res.statuses;
      page = res.search_metadata.next_results ? res.search_metadata.next_results.match(/\d+/)[0] : "end";
    } else if (res.length) {
      items = res;
      page = decrementByOne(items[items.length-1].id_str); 
    }

    searchResults = {
      nextPage: page,
      items: items
    };

    return searchResults;
  },
  embedlyEmbedResult: function(query) {
    var res, requestParams;
    check(query, String);
    this.unblock();

    requestParams = {
      url: query,
      key: EMBEDLY_KEY,
      maxheight: 300,
      maxwidth: 474
    };

    res = HTTP.get('http://api.embed.ly/1/oembed', {
      params: requestParams
    });
    return res.data;
  },
  vimeoVideoSearchList: function(query, option, page) {
    var items;
    var nextPage;
    var path = '/videos';
    check(query, String);
    if (query.indexOf('vimeo.com') !==-1) {
      var newQuery = _.chain(query.split('/')).compact().last().value().match(/[\d]*/)[0];
      path = path + '/' + newQuery;
    }

    this.unblock();
    page = page || 1;
    
    var client = new Vimeo(
      VIMEO_API_KEY,
      VIMEO_API_SECRET,
      VIMEO_ACCESS_TOKEN
    );

    var vimeoResultsSync = Meteor.wrapAsync(client.request, client);
    var params = {
      path: path,
      query: 
        { query: query,
          sort : 'relevant',
          page: page,
          per_page: 40
        }
      };

    try {
      res = vimeoResultsSync(params);
      items = res.data || [res];
    } 
    catch (err) {
      if (err.statusCode !== 404) { 
        throw err;
      }  
      items = [];    
    }

    if (items.length){
      nextPage = page + 1;
    } else {
      nextPage = 'end';
    }

    return {
      'items': items,
      'nextPage': nextPage
    };
  },
  youtubeVideoSearchList: function(query, option, page) {
    var res;
    var nextPageToken;
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

    items = _.chain(res.data.items)
      .filter(function(element) {
        return element.id.videoId;
      })
      .map(function(element) {
        element.snippet.videoId = element.id.videoId;
        return element.snippet;
      })
      .value();

    if (items.length){
      nextPageToken = res.data.nextPageToken || 'end';
    } else {
      nextPageToken = 'end';
    }

    return {
      'nextPage': nextPageToken,
      'items': items
    }
  }
});
