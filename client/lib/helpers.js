window.startTime = window.performance ? window.performance.timing.navigationStart : Date.now(); // mobile safari doesn't have timing api


$.cloudinary.config({
  cloud_name: Meteor.settings["public"].CLOUDINARY_CLOUD_NAME
});


window.isHighDensity = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

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
  var usernameRegex = /^[a-zA-Z0-9-_]+$/;
  if (username.length === 0 ) {
    return { status: false, message: 'Please enter a username' };
  } else if (username.length < 3) {
  	return { status: false, message: 'Too short (minimum 3 chars)' };
  } else if (username.length > 15) {
  	return { status: false, message: 'Too long (maximum 15 chars)' };
  } else if (!username.match(usernameRegex)) {
    return { status: false, message: 'Please only use letters, numbers, -, and _' };
  } else {
    return { status: true, message: false };
  }
}
