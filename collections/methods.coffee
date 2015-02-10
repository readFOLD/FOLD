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
  saveNewStory: (story) ->
    user = (Meteor.users.findOne _id: @userId)

    storyPathSegment = (if story.title then (_s.slugify story.title.toLowerCase()) else 'unpublished-story') +
        '-' + Random.id(3)

    # remove properties that should not get set by user
    story = _.omit story, [
      'favorited',
      'views',
      'published'
    ]

    _.extend story,
      lastSaved : new Date
      userPathSegment : user.username
      storyPathSegment : storyPathSegment
      authorId : @userId
      authorName : user.profile.name or 'Anonymous'



    Stories.insert story

    return story