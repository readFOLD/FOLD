Router.map ->
	@route "home",
	    path: "/"
	    template: "home"
	    waitOn: -> Meteor.subscribe('exploreStoriesPub', '', '', '')
	    onRun: -> $('html, body').scrollTop(0)
	    data: ->
	    	console.log(this)
	    	Session.set "page", "explore"

	@route "profile",
	    path: "profile/:userId"
	    template: "profile"
	    data: ->
	    	Session.set "page", "profile"
	    	Session.set "userId", @.params.userId

   	@route "read",
	    path: "read/:storyDashTitle"
	    template: "read"
	    onRun: -> $('html, body').scrollTop(0)
	    onBeforeAction: -> @subscribe('readStoryPub', @.params.storyDashTitle).wait()
	    action: -> if @ready() then @render()
	    data: ->
	    	# Get rid of these
	    	Session.set "newStory", false
	    	Session.set "read", true
	    	Session.set "page", "read"

	    	return Stories.findOne()

	    	# story = Stories.findOne(storyDashTitle: @.params.storyDashTitle)
	    	# console.log(story)
	    	# Session.set "storyTitle", story.title
	    	# Session.set "verticalSections", story.verticalSections
	    	# Session.set "horizontalSections", story.horizontalSections


   	@route "create",
	    path: "create"
	    template: "create"
	    onRun: -> $('html, body').scrollTop(0)
	    waitOn: -> Meteor.subscribe('createStoryPub', @.params.storyDashTitle)
	    data: ->
	    	Session.set "newStory", true
	    	Session.set "read", false
	    	Session.set "page", "create"

	    	Session.set 'storyTitle', 'Story Title'
	    	Session.set 'verticalSections', []
	    	Session.set 'horizontalSections', []

   	@route "edit",
	    path: "create/:storyDashTitle"
	    template: "create"
	    waitOn: -> Meteor.subscribe('storiesPub')
	    data: ->
	    	Session.set "newStory", false
	    	Session.set "read", false
	    	Session.set "page", "create"
	    	Session.set "storyDashTitle", @.params.storyDashTitle

	    	story = Stories.findOne(storyDashTitle: @.params.storyDashTitle)
	    	Session.set "storyTitle", story.title
	    	Session.set "verticalSections", story.verticalSections
	    	Session.set "horizontalSections", story.horizontalSections