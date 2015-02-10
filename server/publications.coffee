# Indexes
Stories._ensureIndex {userPathSegment: 1, storyPathSegment: 1}, unique: 1


Meteor.publish "exploreStoriesPub", (filter, category, skip) ->
  Stories.find {published: true}

Meteor.publish "ownStoriesPub", ->
  Stories.find { authorId: @userId }

Meteor.publish "readStoryPub", (userPathSegment, storyPathSegment) ->
  Stories.find {userPathSegment: userPathSegment, storyPathSegment: storyPathSegment, published: true}

Meteor.publish "readStoriesPub", (ids) ->
  Stories.find
    _id:
      $in: ids
    published: true
    # TODO only include some fields here and in other reads
      # fields:
      #   headerImageAttribution: 1
      #   verticalSections: 1
      #   horizontalSections: 1
      #   title: 1
      #   authorId: 1
      #   backgroundImage: 1
      #   storyPathSegment: 1
      #   username: 1

Meteor.publish "createStoryPub", (userPathSegment, storyPathSegment) ->
  Stories.find {userPathSegment: userPathSegment, storyPathSegment: storyPathSegment}

Meteor.publish "storiesPub", ->
  Stories.find()

Meteor.publish "contextBlocksPub", ->
  ContextBlocks.find()

Meteor.publish "publicUserPub", (id) ->
  Meteor.users.find {_id: id}, fields: 'profile.name': 1

# getProfilePicture = (options, user) ->
#     if options.profile
#         if user.services.google
#             options.profile.profile_picture = user.services.google.picture
#         if user.services.twitter
#             options.profile.profile_picture = user.services.twitter.profile_url

#         user.profile = options.profile
#     return user

# Accounts.onCreateUser(getProfilePicture)
