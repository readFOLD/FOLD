
var reservedUsernames = [
  'joe',
  'joegoldbeck',
  'goldbeck',
  'joseph',
  'alexis',
  'hope',
  'alexishope',
  'kevin',
  'kevinhu',
  'nathalie',
  'nhuynh3',
  'fold',
  'readfold',
  'civic',
  'civicmedia',
  'whitehouse',
  'thewhitehouse',
  'potus',
  'scotus',
  'flotus',
  'medialab',
  'mit',
  'thepope',
  'obama',
  'barackobama',
  'pontifex',
  'usa'
];

var checkUsername = function(username) {
  if(username && _.contains(reservedUsernames, username.toLowerCase())){
    throw new Meteor.Error('This username is reserved. Please email us at fold@media.mit.edu if you have rights to this name.')
  }
};

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
