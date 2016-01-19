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

Handlebars.registerHelper("notRead", function() {
  return !Session.get("read");
});

Handlebars.registerHelper("showPublished", function() {
  return !Session.get("showDraft");
});

Handlebars.registerHelper("showDraft", function() {
  return Session.get("showDraft");
});

Handlebars.registerHelper("saving", function() {
  return Session.get("saving");
});

Handlebars.registerHelper("signingIn", function() {
  return window.signingIn();
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

Handlebars.registerHelper("mobileMargin", function(){
  return Session.get('mobileMargin');
});

Handlebars.registerHelper("adminMode", function() {
  return adminMode();
});

Handlebars.registerHelper("popoutExists", function() {
  return Session.get('poppedOutContextId') ? true : false;
});

Handlebars.registerHelper("reactiveStory", function(){
  return Stories.findOne(Session.get('storyId'));
});

Handlebars.registerHelper("twitterUser", function() {
  var user = Meteor.user();
  return user && user.services && user.services.twitter && user.services.twitter.id;
});

Handlebars.registerHelper("firstName", function(user) {
  if (user && user.profile) {
    return user.profile.name.split(' ')[0];
  }
});

Handlebars.registerHelper("userFavorited", function() {
  return Meteor.user() && _.contains(Meteor.user().profile.favorites, this._id);
});

Handlebars.registerHelper("profileImage", function(user, size) {
  var diameter;
  if (size === 'large'){
    diameter = 150;
  } else {
    diameter = 60;
  }
  var defaultProfilePic = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/static/placeholder_image.png';
  var dprSetting = window.isHighDensity ? ',dpr_2.0' : '';
  var twitterPic;
  if (user && user.services && user.services.twitter) {
    twitterPic = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/twitter/w_' + diameter + ',h_' + diameter + ',c_fill,g_face' + dprSetting + '/' + user.services.twitter.id
  }


  if (user && user.profile) { 
    if ( user.profile.profilePicture) {
      if ( user.profile.profilePicture < 20) { // it's a monster
        if (twitterPic){
          return twitterPic
        } else { // show monster
          return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/static/profile_monster_' + user.profile.profilePicture + '.svg';
        }
      } else {
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/w_' + diameter + ',h_' + diameter + ',c_fill,g_face' + dprSetting + '/' + user.profile.profilePicture
      }
    } else if (twitterPic) {
      return twitterPic
    }
  }

  // if nothing else served up
  return defaultProfilePic
});


Handlebars.registerHelper("formatNumber", function(num){
  if(!num){
    return 0;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Handlebars.registerHelper("formatDate", window.formatDate);
Handlebars.registerHelper("formatDateNice", window.formatDateNice);
Handlebars.registerHelper("formatDateCompact", window.formatDateCompact);
