# Initiate session variables in route
Session.set('verticalSections', [])
Session.set('horizontalSections', [])

#$(document).scrollsnap(
#    snaps: 'div.vertical-narrative section'
#    proximity: 50
#   )


Template.create.helpers
    username: -> 
        if (Meteor.user())
            Meteor.user().emails[0].address
    horizontalExists: ->
        currentVertical = Session.get('currentVertical')        
        Session.get('horizontalSections')[currentVertical]?.data.length

Template.create.events
    "click div#save": ->
        console.log("SAVING")
        storyTitle = $('div.title').text()
        verticalTitles = []
        verticalContent = []
        $('section.vertical-narrative-section').each((i) ->
            title = $.trim($(this).find('div.title').text())
            content = $.trim($(this).find('div.content').text())
            verticalTitles.push(title)
            verticalContent.push(content)
            )
        console.log(storyTitle)
        console.log(verticalTitles)
        console.log(verticalContent)

Template.vertical_narrative.helpers
    verticalSections: -> Session.get('verticalSections')

Template.horizontal_context.helpers
    verticalExists: -> (Session.get('verticalSections').length > 0)
    horizontalSections: -> Session.get('horizontalSections')
    horizontalShown: -> Session.equals("currentVertical", @index)

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
            index: horizontalSections[Session.get('currentVertical')].length
        horizontalSections[Session.get('currentVertical')].data.push(newHorizontalSection)
        Session.set('horizontalSections', horizontalSections)        
