window.constants = 
  verticalSpacing: 12
  readModeOffset: 250

window.goToXY = (x, y) ->
  unless y is Session.get("currentY")
    goToY(y)
  goToX(x)

window.goToY = (y) ->
  $('.horizontal-context').fadeOut(100)
  verticalHeights = [constants.readModeOffset]
  # Get all heights
  sum = constants.readModeOffset
  $('section.vertical-narrative-section').each( -> 
    sum += $(this).height() + 12  # TODO Don't hardcode this!
    verticalHeights.push(sum) 
  )

  # Offset, cumulative sum
  $('body,html').animate(
    scrollTop: verticalHeights[y]
  , 500, 'easeInExpo', -> 
    Session.set("currentY", y)
    $('.horizontal-context').fadeIn()
    )

  path = window.location.pathname.split("/")
  if path.length <= 4
    path.push(y)
    path.push(Session.get("currentX"))
  else
    path[path.length - 2] = y
    path[path.length - 1] = Session.get("currentX")
  
  window.history.pushState({}, '', path.join("/"))
  return 

window.goToX = (x) ->
  Session.set("currentX", x)
  return 