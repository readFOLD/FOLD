Accounts.onCreateUser(function(options, user) {
 if(!options || !user) {
    throw new Meteor.Error('Error creating user');
  return;
  }

  if (user.services.twitter) {
    console.log(user.services.twitter);
    user.tempUsername = user.services.twitter.screenName;
  } else if (options.profile){
    user.profile = options.profile;
  }
  return user;
});
