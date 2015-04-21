Accounts.validateNewUser(function(user) {
  if (user.username){ // only if an email user. if twitter user will do this later
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

  if (user.username === 'author') {
    user.accessPriority = options.accessPriority;
  } else {
    user.accessPriority = parseInt(Meteor.settings.NEW_USER_ACCESS_PRIORITY);
  }

  if (user.services.twitter) { // twitter signup
    user.tempUsername = user.services.twitter.screenName;
  } else { // email signup
    user.displayUsername = options.username;
  }

  return user;
});

// Password Reset E-mail
Accounts.emailTemplates.from = 'FOLD Accounts <fold@media.mit.edu>';
Accounts.emailTemplates.siteName = 'readfold.com',

Accounts.emailTemplates.resetPassword.subject = function(user, url) {
  return 'FOLD Password Reset';
};

Accounts.emailTemplates.resetPassword.text = function(user, url) {
  url = url.replace('#/', '')
  return "To reset your password, simply click the link below:\n\n" + url + "\n\n" + "Happy FOLDing!\nFOLD Team\nhttp://readFOLD.com";
};
