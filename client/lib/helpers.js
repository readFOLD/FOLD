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
  	return { status: false, message: 'Too short (minimum 3 chars)' };
  } else if (username.length > 15) {
  	return { status: false, message: 'Too long (maximum 15 chars)' };
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
  Session.set('signinStage', 'signup');
  Session.set('signingIn', str || true);
};

window.closeSignInOverlay = function(){
  Session.set('signingIn', false);
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

window.enterPress = function(e){
  return e.keyCode === 13
};
