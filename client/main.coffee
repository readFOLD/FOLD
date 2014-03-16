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
  },
  {
    index: 2
    title: "Vertical 3"
    content: "Content 3"
  },
  {
    index: 3
    title: "Vertical 4",
    content: "Content 4"
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
      {
        title: "Horizontal 2"
        content: "Content B"
      },
      {
        title: "Horizontal 2"
        content: "Content B"
      },
    ]
  },
  {
    index: 2
    data: [
      {
        title: "Horizontal 3"
        content: "Content A"
      },
      {
        title: "Horizontal 3"
        content: "Content B"
      },
      {
        title: "Horizontal 3"
        content: "Content C"
      },
    ]
  },
  {
    index: 4
    data: [
      {
        title: "Horizontal 4"
        content: "Content A"
      },
    ]
  }
]

# Add indexes to sections
for section, i in verticalSections
  section.index = i

for section, i in horizontalSections
  section.index = i

# TODO Listen to keydown events
# Template.vertical_narrative.events
#   "document keydown": (d) ->
#     d.preventDefault()
#     console.log d

Template.horizontal_context.helpers
  horizontalShown: -> Session.equals("currentVertical", @index)

Template.vertical_narrative.helpers
  verticalSections: verticalSections

Template.horizontal_context.helpers
  horizontalSections: horizontalSections

Template.vertical_section_block.helpers
  verticalSelected: -> Session.equals("currentVertical", @index)
  evenOrOdd: -> if (@index % 2 is 0) then "even" else "odd"

Template.vertical_section_block.events
  "click section.narrative-section": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    verticalIndex = $(srcE).data("vertical-index")
    Session.set "currentVertical", verticalIndex

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