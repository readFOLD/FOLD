window.constants = 
  verticalSpacing: 12
  readModeOffset: 250

window.goToY = (y) ->
  verticalHeights = [constants.readModeOffset]
  # Get all heights
  sum = constants.readModeOffset
  $('section.vertical-narrative-section').each( -> 
    sum += $(this).height()
    verticalHeights.push(sum) 
  )

  # Offset, cumulative sum
  $('body').animate(
    scrollTop: verticalHeights[y]
  , 500, 'easeInExpo')
  return 

window.goToX = (x) ->
  cardWidth = Session.get("cardWidth")
  shifts = x - Session.get("currentX")
  offset = shifts * cardWidth
  sep = Session.get("separation")

  horizontalSection = Session.get("horizontalSections")[Session.get("currentY")].data

  # If two blocks

  # If more than two blocks
  # Shift PREVIOUS LAST to first
  # Reposition NEW LAST and shift to last
  # Shift left normally
  # $('section.horizontal-narrative-section').each( (i, e) ->
  # )
  
  # $('section.horizontal-narrative-section').each( (i, e) ->

  #   # If shifting right, need to increment more
  #   if shifts < 0
  #     sep = 0

  #   # If only two elements, last element shifts left
  #   if horizontalSection.length is 2
  #     if (i + 1) is horizontalSection.length
  #       console.log("RIGHT SHIFTING")
  #       $(e).animate(
  #         left: "-=" + (offset + sep)
  #       , 500, 'easeInExpo')
  #     else
  #       $(e).animate(
  #         left: "+=" + (offset + sep)
  #       , 500, 'easeInExpo')
  # ) 

  # $('section.horizontal-narrative-section').animate(
  #   left: "+=" + offset
  # , 500, 'easeInExpo')