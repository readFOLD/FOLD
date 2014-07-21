# TODO Don't hardcode this
@google_api_key = "AIzaSyB2zbIKIoJR0fq5-dmM_h88hDce9TRDz9Q"

Handlebars.registerHelper "debugContext", ->
  console.log this

Handlebars.registerHelper "read", ->
  Session.get "read"

Handlebars.registerHelper "cardWidth", ->
  # Be consistent about JS styling vs CSS styling
  if Session.get("narrativeView")
    return 800
  Session.get "cardWidth"

Handlebars.registerHelper "setTitle", (title) ->
  document.title = title
  return

getCardWidth = (windowWidth) ->
  if windowWidth <= 1024 
    cardWidth = 400
  else if (windowWidth > 1024) and (windowWidth <= 1304)
    cardWidth = (windowWidth - (16 * 3) - (88 * 2)) / 2
  else
    cardWidth = 520
        

Session.set "separation", 12
Session.set "width", window.outerWidth
Session.set "cardWidth", getCardWidth(Session.get("width"))
# Set session variable if window resized (throttled rate) and window outerwidth greater than 1024px
throttledResize = _.throttle(->
  if window.outerWidth > 1024
    Session.set "resize", new Date()
    Session.set "width", window.outerWidth
    Session.set "cardWidth", getCardWidth(Session.get("width"))
, 5)
$(window).resize throttledResize


Meteor.startup ->
  Session.setDefault("filterOpen", false)
  Session.setDefault("currentVertical", 0)
  Session.setDefault("currentHorizontal", 1)

  updateCurrentVertical = ->
    scrollTop = $(document).scrollTop()
  #   currentVertical = Session.get("currentVertical")
  #   currentScrollTop = 300 * currentVertical

  #   if scrollTop > (currentScrollTop + 280)
  #     Session.set("currentVertical", currentVertical + 1)
  #   else if scrollTop < (currentScrollTop - 280)
  #     Session.set("currentVertical", currentVertical - 1)

  # Scroll listener
  throttledUpdate = _.throttle(updateCurrentVertical, 200)
  $(document).scroll(throttledUpdate)

Template.vertical_section_block.helpers
  verticalSelected: -> Session.equals("currentVertical", @index)

Template.horizontal_context.helpers
    verticalExists: -> @verticalSections.length
    horizontalShown: -> Session.equals("currentVertical", @index)

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
            offset = 75 + Session.get("separation")

        # Last card

        # TODO How do you get the last element?
        lastIndex = horizontalSections?[Session.get("currentVertical")].data.length - 1
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

# Horzizontal scrolling
Template.story_browser.events
    "click i.left": (d) ->
        console.log("Left click:", @horizontalSections)
        newHorizontalSection = []
        horizontalSection = @horizontalSections[Session.get('currentVertical')].data

        # Reindex
        for section, i in horizontalSection[1..horizontalSection.length]
            section.index = i
            newHorizontalSection.push(section)

        # Previous first element, new last element
        newLastSection = horizontalSection[0]
        newLastSection.index = horizontalSection.length - 1
        newHorizontalSection.push(newLastSection)
        console.log(newHorizontalSection)

        # Is this the proper way to rotate?
        @horizontalSections[Session.get('currentVertical')].data = newHorizontalSection

    "click i.right": (d) ->
        console.log("Right click:", @horizontalSections)
        newHorizontalSection = []
        horizontalSection = @horizontalSections[Session.get('currentVertical')].data

        newLastSection = horizontalSection[horizontalSection.length-1]
        newLastSection.index = 0
        newHorizontalSection.push(newLastSection)

        # First to second-to-last
        for section, i in horizontalSection[0..horizontalSection.length-2]
            section.index = i + 1
            newHorizontalSection.push(section)

        @horizontalSections[Session.get('currentVertical')].data = newHorizontalSection
