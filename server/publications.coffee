Meteor.publish "storiesPub", ->
    Stories.find()

Meteor.publish "usersPub", ->
    Meteor.users.find()

getProfilePicture = (options, user) ->
    if options.profile
        if user.services.google
            options.profile.profile_picture = user.services.google.picture
        if user.services.twitter
            options.profile.profile_picture = user.services.twitter.profile_url

        user.profile = options.profile
    return user

Accounts.onCreateUser(getProfilePicture)