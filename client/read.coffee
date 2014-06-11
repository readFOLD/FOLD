Session.set('lastUpdate', new Date())

# TODO Remove this redunancy
Template.read.helpers
    storyTitle: -> Session.get('storyTitle')
    storyLoaded: -> 
        if Session.get("newStory") 
            true
        else
            Stories.findOne(_id: Session.get('storyId'))
    username: -> 
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name
    
    horizontalExists: ->
        currentVertical = Session.get('currentVertical')        
        Session.get('horizontalSections')[currentVertical]?.data.length > 1
