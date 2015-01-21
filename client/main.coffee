getCardWidth = (windowWidth) ->
  if windowWidth <= 1024
    cardWidth = 400
  else if (windowWidth > 1024) and (windowWidth <= 1304)
    cardWidth = (windowWidth - (16 * 3) - (88 * 2)) / 2
  else
    cardWidth = 520

Session.set "windowHeight", $(window).height()
Session.set "separation", 10
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

scrollSnap = ->
  scrollTop = $(document).scrollTop()
  Session.set("scrollTop", scrollTop)

  #######################
  # Scroll snapping
  #######################

  verticalHeights = window.getVerticalHeights()
  tolerance = 20
  for height, i in verticalHeights
    if ((height - tolerance) < scrollTop) and (scrollTop < (height + tolerance))
      console.log(scrollTop, i)
      goToY(i)

updatecurrentY = ->
  scrollTop = $(document).scrollTop()
  Session.set("scrollTop", scrollTop)

  #######################
  # Banner scrolling
  # TODO: Make sure every pixel behaves as expected
  #######################

  # Sticky header (TODO Only listen to this on home page)
  if scrollTop >= (200 - 32)
    Session.set("sticky", true)
  else
    Session.set("sticky", false)

  stickyBody = 90  # When the body stops scrolling
  stickyTitle = 120  # When the title stops moving
  maxScroll = 230  # When the user is in "read" mode
  readMode = 250

  # Fade-in black
  $("div#banner-overlay").css(opacity: Math.min(1.0, scrollTop/maxScroll))

  # Fade-in content opacity
  $("article.content").css(opacity: 0.5 + Math.min(1.0, scrollTop/maxScroll) / 2)

  # First breakpoint: sticky title and author
  if scrollTop >= stickyTitle
    $("div.title-author").css("margin-top": "0px")
    $("div.title-author").addClass("fixed")
  else
    $("div.title-author").css("margin-top": "125px")
    $("div.title-author").removeClass("fixed")

  if scrollTop >= stickyBody
    # TODO Don't wobble
    vertTop = 427 + scrollTop - stickyTitle
    $("div.horizontal-context").addClass("fixed")
    $("div.vertical-narrative").css(top: vertTop)
    if scrollTop >= maxScroll
      $("div.vertical-narrative").css(top: 557)
  else
    $("div.vertical-narrative").css(top: 427)
    $("div.horizontal-context").removeClass("fixed")

  if scrollTop >= maxScroll
    # transitioning into read-mode and also read-mode
    $("div.title-overlay, div#banner-overlay").addClass("fixed")
    $("div.logo").addClass("visible")
  else
    $("div.title-overlay, div#banner-overlay").removeClass("fixed")
    $("div.logo").removeClass("visible")

  if scrollTop >= readMode
    # full on read-mode
    Session.set("pastHeader", true)
    for h, i in window.getVerticalHeights()
      if scrollTop < h
        break
    actualY = i - 1
    if Session.get('currentY') isnt actualY
      Session.set("currentX", 0) # always start at base context card for now. later remember what context card the user was one for each Y
      Session.set("currentY", actualY)
    # window.setUrlForCurrentXY()
  else
    Session.set("pastHeader", false)

Meteor.startup ->
  Session.setDefault("filterOpen", false)
  Session.setDefault("filter", "curated")
  Session.setDefault("category", "all")
  Session.setDefault("pastY", [])
  Session.setDefault("pastX", [])
  Session.setDefault("currentY", undefined)
  Session.setDefault("currentX", undefined)

  # Scroll listener
  throttledUpdate = _.throttle(updatecurrentY, 5)
  $(document).scroll(throttledUpdate)

Template.story_header.helpers
  title: ->
      if @title then @title
      else Session.get("storyTitle")
  headerImageAttribution: -> @headerImageAttribution
  backgroundImage: ->
      if @backgroundImage then @backgroundImage
      else Session.get("backgroundImage")

Template.story_header.events =
  "mouseover #banner-overlay, mouseover #to-header": ->
    if Session.get('pastHeader')
      $("#to-header").addClass('shown')
  "mouseout #banner-overlay": ->
    if Session.get('pastHeader')
      $("#to-header").removeClass('shown')
  "click #to-story": ->
    $('#to-story, .attribution').fadeOut()
    goToX(0)
    goToY(0)
  "click #banner-overlay": ->
    if Session.get("pastHeader")
      $("#to-header").removeClass("shown")
      $("html, body").animate(scrollTop: 0, -> $('#to-story, .attribution').fadeIn())
      Session.set("currentX", undefined)
      Session.set("currentY", undefined)
      path = window.location.pathname.split("/")
      path.pop()
      path.pop()
      # window.history.pushState({}, '', path.join("/"))
    else
      $('#to-story, .attribution').fadeOut()
      goToX(0)
      goToY(0)

  "click #to-header": ->
    $("#to-header").removeClass("shown")
    $("html, body").animate(scrollTop: 0, -> $('#to-story, .attribution').fadeIn())
    Session.set("currentX", undefined)
    Session.set("currentY", undefined)
    path = window.location.pathname.split("/")
    path.pop()
    path.pop()
    # window.history.pushState({}, '', path.join("/"))
Template.story.events =
  "click .link": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    x = $(srcE).data("x")
    y = $(srcE).data("y")
    goToXY(x, y)

  "click a": (e) ->
    e.preventDefault()
    contextId = $(e.target).attr('href')[1..] # get id
    goToContext contextId


  "keydown": (d) ->
    if d.keyCode is 38  # up
      goToY(Session.get("currentY") - 1)
    else if d.keyCode is 40  # down
      goToY(Session.get("currentY") + 1)
    else if d.keyCode is 39 # right
      return
    else if d.keyCode is 37 # right
      return

Template.story.helpers
  horizontalExists: ->
    currentY = Session.get('currentY')
    return Session.get('horizontalSectionsMap')[currentY]?.horizontal.length > 1

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

  spacerHeight: -> Session.get("windowHeight") - 230 - 300


Template.vertical_section_block.helpers
  notFirst: -> (!Session.equals("currentY", 0))
  verticalSelected: -> (Session.equals("currentY", @index) and Session.get("pastHeader"))
  validTitle: -> (@title is not "title")
  contentDiv: ->
    # TODO Sanitize but leave in links and formatting
    if Session.get 'read'
      return '<div class="content">' + this.content + '</div>'
    else
      return '<div class="content editable medium-editable">' + this.content + '</div>'

Template.vertical_narrative.helpers
  verticalSectionsWithIndex: ->
    @verticalSections.map (v, i) ->
      _.extend v, index: i

Template.vertical_narrative.events
  "click section": (d) ->
    $('#to-story, .attribution').fadeOut()
    srcE = if d.srcElement then d.srcElement else d.target
    i = $(srcE).data('vertical-index')
    i ?= $(srcE).closest('section').data('vertical-index')
    if i?
      unless i is Session.get("currentY") # Don't do anything if click on current card
        goToX(0)
        goToY(i)


Template.minimap.helpers
  horizontalSectionsMap: -> Session.get("horizontalSectionsMap")
  selectedX: -> Session.equals("currentX", @horizontalIndex)
  selectedY: -> Session.equals("currentY", @verticalIndex)


Template.horizontal_context.helpers
  verticalExists: -> Session.get("horizontalSectionsMap").length
  horizontalSections: ->
    @verticalSections.map (verticalSection, verticalIndex) ->
      index: verticalIndex
      data: ContextBlocks.find(_id: $in: verticalSection.contextBlocks).map (data, horizontalIndex) ->
        return _.extend data,
          index: horizontalIndex # TODO, this shouldn't get saved if edit-mode
  last: ->
    lastIndex = Session.get("horizontalSectionsMap")[Session.get("currentY")]?.horizontal.length - 1
    (@index is lastIndex) and (lastIndex > 0)
  horizontalShown: ->
    Session.equals("currentY", @index)


typeHelpers =
  text: -> (@type is "text")
  image: -> (@type is "image")
  map: -> (@type is "map")
  video: -> (@type is "video")
  oec: -> (@type is "oec")

horizontalBlockHelpers = _.extend {}, typeHelpers,
  selected: ->
    Session.equals("currentX", @index) and not Session.get("addingContext")



Template.horizontal_section_block.helpers horizontalBlockHelpers

Template.horizontal_section_block.helpers
  # Initial left positioning of horizontal block
  left: ->
    # Get width of page and declare helper variables
    width = Session.get "width"
    if width < 1024 then width = 1024
    halfWidth = width / 2
    cardWidth = Session.get "cardWidth"

    # WRITING
    # Offset for "add" block
    read = Session.get("read")
    if read then offset = 0
    else offset = 75 + Session.get("separation")

    if Session.get("addingContext")
      offset += cardWidth + Session.get("separation")

    # Current X

    horizontalLength = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal.length # TO-DO getting currentY is hacky
    lastIndex = horizontalLength - 1

    # Adjusting for currentX
    currentX = Session.get("currentX")
    adjustedIndex = @index - currentX
    if adjustedIndex < 0
      adjustedIndex = horizontalLength + adjustedIndex

    # TODO Make number of cards on right dynamic
    # LAST Card
    if (lastIndex >= 2) and (adjustedIndex is lastIndex)
      if width <= 1304
        left = (-cardWidth + 88) + offset
      else
        left = (-Session.get("cardWidth") + (width - (Session.get("separation") * 3) - (Session.get("cardWidth") * 2))/2)
    # BETWEEN First and Last card
    else if adjustedIndex
      left = (adjustedIndex * cardWidth) + halfWidth + (3 * (Session.get "separation") / 2) + offset
    # FIRST Card
    else
      left = halfWidth + ((Session.get "separation") / 2) + offset

    return left

  lastUpdate: ->
    Session.get('lastUpdate')
    return


Template.display_oec_section.helpers horizontalBlockHelpers
Template.display_video_section.helpers horizontalBlockHelpers

Template.story_browser.events
  "click .right": (d) ->
    horizontalSection = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal
    currentX = Session.get("currentX")

    newX = if (currentX is (horizontalSection.length - 1)) then 0 else currentX + 1
    goToX(newX)
    Session.set("currentX", newX)
    path = window.location.pathname.split("/")
    path[4] = Session.get("currentX")
    # window.history.pushState({}, '', path.join("/"))

  "click .left": (d) ->
    horizontalSection = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal
    currentX = Session.get("currentX")

    newX = if currentX then (currentX - 1) else (horizontalSection.length - 1)
    Session.set("currentX", newX)
    path = window.location.pathname.split("/")
    path[4] = Session.get("currentX")
    # window.history.pushState({}, '', path.join("/"))

Template.type_specific_icon.helpers typeHelpers

Template.favorite_button.helpers
  favorited: ->
    Meteor.user() and Meteor.user()._id in @favorited
Template.favorite_button.events
  "click .favorite": ->
    Meteor.call 'favoriteStory', @_id, (err) ->
      if err
        alert err
  "click .unfavorite": ->
    Meteor.call 'unfavoriteStory', @_id, (err) ->
      if err
        alert err
