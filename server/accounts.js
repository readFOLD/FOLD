Accounts.onCreateUser(function(options, user) {
   if(!options || !user) {
    aler('error creating user');
    return;
    }
    if (user.services.twitter) {
        user.tempUsername = user.services.twitter.screenName;
    }
    return user;
});
