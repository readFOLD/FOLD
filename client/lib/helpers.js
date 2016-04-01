window.startTime = window.performance ? window.performance.timing.navigationStart : Date.now(); // mobile safari doesn't have timing api


$.cloudinary.config({
  cloud_name: Meteor.settings["public"].CLOUDINARY_CLOUD_NAME
});


window.isHighDensity = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

// browser detection
window.isChrome = navigator.userAgent.indexOf('Chrome') > -1;
window.isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
window.isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
window.isSafari = navigator.userAgent.indexOf("Safari") > -1;
window.isOpera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
if ((isChrome)&&(isSafari)) {isSafari=false;}
if ((isChrome)&&(isOpera)) {isChrome=false;}

window.isValidPassword = function(p) {
  if (p.length >= 6) {
    return true;
  } else {
    return false;
  }
}

window.trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

window.checkValidEmail = function(email) {
  if (email.length === 0 ) {
    return { status: false, message: 'Please enter your e-mail address' };
  } else if (!SimpleSchema.RegEx.Email.test(email)) {
    return { status: false, message: 'Invalid e-mail address' };
  } else {
    return { status: true, message: false };
  }
};

window.checkValidName = function(name) {
  if (name.length === 0 ) {
    return { status: false, message: 'Please enter your name' };
  } else if (name.length > 127 ) {
    return { status: false, message: 'Too long (maximum 127 characters)' };
  } else {
    return { status: true, message: false };
  }
};

window.checkValidPassword = function(p1) {
  if (p1.length === 0 ) {
    return { status: false, message: 'Please enter a password' };
  } else if (!isValidPassword(p1)) {
    return { status: false, message: 'Too short (minimum 6 characters)' };
  } else {
    return { status: true, message: false };
  }
};

window.checkValidPasswordConfirmation = function(p1, p2) {
  if (p2.length && p1!==p2) {
    return { status: false, message: 'Passwords do not match' };
  } else {
    return { status: true, message: false };
  }
};

window.checkValidUsername = function(username) {
  var usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (username.length === 0 ) {
    return { status: false, message: 'Please enter a username' };
  } else if (username.length < 3) {
  	return { status: false, message: 'Too short (minimum 3 characters)' };
  } else if (username.length > 15) {
  	return { status: false, message: 'Too long (maximum 15 characters)' };
  } else if (!username.match(usernameRegex)) {
    return { status: false, message: 'Please only use letters, numbers, and _' };
  } else {
    return { status: true, message: false };
  }
}

window.incrementReactiveVar = function(rv){
  return rv.set(rv.get() + 1);
}


window.openSignInOverlay = function(str){
  if(str === 'login'){
    Session.set('signinStage', 'login');
    Session.set('signingIn', true);
  } else {
    Session.set('signinStage', 'signup');
    Session.set('signingIn', str || true);
  }
};

window.closeSignInOverlay = function(){
  Session.set('signingIn', false);
};

window.signingIn = function(){
  return Session.get('signingIn');
};


window.adminMode = function() {
  if (Session.get("adminMode")){
    var user = Meteor.user();
    if (user){
      return user.admin ? true : false;
    }
  }
};

var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.formatDate = function (date) {
  if (date) {
    var hms;
    hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
  }
};

// February 7th, 2015
window.formatDateNice = function (date) {
  if (date){
    return monthNames[(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear();
  }

};

// 2/7/2015
window.formatDateCompact = function (date) {
  if (date){
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }

};

var oneDay = 1000 * 60 * 60 * 24;
var oneWeek = oneDay * 7;
var oneMonth = oneDay * 30;

window.prettyDateInPast = function(date){
  if(date){
    var now = new Date();

    var dayDistance = (now.getDay() - date.getDay());
    if(dayDistance < 0){
      dayDistance += 7;
    }

    var exactDistance = now - date;

    if(exactDistance <= oneDay && dayDistance === 0){
      return 'Today'
    } else if (exactDistance <= oneWeek) {
      if(dayDistance === 0){
        return 'One week ago'
      } else if(dayDistance === 1){
        return 'Yesterday'
      } else {
        return dayDistance + ' days ago'
      }
    } else if (exactDistance <= oneWeek * 1.5) {
      return 'One week ago'
    } else if (exactDistance <= oneMonth) {
      return Math.round(new Date(exactDistance).getDate() / 7) + ' weeks ago'
    } else {
      return formatDateNice(date);
    }
  }

};

window.trackingInfoFromStory = function(story) {
  return _.chain(story)
    .pick([
      '_id',
      'authorDisplayUsername',
      'authorId',
      'authorName',
      'authorUsername',
      'createdAt',
      'editorsPick',
      'editorsPickAt',
      'firstPublishedAt',
      'headerImageFormat',
      'keywords',
      'narrativeRightsReserved',
      'publishedAt',
      'savedAt',
      'shortId',
      'title'])
    .extend(story.published ? {
      'numberOfContextBlocks': story.contextBlockIds.length,
      'numberOfVerticalSections': story.verticalSections.length,
      'favorites': story.favoritedTotal,
      'numberofKeywords': story.keywords.length,
      'titleLength': story.title.length
    } : {})
    .extend(story.countContextTypes ? story.countContextTypes() : {}) // TODO Fix
    .value();
};

window.enterPress = function(e){
  return e.keyCode === 13
};

Tracker.autorun(function(){
  var currentRoute = Router.current();
  var info = {};
  if(currentRoute && currentRoute.route){
    _.extend(info, {
      currentRouteName: currentRoute.route.getName()
    })
  }
  window.trackingInfoFromPage = info;
});

window.trackEvent = function(){
  arguments[1] = arguments[1] || {};
  _.extend(arguments[1], trackingInfoFromPage, { currentRoutePath: window.location.pathname });
  analytics.track.apply(this, arguments);
};

var preventDefault = function(event) {
  event.preventDefault();
};

window.freezePageScroll = function(){
  var b = $('body');
  var normalw = window.innerWidth;
  var scrollBarWidth = normalw - b.width();

  document.body.style.overflowY = 'hidden';
  document.body.style.marginRight = scrollBarWidth + 'px';
  $('.home-top.fat').width('calc(100% - ' + scrollBarWidth +'px');

  if(mobileOrTablet()){
    window.document.body.addEventListener("touchmove", preventDefault, false);
  }
};

window.unfreezePageScroll = function(){
  document.body.style.overflowY = 'auto';
  document.body.style.marginRight = 0;
  $('.home-top.fat').width('100%');

  if(mobileOrTablet()) {
    window.document.body.removeEventListener("touchmove", preventDefault, false);
  }
};

window.sandwichMode = function(){
  return window.embedMode() && !window.hiddenContextMode();
};


window.activateHiddenContextMode = function(){
  return Session.set('hiddenContextMode', true);
};

window.deactivateHiddenContextMode = function(){
  return Session.set('hiddenContextMode', false);
};

window.hiddenContextMode = function(){
  return Session.equals('hiddenContextMode', true);
};

window.hiddenContextShown = function(){
  return Session.equals('hiddenContextShown', true);
};

window.embedMode = function(){
  return Session.equals('embedMode', true);
};

window.activateEmbedMode = function(){
  window.constants.readModeOffset = 0;
  $('body').addClass('embed-mode');
  return Session.set('embedMode', true);
};

window.mobileOrTablet = function(){
  return Meteor.Device.isPhone() || Meteor.Device.isTablet()
};

window.openSearchOverlay = function(){
  return Session.set('searchOverlayShown', true);
};

window.closeSearchOverlay = function(){
  return Session.set('searchOverlayShown', false);
};

window.openMenuOverlay = function(){
  return Session.set('menuOverlayShown', true);
};

window.closeMenuOverlay = function(){
  return Session.set('menuOverlayShown', false);
};

window.openEmbedOverlay = function(){
  return Session.set('embedOverlayShown', true);
};

window.closeEmbedOverlay = function(){
  return Session.set('embedOverlayShown', false);
};

window.openHowToOverlay = function(){
  return Session.set('howToOverlayShown', true);
};

window.closeHowToOverlay = function(){
  return Session.set('howToOverlayShown', false);
};

window.analyticsMode = function(){
  return Session.get('analyticsMode', true);
};

window.activateAnalyticsMode = function(){
  return Session.set('analyticsMode', true);
};

window.deactivateAnalyticsMode = function(){
  return Session.set('analyticsMode', false);
};

window.linkActivityShown = function () {
  return window.analyticsMode() && Session.get('showLinkActivity');
};

window.cardDataShown = function () {
  return window.analyticsMode() && Session.get('showCardData');
};

window.getCardWidth = function(windowWidth) {
  if (Meteor.Device.isPhone()) {
    return Session.get("windowWidth") * .9 - 2 * Session.get("separation");
  } else if (hiddenContextMode()){
    if(windowWidth <= 685){ // must match up with @resizing-context
      return Session.get("windowWidth") * .9 - 2 * Session.get("separation") - 2 * 60;
    } else {
      return 520;
    }
  } else if (windowWidth <= window.constants.minPageWidth) {
    return 400;
  } else {
    return Math.min(520, (windowWidth - (16 * 3) - (88 * 2)) / 2);
  }
};
