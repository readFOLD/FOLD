Accounts.onCreateUser(function(options, user) {
   if(!options || !user) {
    console.log('error creating user');
    return;
    }
    user.tempUsername = user.services.twitter.screenname;
    return user;
});

Accounts.onLogin(function(user) {
  return user;
})