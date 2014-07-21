Router.map ->
	@route "home",
	    path: "/"
	    template: "home"
	    onRun: -> $('html, body').scrollTop(0)
	    onBeforeAction: -> @subscribe('exploreStoriesPub', '', '', '').wait()
	    action: -> if @ready() then @render()
	    data: ->
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

   	@route "create",
	    path: "create"
	    template: "create"
	    onRun: -> $('html, body').scrollTop(0)
	    data: ->
	    	Session.set "newStory", true
	    	Session.set "read", false
	    	Session.set "page", "create"

	    	# Proper way to initiate blank template?
	    	Session.set 'storyTitle', 'Story Title'
	    	Session.set 'verticalSections', []
	    	Session.set 'horizontalSections', []
	    	return Stories.findOne()

   	@route "edit",
	    path: "create/:storyDashTitle"
	    template: "create"
	    onRun: -> $('html, body').scrollTop(0)
	    onBeforeAction: -> @subscribe('createStoryPub', @.params.storyDashTitle).wait()
	    action: -> if @ready() then @render()
	    data: ->
	    	Session.set "newStory", false
	    	Session.set "read", false
	    	Session.set "page", "create"
	    	Session.set "storyDashTitle", @.params.storyDashTitle
	    	return Stories.findOne()