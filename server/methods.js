(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var GOOGLE_API_SERVER_KEY;

GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY;

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
    return (_ref = res.data.items) != null ? (_ref1 = _ref[0]) != null ? _ref1.snippet : void 0 : void 0;
  }
});

})();

//# sourceMappingURL=methods.coffee.js.map
