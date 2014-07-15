# TODO Don't hardcode this
@google_api_key = "AIzaSyB2zbIKIoJR0fq5-dmM_h88hDce9TRDz9Q"

Handlebars.registerHelper "debugContext", ->
  console.log this

Handlebars.registerHelper "read", ->
  Session.get "read"

Handlebars.registerHelper "cardWidth", ->
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
    cardWidth = 540
        

Session.set "separation", 16
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
  Session.setDefault("currentVertical", 0)
  Session.setDefault("currentHorizontal", 1)

  updateCurrentVertical = ->
    # TODO Enable only on story view
    # connectorTopPosition = $("div.connector").offset().top
    scrollTop = $(document).scrollTop()
    currentVertical = Session.get("currentVertical")
    currentScrollTop = 300 * currentVertical

    if scrollTop > (currentScrollTop + 280)
      Session.set("currentVertical", currentVertical + 1)
    else if scrollTop < (currentScrollTop - 280)
      Session.set("currentVertical", currentVertical - 1)

  throttledUpdate = _.throttle(updateCurrentVertical, 200)

  $(document).scroll(throttledUpdate)

Template.vertical_section_block.helpers
  verticalSelected: -> Session.equals("currentVertical", @index)
  evenOrOdd: -> if (@index % 2 is 0) then "even" else "odd"