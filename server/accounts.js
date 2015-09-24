checkSignupCode = function(code){
  if (!code || code.toLowerCase().trim() !== 'civic'){
    throw new Meteor.Error("Deepstream is open only to select users ahead of our launch. If you'd like to watch or curate a deepstream, please email us at deepstream@media.mit.edu and ask for the *secret code*");
  }
}

Accounts.validateNewUser(function(user) {
  if (user.username){ // only if an email user. if twitter user will do this later
    if (user.emails && user.emails[0]){
      checkSignupCode(user.signupCode);
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
  }

  return user;
});

// Password Reset E-mail
Accounts.emailTemplates.from = 'Deepstream Accounts <deepstream@media.mit.edu>';
Accounts.emailTemplates.siteName = 'deepstream.tv';

Accounts.emailTemplates.resetPassword.subject = function(user, url) {
  return 'Deepstream Password Reset';
};

Accounts.emailTemplates.resetPassword.text = function(user, url) {
  url = url.replace('#/', '')
  return "To reset your password, simply click the link below:\n\n" + url + "\n\n" + "Happy Deepstreaming!\nTeam Deepstream\nhttp://deepstream.tv";
};
