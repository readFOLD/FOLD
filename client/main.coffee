Handlebars.registerHelper "debugContext", -> 
  console.log this

Meteor.startup ->
  Session.setDefault("currentVertical", 0)
  Session.setDefault("currentHorizontal", 0)

verticalSections = [
  {
    index: 0
    title: "Vertical 1"
    content: "Content 1"
  },
  {
    index: 1
    title: "Vertical 2",
    content: "Content 2"
  }
]

horizontalSections = [
  {
    index: 0
    data: [
      {
        title: "Horizontal 1"
        content: "Content A"
      },
      {
        title: "Horizontal 1"
        content: "Content B"
      },
    ]
  },
  {
    index: 1
    data: [
      {
        title: "Horizontal 2"
        content: "Content A"
      },
      {
        title: "Horizontal 2"
        content: "Content B"
      },
    ]
  }
]

# Add indexes to sections
for section, i in verticalSections
  section.index = i

for section, i in horizontalSections
  section.index = i

Template.horizontal_context.helpers
  horizontalShown: ->
    Session.equals("currentVertical", @index)

Template.vertical_narrative.helpers
  verticalSections: verticalSections

Template.horizontal_context.helpers
  horizontalSections: horizontalSections

Template.section_block.events
  "click section.narrative-section": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    verticalIndex = $(srcE).data("vertical-index")
    console.log $(srcE)
    Session.set "currentVertical", verticalIndex

  # "click div.content": (d) ->
  #   d.stopPropagation()
  #   srcE = d.srcElement.parentNode
  #   console.log $(srcE)
  #   verticalIndex = $(srcE).data("vertical-index").data("vertical-index")
  #   Session.set "currentVertical", verticalIndex

  # "click div.title": (d) ->
  #   d.stopPropagation()
  #   srcE = d.srcElement.parentNode
  #   console.log $(srcE)
  #   verticalIndex = $(srcE).data("vertical-index")
  #   Session.set "currentVertical", verticalIndex


  "click div.size-icon": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    $(srcE).addClass("hidden")
    $(srcE).siblings("div.size-icon").removeClass("hidden")

    contentContainer = $(srcE).closest("section.narrative-section").children("div.content")
    minimized = contentContainer.hasClass("minimized")
    if minimized 
      contentContainer.removeClass("minimized")
    else 
      contentContainer.addClass("minimized")