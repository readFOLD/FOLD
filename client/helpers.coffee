# Global handlebars helpers

Handlebars.registerHelper "debugContext", -> console.log this
Handlebars.registerHelper "log", (v) -> console.log v
Handlebars.registerHelper "pastHeader", -> Session.get "pastHeader"
Handlebars.registerHelper "read", -> Session.get "read"
Handlebars.registerHelper "addingContext", -> Session.get "addingContext"
Handlebars.registerHelper "addingContextToCurrentY", -> Session.get("addingContext") is Session.get 'currentY'
Handlebars.registerHelper "editingThisContext", -> Session.get("editingContext") is @_id
Handlebars.registerHelper "UsersCollection", Meteor.users
Handlebars.registerHelper "isAuthor", ->
  Meteor.user() and Meteor.user()._id is @authorId

Handlebars.registerHelper "cardWidth", ->
  # Be consistent about JS styling vs CSS styling
  if Session.get("narrativeView")
    return 800
  Session.get "cardWidth"

Handlebars.registerHelper "setTitle", (title) ->
  document.title = title
  return
