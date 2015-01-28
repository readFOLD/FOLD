GOOGLE_API_SERVER_KEY = Meteor.settings.GOOGLE_API_SERVER_KEY

if not GOOGLE_API_SERVER_KEY
  console.error 'Settings must be loaded for apis to work'
  throw new Meteor.Error 'Settings must be loaded for apis to work'

# YoutubeApi.authenticate
#   type: 'key',
#   key: '@GOOGLE_API_SERVER_KEY'

# console.log YoutubeApi.videos

Meteor.methods
  youtubeVideoInfo: (videoId) ->
    check videoId, String
    @unblock()
    requestParams =
      part: 'snippet'
      id: videoId
      key: GOOGLE_API_SERVER_KEY
    res = HTTP.get 'https://www.googleapis.com/youtube/v3/videos', params: requestParams
    return res.data.items?[0]?.snippet
      # YoutubeApi.videos.list
      #   , (err, data) ->
      #     if err
      #       throw new Meteor.Error(err, "Youtube lookup error");
      #     else
      #       return data


