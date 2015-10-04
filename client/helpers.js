Handlebars.registerHelper("debugContext", function() {
  return console.log(this);
});

Handlebars.registerHelper("log", function(v) {
  return console.log(v);
});

Handlebars.registerHelper("curateMode", function() {
  return Session.get("curateMode");
});

Handlebars.registerHelper("dateInPast", function(date) {
  if(!date){
    return null
  }
  return moment(date).fromNow();
});


Handlebars.registerHelper("currentContext", function(){
  return getCurrentContext()
});


Handlebars.registerHelper("hasContext", function(v) {
  return !_.isEmpty(this);
});


Handlebars.registerHelper("saving", function() {
  return Session.get("saving");
});

Handlebars.registerHelper("signingIn", function() {
  return Session.get("signingIn");
});

Handlebars.registerHelper("isContextOfType", function(type) {
  return type == this.type;
});

Handlebars.registerHelper("UsersCollection", Meteor.users);

Handlebars.registerHelper("isCurator", function() {
  return Meteor.user() && _.contains(this.curatorIds, Meteor.user()._id);
});

Handlebars.registerHelper("windowWidth", function() {
  return Session.get("windowWidth");
});

Handlebars.registerHelper("windowHeight", function() {
  return Session.get("windowHeight");
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

Handlebars.registerHelper("formatDate", window.formatDate);
Handlebars.registerHelper("formatDateNice", window.formatDateNice);
