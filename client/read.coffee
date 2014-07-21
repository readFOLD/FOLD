
# Reduce redundancy with the create page
Template.read.helpers
    username: -> 
        # Put this into waitOn handler
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name
    
    horizontalExists: ->
        currentVertical = Session.get('currentVertical') 
        # TODO Fix issue when there are incomplete context blocks
        @horizontalSections[currentVertical].data.length > 1

    verticalLeft: -> 
        width = Session.get "width"
        if width <= 1304
            88 + 16
        else
            (width / 2) - (Session.get("separation")/2) - Session.get("cardWidth")