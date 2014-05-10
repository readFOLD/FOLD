Router.map ->
	@route "home",
	    path: "/"
	    template: "home"
	    data: ->
	    	Session.set "page", @template

   	@route "home",
	    path: "create"
	    template: "create"
	    data: ->
	    	Session.set "page", @template

# Router.configure
# 	layoutTemplate: "layout"

# 	yieldTemplates:
# 		nav: 
# 			to: "nav"
# 		footer:
# 			to: "footer"