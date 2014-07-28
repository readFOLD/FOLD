# Indexes
Stories._ensureIndex(storyDashTitle: 1)

Meteor.publish "exploreStoriesPub", (storyDashTitle, filter, category, skip) ->
	Stories.find({published: true})

Meteor.publish "readStoryPub", (storyDashTitle) ->
	Stories.find({storyDashTitle: storyDashTitle, published: true}, {fields: {verticalSections: 1, horizontalSections: 1, title: 1, userId: 1, backgroundImage: 1}})

Meteor.publish "createStoryPub", (storyDashTitle) ->
	Stories.find({storyDashTitle: storyDashTitle})

Meteor.publish "storiesPub", ->
	Stories.find()

Meteor.publish "usersPub", ->
    Meteor.users.find()

# getProfilePicture = (options, user) ->
#     if options.profile
#         if user.services.google
#             options.profile.profile_picture = user.services.google.picture
#         if user.services.twitter
#             options.profile.profile_picture = user.services.twitter.profile_url

#         user.profile = options.profile
#     return user

# Accounts.onCreateUser(getProfilePicture)