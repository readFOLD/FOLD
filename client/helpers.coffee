# Global handlebars helpers

Handlebars.registerHelper "debugContext", -> console.log this
Handlebars.registerHelper "read", -> Session.get "read"

Handlebars.registerHelper "cardWidth", ->
  # Be consistent about JS styling vs CSS styling
  if Session.get("narrativeView")
    return 800
  Session.get "cardWidth"

Handlebars.registerHelper "setTitle", (title) ->
  document.title = title
  return