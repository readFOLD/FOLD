# TODO Don't hardcode this
@google_api_key = "AIzaSyB2zbIKIoJR0fq5-dmM_h88hDce9TRDz9Q"

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

  verticalHeights = [constants.readModeOffset]
  sum = constants.readModeOffset
  $('section.vertical-narrative-section').each( -> 
    sum += $(this).height()
    verticalHeights.push(sum) 
  )
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
    $("div.title-overlay, div#banner-overlay").addClass("fixed")
    $("div.logo").addClass("visible")
  else
    $("div.title-overlay, div#banner-overlay").removeClass("fixed")
    $("div.logo").removeClass("visible")

  if scrollTop >= readMode
    Session.set("pastHeader", true)
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
    username: -> "Alexis Hope and Kevin Hu"

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
      window.history.pushState({}, '', path.join("/"))
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
    window.history.pushState({}, '', path.join("/"))
Template.story.events = 
  "click .link": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    x = $(srcE).data("x")
    y = $(srcE).data("y")
    goToXY(x, y)

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

        sections = Session.get("horizontalSections")?[currentY]?.data
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

    spacerHeight: -> Session.get("windowHeight") - 230 - 300

Template.vertical_narrative.helpers
  verticalSections: -> Session.get("verticalSections")

Template.vertical_section_block.helpers
  notFirst: -> (!Session.equals("currentY", 0))
  verticalSelected: -> (Session.equals("currentY", @index) and Session.get("pastHeader"))
  validTitle: -> (@title is not "title")
  maxHeight: ->
    400

moveOneCardThrottled = _.throttle moveOneCard, 700, trailing: false

verticalNarrativeScrollHandler = (e) ->
  wheelDeltaY = e.originalEvent.wheelDeltaY
  if Math.abs(wheelDeltaY) > 100
    moveOneCardThrottled wheelDeltaY
  e.preventDefault()

Template.vertical_narrative.events
  'mousewheel': verticalNarrativeScrollHandler
  "click #card-down": ->
    goDownOneCard()
  "click #card-up": ->
    goUpOneCard()
  "click section": (d) ->
    $('#to-story, .attribution').fadeOut()
    srcE = if d.srcElement then d.srcElement else d.target
    i = $(srcE).data('vertical-index')
    unless i?
      i = $(srcE).closest('section').data('vertical-index')
    # Don't do anything if click on current card
    unless i is Session.get("currentY")
      goToX(0)
      goToY(i)


Template.minimap.helpers
  horizontalSections: -> Session.get("horizontalSections")
  selectedX: -> Session.equals("currentX", @index)
  selectedY: -> Session.equals("currentY", @index)

Template.horizontal_context.helpers
    verticalExists: -> Session.get("verticalSections").length
    horizontalSections: -> Session.get("horizontalSections")
    moreThanOneSection: -> Session.get("horizontalSections").length > 1
    last: ->
      lastIndex = Session.get("horizontalSections")[Session.get("currentY")]?.data.length - 1
      (@index is lastIndex) and (lastIndex > 0)
    horizontalShown: -> Session.equals("currentY", @index)

Template.horizontal_section_block.helpers
    selected: -> 
      Session.equals("currentX", @index)
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

      # Current X
      horizontalLength = Session.get("horizontalSections")[Session.get("currentY")]?.data.length
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
    text: -> (@type is "text")
    image: -> (@type is "image")
    map: -> (@type is "map")
    video: -> (@type is "video")
    oec: -> (@type is "oec")

Template.story_browser.events
  "click #left": (d) ->
    horizontalSection = Session.get("horizontalSections")[Session.get("currentY")].data
    currentX = Session.get("currentX")

    newX = if (currentX is (horizontalSection.length - 1)) then 0 else currentX + 1
    goToX(newX)
    Session.set("currentX", newX)
    path = window.location.pathname.split("/")
    path[4] = Session.get("currentX")
    window.history.pushState({}, '', path.join("/"))

  "click #right": (d) ->
    horizontalSection = Session.get("horizontalSections")[Session.get("currentY")].data
    currentX = Session.get("currentX")

    newX = if currentX then (currentX - 1) else (horizontalSection.length - 1)
    Session.set("currentX", newX)
    path = window.location.pathname.split("/")
    path[4] = Session.get("currentX")
    window.history.pushState({}, '', path.join("/"))