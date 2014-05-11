Session.set('verticalSections', [])

Template.create.helpers
	username: -> 
		if (Meteor.user())
			Meteor.user().emails[0].address

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

Template.add_vertical.events
    "click section": ->
    	verticalSections = Session.get('verticalSections')
    	newVerticalSection =
    		title: 'Title'
    		content: 'Content'
    	verticalSections.push(newVerticalSection)
    	Session.set('verticalSections', verticalSections)

