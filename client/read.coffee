Template.read.rendered = ->
    Deps.autorun ->
        # TODO Allow scrolling to top
        if Session.get("pastHeader")

            $(document).scrollsnap(
                snaps: 'section.vertical-narrative-section'
                proximity: 150
                latency: 150
                ease: 'easeInExpo'
                offset: -242
                onSnap: (d) ->
                    pastY = Session.get("pastY")
                    pastX = Session.get("pastX")
                    currentY = Session.get("currentY")
                    currentX = Session.get("currentX")
                    pastY.push(currentY)
                    pastX.push(currentX)
                    Session.set("pastY", pastY)
                    Session.set("pastX", pastX)

                    Session.set("currentY", $(d).index())
                    Session.set("currentX", 1)
                    path = window.location.pathname.split("/")
                    path[3] = Session.get("currentY")
                    path[4] = Session.get("currentX")

                    window.history.pushState({}, '', path.join("/"))
                )
    goToY(Session.get("currentY"))

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
