var GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;

if (!GOOGLE_API_SERVER_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}

Meteor.methods({
  youtubeVideoInfo: function(videoId) {
    var requestParams, res, _ref, _ref1;
    check(videoId, String);
    this.unblock(); 
    requestParams = {
      part: 'snippet',
      id: videoId,
      key: GOOGLE_API_SERVER_KEY
    };
    res = HTTP.get('https://www.googleapis.com/youtube/v3/videos', {
      params: requestParams
    });
    if (res.data && res.data.items && res.data.items.length)
      return res.data.items[0].snippet
  },

  youtubeVideoSearchList: function(query) {
    var res;
    check(query, String);
    this.unblock();
    requestParams = {
      part: 'snippet',
      q: query,
      maxResults: 3,
      key: GOOGLE_API_SERVER_KEY,
    };
    res = HTTP.get('https://www.googleapis.com/youtube/v3/search', {
      params: requestParams
    });
    
    return _.map(res.data.items, function(element) {
      element.snippet.videoId = element.id.videoId; //or playlistId
      return element.snippet;
    });
  }
});
