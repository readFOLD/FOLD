# Initiate session variables in route


#$(document).scrollsnap(
#    snaps: 'div.vertical-narrative section'
#    proximity: 50
#   )

Template.create.helpers
    storyTitle: ->
        Session.get('storyTitle')
    username: -> 
        if (Meteor.user())
            Meteor.user().emails[0].address
    horizontalExists: ->
        currentVertical = Session.get('currentVertical')        
        Session.get('horizontalSections')[currentVertical]?.data.length

Template.vertical_narrative.helpers
    verticalSections: -> Session.get('verticalSections')

Template.horizontal_context.helpers
    verticalExists: -> (Session.get('verticalSections').length > 0)
    horizontalSections: -> Session.get('horizontalSections')
    horizontalShown: -> Session.equals("currentVertical", @index)

renderTemplate = (d, templateName) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    parentSection.empty()
    UI.insert(UI.render(templateName), parentSection.get(0))

Template.horizontal_context.events
    'click img.text-button': (d) -> renderTemplate(d, Template.create_text_section)
    'click img.photo-button': (d) -> renderTemplate(d, Template.create_image_section)
    'click img.map-button': (d) -> renderTemplate(d, Template.create_map_section)
    'click img.youtube-button': (d) -> renderTemplate(d, Template.create_youtube_section)
    'click img.gifgif-button': (d) -> renderTemplate(d, Template.create_gifgif_section)
    'click img.audio-button': (d) -> renderTemplate(d, Template.create_audio_section)

Template.add_vertical.events
    "click section": ->
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

Template.add_horizontal.events
    "click section": ->
        # Append Horizontal Section to Current Horizontal Context
        horizontalSections = Session.get('horizontalSections')
        newHorizontalSection = 
            content: "Test"
            index: horizontalSections[Session.get('currentVertical')].data.length
        horizontalSections[Session.get('currentVertical')].data.push(newHorizontalSection)
        Session.set('horizontalSections', horizontalSections)   

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
        console.log('Saving Text')

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

    "click div#publish": ->   
        console.log('Publish')
