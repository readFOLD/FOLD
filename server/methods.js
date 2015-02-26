var GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;

if (!GOOGLE_API_SERVER_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}

Meteor.methods({
  youtubeVideoSearchList: function(query) {
    var res;
    check(query, String);
    this.unblock();
    requestParams = {
      part: 'snippet',
      q: query,
      maxResults: 10,
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
