
analytics.load(Meteor.settings["public"].SEGMENT_WRITE_KEY);

Router.onRun(function() {
  var that = this;

  Meteor.setTimeout(function(){
    $('meta[property="og:url"]').attr('content', window.location.href);
    analytics.page(that.route.getName()); // maybe should be more page info here
  }, 100); // this might even be ok when set to 0

  this.next()
});

window.trackTiming = function(category, str, time){  // mobile safari doesn't have timing api so those results will not include initial request time
  analytics.track(str, {time: time});

  analytics.ready(function(){
    ga('send', 'timing', category, str, time);
  });
};

var jsLoadTime = Date.now() - startTime;

if (!window.codeReloaded){
  trackTiming('JS', 'JS Loaded', jsLoadTime);
}


Meteor.startup(function() {

  if (!window.codeReloaded) {
    var timeTillDOMReady = Date.now() - startTime;

    trackTiming('DOM', 'DOM Ready', timeTillDOMReady);

    Tracker.autorun(function(c) {
      // waiting for user subscription to load
      if (! Router.current() || ! Router.current().ready())
        return;

      var user = Meteor.user();
      if (! user)
        return;

      var identificationInfo = {};

      if (user.profile.name){
        identificationInfo.name = user.profile.name;
      }
      if (user.emails && user.emails.length){
        identificationInfo.email = user.emails[0].address;
      }

      if (user._id){
        analytics.identify(user._id, identificationInfo);
      }

      c.stop();
    });
  }
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
