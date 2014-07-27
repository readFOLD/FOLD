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
  Session.setDefault("filter", "curated")
  Session.setDefault("category", "all")
  Session.setDefault("currentVertical", 0)
  Session.setDefault("currentHorizontal", 1)

  updateCurrentVertical = ->
    scrollTop = $(document).scrollTop()

    # Sticky header (TODO Only listen to this on home page)
    if scrollTop >= (200 - 32)
      Session.set("sticky", true)
    else
      Session.set("sticky", false)

    stickyBody = 90
    stickyTitle = 120
    maxScroll = 250

    $("div#banner-overlay").css(opacity: Math.min(1.0, scrollTop/maxScroll))
    $("article.content").css(opacity: 0.5 + Math.min(1.0, scrollTop/maxScroll) / 2)
    if scrollTop >= stickyTitle
      $("div.title-author").addClass("fixed")
    else
      $("div.title-author").removeClass("fixed")

    if scrollTop >= stickyBody
      vertTop = 427 + scrollTop - stickyTitle
      $("div.horizontal-context").addClass("fixed")
      $("div.vertical-narrative").css(top: vertTop)
      if scrollTop >= maxScroll
        $("div.vertical-narrative").css(top: 557)
    else
      $("div.vertical-narrative").css(top: 427)
      $("div.horizontal-context").removeClass("fixed")

    if scrollTop >= maxScroll
      Session.set("pastHeader", true)
      $("div.title-overlay, div#banner-overlay").addClass("fixed")
      $("div.logo").addClass("visible")
      $("div.description").hide()
    else
      Session.set("pastHeader", false)
      $("div.title-overlay, div#banner-overlay").removeClass("fixed")
      $("div.logo").removeClass("visible")
      $("div.description").show()

  # Scroll listener
  # throttledUpdate = _.throttle(updateCurrentVertical, 5)
  $(document).scroll(updateCurrentVertical)

Template.story_header.helpers
    title: ->
        if @title then title
        else Session.get("storyTitle")
    username: -> 
        # Put this into waitOn handler
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name
    
Template.story.helpers
    horizontalExists: ->
        currentVertical = Session.get('currentVertical') 
        # TODO Fix issue when there are incomplete context blocks

        sections = @horizontalSections[currentVertical].data
        _.filter(sections, (e) -> e.type).length > 1

    pastHeader: -> Session.get("pastHeader")

    verticalLeft: -> 
        width = Session.get "width"
        if width <= 1304
            88 + 16
        else
            (width / 2) - (Session.get("separation")/2) - Session.get("cardWidth")

    verticalLeft: -> 
        width = Session.get "width"
        if Session.get("narrativeView")
            return (width - 800) / 2
        if width <= 1304
            88 + 16
        else
            (width / 2) - (Session.get("separation")/2) - Session.get("cardWidth")

Template.vertical_section_block.helpers
  verticalSelected: -> Session.equals("currentVertical", @index)

Template.horizontal_context.helpers
    verticalExists: -> Session.get("verticalSections").length
    horizontalSections: -> Session.get("horizontalSections")
    moreThanOneSection: -> Session.get("horizontalSections").length > 1
    last: -> 
      lastIndex = Session.get("horizontalSections")[Session.get("currentVertical")].data.length - 1
      (@index is lastIndex)
    horizontalShown: -> Session.equals("currentVertical", @index)

Template.last_horizontal_section_block.helpers
    left: ->
        width = Session.get "width"
        if width < 1024 then width = 1024
        halfWidth = width / 2
        cardWidth = Session.get "cardWidth"
        offset = 0

        if width <= 1304
            return (-cardWidth + 88) + offset
        else
            return (-Session.get("cardWidth") + (width - (Session.get("separation") * 3) - (Session.get("cardWidth") * 2))/2)

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
            offset = 0 # 75 + Session.get("separation")

        # Last card

        # TODO How do you get the last element?
        horizontalSections = Session.get("horizontalSections")
        lastIndex = horizontalSections[Session.get("currentVertical")].data.length - 1
        if (lastIndex >= 2) and (@index is lastIndex)
            console.log("LAST SECTION")
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
        horizontalSections = Session.get("horizontalSections")
        newHorizontalSection = []
        horizontalSection = horizontalSections[Session.get('currentVertical')].data

        # Reindex
        for section, i in horizontalSection[1..horizontalSection.length]
            section.index = i
            newHorizontalSection.push(section)

        # Previous first element, new last element
        newLastSection = horizontalSection[0]
        newLastSection.index = horizontalSection.length - 1
        newHorizontalSection.push(newLastSection)

        # Is this the proper way to rotate?
        horizontalSections[Session.get('currentVertical')].data = newHorizontalSection
        Session.set("horizontalSections", horizontalSections)

    "click i.right": (d) ->
        horizontalSections = Session.get("horizontalSections")
        newHorizontalSection = []
        horizontalSection = horizontalSections[Session.get('currentVertical')].data

        newLastSection = horizontalSection[horizontalSection.length-1]
        newLastSection.index = 0
        newHorizontalSection.push(newLastSection)

        # First to second-to-last
        for section, i in horizontalSection[0..horizontalSection.length-2]
            section.index = i + 1
            newHorizontalSection.push(section)

        horizontalSections[Session.get('currentVertical')].data = newHorizontalSection
        Session.set("horizontalSections", horizontalSections)
