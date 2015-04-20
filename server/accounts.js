checkSignupCode = function(code){
  if (!code || ['begin', 'mlmember', 'mlmembers'].indexOf(code.toLowerCase().trim()) === -1){
    throw new Meteor.Error("FOLD is open only to select authors ahead of our launch in early April. If you'd like to write a story, please email us at fold@media.mit.edu and ask for the *secret code*");
  }
};

Accounts.validateNewUser(function(user) {
  if (user.username){ // only if an email user. if twitter user will do this later
    checkSignupCode(user.signupCode);
    if (user.emails && user.emails[0]){
      checkUserSignup(user.username, user.emails[0].address);
    } else {
      throw new Meteor.Error('Please enter your email')
    }
  }
  return true
});

if (!Meteor.settings.NEW_USER_ACCESS_PRIORITY) {
  throw new Meteor.Error('Meteor.settings.NEW_USER_ACCESS_PRIORITY is required')
}

Accounts.onCreateUser(function(options, user) {
 if(!options || !user) {
    throw new Meteor.Error('Error creating user');
  return;
  }

  if (options.profile) {
    user.profile = options.profile;
  } else {
    user.profile = {};
  }

  if (options.signupCode) {
    user.signupCode = options.signupCode;
  }

  if (user.username === 'author') {
    user.accessPriority = options.accessPriority;
  } else {
    user.accessPriority = parseInt(Meteor.settings.NEW_USER_ACCESS_PRIORITY);
  }

  if (user.services.twitter) { // twitter signup
    user.tempUsername = user.services.twitter.screenName;
    user.profile.twitterUser = true;
  } else { // email signup
    user.profile.displayUsername = options.username;
  }

  return user;
});
