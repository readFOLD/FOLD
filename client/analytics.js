
analytics.load(Meteor.settings["public"].SEGMENT_WRITE_KEY); // TODO check server for env var via meteor method

// NOTE this stops running after hot code reload https://github.com/iron-meteor/iron-router/issues/1219
Router.onRun(function() {
  var that = this;

  setTimeout(function(){
    analytics.page(that.route.getName()); // maybe should be more page info here
  }, 100); // this might even be ok when set to 0

  this.next()
});



Meteor.startup(function() {
  Tracker.autorun(function(c) {
    // waiting for user subscription to load
    if (! Router.current() || ! Router.current().ready())
      return;

    var user = Meteor.user();
    if (! user)
      return;

    analytics.identify(user._id, {
      name: user.profile.name,
      email: user.emails[0].address
    });

    c.stop();
  });
});

// TODO alias user when created

//Accounts.createUser({
//  email: email,
//  password: password,
//  profile: {
//    name: name
//  }
//}, function(error) {
//  if (! error) {
//    analytics.alias(Meteor.userId());
//  } else {
//    alert('Error creating account!\n' + EJSON.stringify(error));
//  }
//});
