Template.read.rendered = ->
    Deps.autorun ->
        Session.get("resize")
        $(document).scrollsnap(
            snaps: 'section.vertical-narrative-section'
            proximity: 140
            latency: 100
            easy: 'easeInExpo'
            onSnap: (d) -> 
                Session.set("currentVertical", $(d).index())
            offset: -$('div.horizontal-context').offset().top + 120  # Where is this offset coming from?
            )

# Reduce redundancy with the create page
Template.read.helpers
    username: -> 
        # Put this into waitOn handler
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name

    category: -> 'World'
    
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