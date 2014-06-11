weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

formatDate = (date) ->
    hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
    weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms

Template.home.helpers
    profileImageExists: ->
        Meteor.user().profile.profile_picture
    profileImage: ->
        Meteor.user().profile.profile_picture
    user: -> Meteor.user()
    userId: -> Meteor.user()._id

Template.home.events
    "mouseenter div.filter": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        $(srcE).animate({height: "+=100"}, 250)
    "mouseleave div.filter": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        $(srcE).animate({height: "-=100"}, 250)    

Template.all_stories.helpers
    stories: -> 
        console.log(Stories.find(published: true).fetch())
        Stories.find(published: true)
    lastPublishDate: -> formatDate(@publishDate)
    displayName: -> 
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name
    previewContent: -> 
        @verticalSections[0]?.content

    # Remove this duplication
    profileImageExists: ->
        console.log(Meteor.user())
        Meteor.user().profile.profile_picture
    profileImage: ->
        Meteor.user().profile.profile_picture

    url: -> "/read/" + @_id

Template.user_stories.events
    "click div#delete": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        storyId = $(srcE).closest('div.story').data('story-id')
        Stories.remove(_id: storyId)