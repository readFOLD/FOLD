getSelectionCoords = ->
    sel = document.selection
    range = undefined
    rect = undefined
    x = 0
    y = 0
    if sel
      unless sel.type is "Control"
        range = sel.createRange()
        range.collapse true
        x = range.boundingLeft
        y = range.boundingTop
    else if window.getSelection
      sel = window.getSelection()
      if sel.rangeCount
        range = sel.getRangeAt(0).cloneRange()
        if range.getClientRects
          range.collapse true
          rect = range.getClientRects()[0]
          x = rect.left
          y = rect.top
        
        # Fall back to inserting a temporary element
        if x is 0 and y is 0
          span = document.createElement("span")
          if span.getClientRects
            
            # Ensure span has dimensions and position by
            # adding a zero-width space character
            span.appendChild document.createTextNode("​")
            range.insertNode span
            rect = span.getClientRects()[0]
            x = rect.left
            y = rect.top
            spanParent = span.parentNode
            spanParent.removeChild span
            
            # Glue any broken text nodes back together
            spanParent.normalize()

    res = 
        x: x
        y: y


Template.layout_options.events
    "click i#expand": ->
        Session.set("narrativeLayout", true)

Template.create.helpers
    storyTitle: -> Session.get('storyTitle')
    storyLoaded: -> 
        if Session.get("newStory") 
            true
        else
            Stories.findOne(_id: Session.get('storyId'))
    username: -> 
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name
    
    horizontalExists: ->
        currentVertical = Session.get('currentVertical')        
        Session.get('horizontalSections')[currentVertical]?.data.length > 1

    verticalLeft: -> 
        width = Session.get "width"
        if width <= 1304
            88 + 16
        else
            (width / 2) - (Session.get("separation")/2) - Session.get("cardWidth")
    showFormatting: -> Session.get("formatting")

Template.create.events
    "mousedown": ->
        console.log("mousedown")
        Session.set("formatting", false)
    "mouseup": ->
        console.log("mouseup")
        if window.getSelection
            text = window.getSelection().toString()
        else if (typeof document.selection and document.selection.type is "Text")
            text = document.selection.createRange().text
        if text
            Session.set("formatting", true)
            console.log "TEXT:", text
            coords = getSelectionCoords()
            Session.set("formattingTop", coords.y)
            Session.set("formattingLeft", coords.x)

Template.formatting.helpers
    top: -> Session.get("formattingTop") - 60
    left: -> Session.get("formattingLeft")

Template.vertical_narrative.helpers
    verticalSections: -> Session.get('verticalSections')

Template.horizontal_context.helpers
    verticalExists: -> (Session.get('verticalSections').length > 0)
    horizontalSections: -> Session.get('horizontalSections')
    horizontalShown: -> Session.equals("currentVertical", @index)

Template.story_browser.events
    "click i.left": (d) ->
        horizontalSections = Session.get('horizontalSections')
        newHorizontalSection = []
        horizontalSection = horizontalSections[Session.get('currentVertical')].data
        for section, i in horizontalSection[1..horizontalSection.length]
            section.index = i
            newHorizontalSection.push(section)

        # Previous first element, new last element
        newLastSection = horizontalSection[0]
        newLastSection.index = horizontalSection.length - 1
        newHorizontalSection.push(newLastSection)

        horizontalSections[Session.get('currentVertical')].data = newHorizontalSection
        Session.set('horizontalSections', horizontalSections)

    "click i.right": (d) ->
        horizontalSections = Session.get('horizontalSections')
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
        Session.set('horizontalSections', horizontalSections)

#######################
# Adding Sections
#######################
Template.add_vertical.events
    "click section": ->
        console.log("clicking add vertical")
        # Append Vertical Section
        verticalSections = Session.get('verticalSections')
        newVerticalSection =
            title: 'Title'
            content: 'Content'
            index: verticalSections.length
        verticalSections.push(newVerticalSection)
        Session.set('verticalSections', verticalSections)

        # Initialize Horizontal Section
        horizontalSections = Session.get('horizontalSections')
        newHorizontalSection =
            data: []
            index: horizontalSections.length
        horizontalSections.push(newHorizontalSection)
        Session.set('horizontalSections', horizontalSections)   

Template.add_horizontal.helpers
    left: ->
        width = Session.get "width"
        if width < 1024 then width = 1024
        halfWidth = width / 2
        cardWidth = Session.get "cardWidth"
        halfWidth + (Session.get "separation") / 2

Template.add_horizontal.events
    "click section": ->
        # Append Horizontal Section to Current Horizontal Context
        horizontalSections = Session.get('horizontalSections')
        newHorizontalSection = 
            index: horizontalSections[Session.get('currentVertical')].data.length
        horizontalSections[Session.get('currentVertical')].data.push(newHorizontalSection)
        Session.set('horizontalSections', horizontalSections)   

renderTemplate = (d, templateName, context) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    parentSection.empty()
    if context
        UI.insert(UI.renderWithData(templateName, context), parentSection.get(0))
    else
        UI.insert(UI.render(templateName), parentSection.get(0))

Template.horizontal_context.helpers
    lastUpdate: ->
        Session.get('lastUpdate')
        return

Template.horizontal_context.events
    'click img.text-button': (d) -> renderTemplate(d, Template.create_text_section)
    'click img.photo-button': (d) -> renderTemplate(d, Template.create_image_section)
    'click img.map-button': (d) -> renderTemplate(d, Template.create_map_section)
    'click img.youtube-button': (d) -> renderTemplate(d, Template.create_youtube_section)
    'click img.gifgif-button': (d) -> renderTemplate(d, Template.create_gifgif_section)
    'click img.audio-button': (d) -> renderTemplate(d, Template.create_audio_section)

Template.create_section_options.events
    "click div#back": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        parentSection = $(srcE).closest('section')
        parentSection.empty()
        UI.insert(UI.render(Template.horizontal_section_buttons), parentSection.get(0)) 

Template.create_text_section.events
    "click div#save": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        parentSection = $(srcE).closest('section')
        horizontalIndex = parentSection.data('index')
        text = parentSection.find('textarea.text-input').val()

        newDocument =
            type: 'text'
            content: text
            index: horizontalIndex

        # Bind data
        horizontalSections = Session.get('horizontalSections')
        horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument
        Session.set('horizontalSections', horizontalSections) 

        # Render display section
        context = newDocument 
        renderTemplate(d, Template.display_text_section, context)

Template.create_image_section.events
    "click div#save": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        parentSection = $(srcE).closest('section')
        horizontalIndex = parentSection.data('index')
        url = parentSection.find('input.image-url-input').val()
        description = parentSection.find('input.image-description-input').val()

        newDocument =
            type: 'image'
            url: url
            description: description
            index: horizontalIndex

        # Bind data
        horizontalSections = Session.get('horizontalSections')
        horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument
        Session.set('horizontalSections', horizontalSections) 

        # Render display section
        context = newDocument 
        renderTemplate(d, Template.display_image_section, context)

Template.horizontal_section_block.helpers
    lastUpdate: -> 
        Session.get('lastUpdate')
        return
    text: -> (@type is "text")
    image: -> (@type is "image")
    map: -> (@type is "map")

# TODO Don't put in so much duplicated code!!!
Template.horizontal_section_block.events
    "click div#delete": (d) -> 
        console.log("delete")
        srcE = if d.srcElement then d.srcElement else d.target
        parentSection = $(srcE).closest('section')
        horizontalIndex = parentSection.data('index')
        horizontalSections = Session.get('horizontalSections')
        horizontalSections[Session.get('currentVertical')].data.splice(horizontalIndex, 1)
        Session.set('horizontalSections', horizontalSections)  

    "click div#edit": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        parentSection = $(srcE).closest('section')
        horizontalIndex = parentSection.data('index')
        horizontalSections = Session.get('horizontalSections')
        section = horizontalSections[Session.get('currentVertical')].data[horizontalIndex]
        data = section
        type = section.type
        switch type
            when "text" then renderTemplate(d, Template.create_text_section, section)
            when "image" then renderTemplate(d, Template.create_image_section, section)
            when "map" then renderTemplate(d, Template.create_map_section, section)


#######################
# Save and Publish
#######################
Template.create_options.events
    "click div#save": ->
        # Get all necessary fields
        storyTitle = $.trim($('div.story-title').text())
        date = new Date()
        user = Meteor.user()._id
        verticalSections = []
        $('section.vertical-narrative-section').each((i) ->
            title = $.trim($(this).find('div.title').text())
            content = $.trim($(this).find('div.content').text())
            verticalSections.push(
                index: i
                title: title
                content: content
                )
            )
        horizontalSections = Session.get('horizontalSections')

        storyDocument =
            title: storyTitle
            verticalSections: verticalSections
            horizontalSections: horizontalSections
            userId: user
            lastSaved: date
            published: false

        storyId = Session.get('storyId')
        if storyId
            Stories.update({_id: storyId}, {$set: storyDocument})
        else
            Stories.insert(storyDocument)

    "click div#delete": ->
        storyId = Session.get('storyId')
        if storyId
            Stories.remove({_id: storyId})
        Router.go('home')

    "click div#publish": ->   
        storyId = Session.get('storyId')
        if storyId and Stories.findOne(_id: storyId)
            Stories.update({_id: storyId}, {$set: {published: true, publishDate: new Date()}})
