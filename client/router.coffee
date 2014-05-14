Router.map ->
	@route "home",
	    path: "/"
	    template: "home"
	    data: ->
	    	Session.set "page", @template

	@route "profile",
	    path: "profile"
	    template: "profile"
	    data: ->
	    	Session.set "page", @template

   	@route "create",
	    path: "create"
	    template: "create"
	    data: ->
	    	Session.set "page", @template	

	    	Session.set 'storyTitle', 'Story Title'
	    	Session.set 'verticalSections', []
	    	Session.set 'horizontalSections', []

   	@route "edit",
	    path: "create/:storyId"
	    template: "create"
	    waitOn: -> Meteor.subscribe('storiesPub')
	    data: ->
	    	Session.set "page", @template
	    	Session.set "storyId", @.params.storyId

	    	story = Stories.findOne(_id: @.params.storyId)
	    	console.log("Story:", story.title)
	    	Session.set "storyTitle", story.title
	    	Session.set "verticalSections", story.verticalSections
	    	Session.set "horizontalSections", story.horizontalSections


# Router.configure
# 	layoutTemplate: "layout"

# 	yieldTemplates:
# 		nav: 
# 			to: "nav"
# 		footer:
# 			to: "footer"