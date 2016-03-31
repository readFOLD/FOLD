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

Handlebars.registerHelper("currentXReadableIndex", function() {
  return Session.get("currentX") + 1;
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
  var userId = Meteor.userId();
  return userId && userId === this.authorId;
});

Handlebars.registerHelper("isAuthorOrAdmin", function() {
  var userId = Meteor.userId();
  if (userId && userId === this.authorId){
    return true
  } else {
    var user = Meteor.user();
    return user && user.admin;
  }
});

Handlebars.registerHelper("cardWidth", function() {
  return Session.get("cardWidth");
});

Handlebars.registerHelper("cardHeight", function() { // for context cards, particularly in mobile
  return Session.get("cardHeight");
});

Handlebars.registerHelper("windowWidth", function() {
  return Session.get("windowWidth");
});

Handlebars.registerHelper("windowHeight", function() {
  return Session.get("windowHeight");
});

Handlebars.registerHelper("verticalLeft", function() {
  return getVerticalLeft();
});

Handlebars.registerHelper("mobileMargin", function(){
  return Session.get('mobileMargin');
});

Handlebars.registerHelper("adminMode", function() {
  return adminMode();
});

Handlebars.registerHelper("audioPopoutExists", function() {
  return Session.equals('poppedOutContextType', 'audio');
});

Handlebars.registerHelper("videoPopoutExists", function() {
  return Session.equals('poppedOutContextType', 'video');
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

Handlebars.registerHelper("userFollowing", function(id) {
  return id === Meteor.userId() || Meteor.user() && _.contains(Meteor.user().profile.following, id);
});

Handlebars.registerHelper("showStorySandwichFooter", function () {
  return !Meteor.Device.isPhone() && (embedMode() || hiddenContextMode());
});


Handlebars.registerHelper("profileImage", function(user, size) {
  var profilePicture = (user && user.profile) ? user.profile.profilePicture : null;
  var twitterId = (user && user.services && user.services.twitter) ? user.services.twitter.id : null;
  return getProfileImage(profilePicture, twitterId, size);
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

Handlebars.registerHelper("prettyDateInPast", window.prettyDateInPast)

Handlebars.registerHelper('$eq',
  function(v1, v2) {
    return (v1 === v2);
  }
);

Handlebars.registerHelper('capitalize',
  function(s) {
    return _s.capitalize(s);
  }
);

Handlebars.registerHelper("hiddenContextMode", function () {
  return window.hiddenContextMode();
});

Handlebars.registerHelper("hiddenContextShown", function () {
  return window.hiddenContextShown();
});

Handlebars.registerHelper("sandwichMode", function () {
  return window.sandwichMode();
});

Handlebars.registerHelper("embedMode", function () {
  return window.embedMode();
});

Handlebars.registerHelper("mobileOrTablet", function () {
  return window.mobileOrTablet();
});

Handlebars.registerHelper("searchOverlayShown", function () {
  return Session.get('searchOverlayShown');
});


Handlebars.registerHelper("menuOverlayShown", function () {
  return Session.get('menuOverlayShown');
});

Handlebars.registerHelper("embedOverlayShown", function () {
  return Session.get('embedOverlayShown');
});

Handlebars.registerHelper("analyticsMode", function () {
  return window.analyticsMode();
});

Handlebars.registerHelper("linkActivityShown", function () {
  return window.linkActivityShown();
});

Handlebars.registerHelper("cardDataShown", function () {
  return window.cardDataShown();
});
