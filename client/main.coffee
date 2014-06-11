# TODO Don't hardcode this
@google_api_key = "AIzaSyB2zbIKIoJR0fq5-dmM_h88hDce9TRDz9Q"

Handlebars.registerHelper "debugContext", ->
  console.log this

Handlebars.registerHelper "read", ->
  Session.get "read"

Meteor.startup ->
  Session.setDefault("currentVertical", 0)
  Session.setDefault("currentHorizontal", 1)

  updateCurrentVertical = ->
    # TODO Enable only on story view
    # connectorTopPosition = $("div.connector").offset().top
    scrollTop = $(document).scrollTop()
    currentVertical = Session.get("currentVertical")
    currentScrollTop = 250 * currentVertical

    if scrollTop > (currentScrollTop + 240)
      Session.set("currentVertical", currentVertical + 1)
    else if scrollTop < (currentScrollTop - 240)
      Session.set("currentVertical", currentVertical - 1)

  throttledUpdate = _.throttle(updateCurrentVertical, 200)

  $(document).scroll(throttledUpdate)

Template.vertical_section_block.helpers
  verticalSelected: -> Session.equals("currentVertical", @index)
  evenOrOdd: -> if (@index % 2 is 0) then "even" else "odd"