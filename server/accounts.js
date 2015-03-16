Accounts.validateNewUser(function(user) {
  checkUsername(user.username);
  return true
});

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

  if (user.services.twitter) {
    user.tempUsername = user.services.twitter.screenName;
    user.profile.displayUsername = user.services.twitter.screenName;
    user.profile.twitterUser = true;
  } else {
    user.profile.displayUsername = options.username;
  }

  return user;
});
