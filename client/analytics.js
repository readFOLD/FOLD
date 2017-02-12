
// Google Analytics Snippet //
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// End Snippet //


// Initiate Google Analytics
ga('create', Meteor.settings["public"].GA_TRACKING_KEY, 'auto');


Router.onRun(function() {
  Meteor.setTimeout(() => {
    $('meta[property="og:url"]').attr('content', window.location.href);

    ga('send', 'pageview', {
      title: this.route.getName(),
      location: window.location.href
    }); // maybe should be more page info here
  }, 100); // this might even be ok when set to 0

  this.next()
});

window.trackTiming = function(category, str, time){  // mobile safari doesn't have timing api so those results will not include initial request time
  trackEvent(str, {
    time: time,
    nonInteraction: 1
  });

  ga('send', 'timing', category, str, time);
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

      var userId = Meteor.userId();
      if (! userId)
        return;

      ga('set', 'userId', userId);

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
