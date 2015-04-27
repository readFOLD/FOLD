Handlebars.registerHelper("debugContext", function() {
  return console.log(this);
});

Handlebars.registerHelper("log", function(v) {
  return console.log(v);
});

Handlebars.registerHelper("hasContext", function(v) {
  return !_.isEmpty(this);
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

Handlebars.registerHelper("signingIn", function() {
  return Session.get("signingIn");
});

Handlebars.registerHelper("currentYId", function() {
  return Session.get("currentYId");
});

Handlebars.registerHelper("addingContext", function() {
  return Session.get("addingContext");
});

Handlebars.registerHelper("editingThisContext", function() {
  var editingContext = Session.get("editingContext");
  if (editingContext){
    return editingContext === this._id;
  }
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

Handlebars.registerHelper("windowWidth", function() {
  return Session.get("windowWidth");
});

Handlebars.registerHelper("windowHeight", function() {
  return Session.get("windowHeight");
});

Handlebars.registerHelper("verticalLeft", function() {
  return Session.get("verticalLeft");
});

Handlebars.registerHelper("profileImage", function(user, size) {
  var diameter;
  if (size === 'large'){
    diameter = 150;
  } else {
    diameter = 60;
  }
  var dprSetting = window.isHighDensity ? ',dpr_2.0' : '';
  if (user && user.profile) { 
    if ( user.profile.profilePicture) {
      return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/w_' + diameter + ',h_' + diameter + ',c_fill,g_face' + dprSetting + '/' + user.profile.profilePicture
    } else if (user.services && user.services.twitter) {
      return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/twitter/w_' + diameter + ',h_' + diameter + ',c_fill,g_face' + dprSetting + '/' + user.services.twitter.id
    }
  }
});
