var GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;
var IMGUR_CLIENT_ID = Meteor.settings.IMGUR_CLIENT_ID;

if (!GOOGLE_API_SERVER_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}

Meteor.methods({
  imgurImageSearchList: function(params) {
    var res;
    check(params.q, String);
    this.unblock();
    requestParams = {
      q: params.q,
    };

    var authorizationStr = "Client-ID " + IMGUR_CLIENT_ID;
    // https://api.imgur.com/endpoints/gallery
    res = HTTP.get('https://api.imgur.com/3/gallery/search', {
      params: requestParams,
      headers: {"Content-Type": "text", "Authorization": authorizationStr}
    });
    console.log(res.data.data.length, "results for query", params.q)

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
      maxResults: 10,
      key: GOOGLE_API_SERVER_KEY,
    };
    if (params['pageToken']) {
      requestParams['pageToken'] = params['pageToken'];
    }
    res = HTTP.get('https://www.googleapis.com/youtube/v3/search', {
      params: requestParams
    });

    nextPageToken = res.data.nextPageToken;

    items = _.map(res.data.items, function(element) {
      element.snippet.videoId = element.id.videoId; //or playlistId
      return element.snippet;
    });

    return {
      'nextPageToken': nextPageToken,
      'items': items
    }
  }
});
