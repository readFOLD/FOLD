Handlebars.registerHelper("debugContext", function() {
  return console.log(this);
});

Handlebars.registerHelper("log", function(v) {
  return console.log(v);
});

Handlebars.registerHelper("pastHeader", function() {
  return Session.get("pastHeader");
});

Handlebars.registerHelper("read", function() {
  return Session.get("read");
});

Handlebars.registerHelper("showDraft", function() {
  return Session.get("showDraft");
});

Handlebars.registerHelper("saving", function() {
  return Session.get("saving");
});

Handlebars.registerHelper("addingContext", function() {
  return Session.get("addingContext");
});

Handlebars.registerHelper("editingThisContext", function() {
  return Session.get("editingContext") === this._id;
});

Handlebars.registerHelper("UsersCollection", Meteor.users);

Handlebars.registerHelper("isAuthor", function() {
  return Meteor.user() && Meteor.user()._id === this.authorId;
});

Handlebars.registerHelper("cardWidth", function() {
  if (Session.get("narrativeView")) {
    return 800;
  }
  return Session.get("cardWidth");
});

Handlebars.registerHelper("setTitle", function(title) {
  document.title = title;
});

