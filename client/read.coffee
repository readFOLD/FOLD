Template.read.rendered = ->
    unless (Session.equals("currentY", undefined) and Session.equals("currentX", undefined))
        goToY(Session.get("currentY"))
        goToX(Session.get("currentX"))
#     Deps.autorun ->
#         # TODO Allow scrolling to top
#         if Session.get("pastHeader")

#             $(document).scrollsnap(
#                 snaps: 'section.vertical-narrative-section'
#                 proximity: 150
#                 latency: 200
#                 ease: 'easeInExpo'
#                 offset: -242
#                 onSnap: (d) ->
#                     pastY = Session.get("pastY")
#                     pastX = Session.get("pastX")
#                     currentY = Session.get("currentY")
#                     currentX = Session.get("currentX")
#                     pastY.push(currentY)
#                     pastX.push(currentX)
#                     Session.set("pastY", pastY)
#                     Session.set("pastX", pastX)

#                     Session.set("currentY", $(d).index())
#                     Session.set("currentX", 0)

#                     $('.horizontal-context').fadeIn()                    

#                     path = window.location.pathname.split("/")
#                     path[3] = Session.get("currentY")
#                     path[4] = Session.get("currentX")
#                     window.history.pushState({}, '', path.join("/"))
#                 )

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
