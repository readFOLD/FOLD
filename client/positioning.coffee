window.constants =
  verticalSpacing: 12
  readModeOffset: 250

window.getVerticalHeights = ->
  verticalHeights = [constants.readModeOffset]
  sum = constants.readModeOffset
  # Get all heights
  $('section.vertical-narrative-section').each( ->
    sum += $(this).height() + 12  # TODO Don't hardcode this!
    verticalHeights.push(sum)
  )
  return verticalHeights

window.goToXY = (x, y) ->
  unless y is Session.get("currentY")
    goToY(y)
  goToX(x)

window.goToY = (y) ->
  $('.horizontal-context').fadeOut(100)
  verticalHeights = window.getVerticalHeights()
  # Offset, cumulative sum
  $('body,html').animate(
    scrollTop: verticalHeights[y]
  , 500, 'easeInExpo', ->
    Session.set("currentY", y)
    $('.horizontal-context').fadeIn()
    # setUrlForCurrentXY()
    )
  return

# window.setUrlForCurrentXY = () ->
#   path = window.location.pathname.split("/")
#   if path.length <= 4
#     path.push(Session.get("currentY"))
#     path.push(Session.get("currentX"))
#   else
#     path[path.length - 2] = Session.get("currentY")
#     path[path.length - 1] = Session.get("currentX")

#   window.history.pushState({}, '', path.join("/"))
#   return

window.goToX = (x) ->
  Session.set("currentX", x)
  return

window.goDownOneCard = ->
  currentY = Session.get("currentY")
  newY = currentY + 1
  goToXY(0, newY)

window.goUpOneCard = ->
  currentY = Session.get("currentY")
  newY = currentY - 1
  goToXY(0, newY)

window.moveOneCard = (d) ->
  if d < 0
    goDownOneCard()
  else if d > 0
    goUpOneCard()
