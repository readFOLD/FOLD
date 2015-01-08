# Global handlebars helpers

Handlebars.registerHelper "debugContext", -> console.log this
Handlebars.registerHelper "log", (v) -> console.log v
Handlebars.registerHelper "pastHeader", -> Session.get "pastHeader"
Handlebars.registerHelper "read", -> Session.get "read"
Handlebars.registerHelper "addingContext", -> Session.get "addingContext"

Handlebars.registerHelper "cardWidth", ->
  # Be consistent about JS styling vs CSS styling
  if Session.get("narrativeView")
    return 800
  Session.get "cardWidth"

Handlebars.registerHelper "setTitle", (title) ->
  document.title = title
  return
