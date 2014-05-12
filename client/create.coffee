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

Template.horizontal_context.events
    'keydown': (d) ->
        # Two-way data binding
        srcE = if d.srcElement then d.srcElement else d.target
        text = $(srcE).text()
        horizontalIndex = $(srcE).closest('section').data('index')
        horizontalSections = Session.get('horizontalSections')
        horizontalSections[Session.get('currentVertical')].data[horizontalIndex].content = text
        Session.set('horizontalSections', horizontalSections)

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
                title: title
                content: content
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
