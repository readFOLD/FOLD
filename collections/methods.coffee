changeFavorite = (storyId, toFavorite) -> # toFavorite is true of false
  check storyId, String
  @unblock()
  if not @userId
    throw new Meteor.Error 'not-logged-in', 'Sorry, you must be logged in to favorite a story'
  operator = if toFavorite then '$addToSet' else '$pull'
  storyOperation = {}
  storyOperation[operator] = favorited: @userId
  userOperation = {}
  userOperation[operator] = 'profile.favorites' : storyId
  Stories.update {_id: storyId}, storyOperation
  Meteor.users.update {_id: @userId}, userOperation

Meteor.methods
  favoriteStory: (storyId) ->
    changeFavorite.call this, storyId, true
  unfavoriteStory: (storyId) ->
    changeFavorite.call this, storyId, false
