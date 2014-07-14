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

    verticalLeft: -> 
        width = Session.get "width"
        if width <= 1304
            88 + 16
        else
            (width / 2) - (Session.get("separation")/2) - Session.get("cardWidth")

# Reading page (no "add" block)
Template.horizontal_section_block.helpers
    first: -> (@index is 0)
    left: ->
        width = Session.get "width"
        if width < 1024 then width = 1024
        halfWidth = width / 2
        cardWidth = Session.get "cardWidth"

        # Offset for "add" block
        read = Session.get("read")
        if read
            offset = 0
        else
            offset = 100 + Session.get("separation")

        # Last card
        lastIndex = Session.get("horizontalSections")[Session.get("currentVertical")].data.length - 1
        if (lastIndex >= 2) and (@index is lastIndex)
            if width <= 1304
                return (-cardWidth + 88) + offset
            else
            return (-Session.get("cardWidth") + (width - (Session.get("separation") * 3) - (Session.get("cardWidth") * 2))/2)
        # Between first and last card
        else if @index
            (@index * cardWidth) + halfWidth + (3 * (Session.get "separation") / 2) + offset
        # First
        else
            halfWidth + ((Session.get "separation") / 2) + offset

