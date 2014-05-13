Template.user_stories.helpers
    userStories: -> 
        console.log Stories.find(userId: Meteor.userId()).fetch()
        Stories.find(userId: Meteor.userId())
    lastEditDate: -> 
        @lastSaved
        # (@lastSaved.getMonth() + 1) + "/" + @lastSaved.getDate() + "/" + @lastSaved.getFullYear()
    url: -> "/create/" + @_id

Template.user_stories.events
    "click div#delete": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        storyId = $(srcE).closest('div.story').data('story-id')
        Stories.remove(_id: storyId)