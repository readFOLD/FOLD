var setTitle = function(pageName){
  if (Meteor.isClient){
    var title;
    if(pageName) {
      title = pageName + ' - Deepstream';
    } else {
      title = 'Deepstream';
    }
    document.title = title;
    $('meta[property="og:title"]').attr('content', pageName);
    $('meta[name="twitter:title"]').attr('content', pageName);
  }
};

var setMetaImage = function(imageUrl){
  if (Meteor.isClient){
    if (imageUrl){
      $('meta[property="og:image"]').attr('content', imageUrl.replace(/^\/\//, "https://")); // replace protocol-less url with https
      $('meta[property="og:image:secure_url"]').attr('content', imageUrl.replace(/^\/\//, "https://")); // replace protocol-less url with https
      $('meta[name="twitter:image"]').attr('content', imageUrl.replace(/^\/\//, "https://")); // replace protocol-less url with https
    } else {
      $('meta[property="og:image"]').attr('content', "https://readfold.com/FOLD_fb_image.png");
      $('meta[property="og:image:secure_url"]').attr('content', "https://readfold.com/FOLD_fb_image.png");
      $('meta[name="twitter:image"]').attr('content', "https://readfold.com/FOLD_twitter_image.png");
    }
  }
};

var setMetaDescription = function(desc){
  if (Meteor.isClient){
    if (desc){
      $('meta[name="description"]').attr('content', desc);
      $('meta[property="og:description"]').attr('content', desc);
      $('meta[name="twitter:description"]').attr('content', desc);
    } else {
      $('meta[name="description"]').attr('content', 'Reading, authoring, and publishing platform allowing storytellers to structure and contextualize stories.');
      $('meta[property="og:description"]').attr('content', 'Reading, authoring, and publishing platform allowing storytellers to structure and contextualize stories.');
      $('meta[name="twitter:description"]').attr('content', 'Reading, authoring, and publishing platform allowing storytellers to structure and contextualize stories.');
    }
  }
};

var setStatusCode = function(statusCode){
  if (Meteor.isClient){
    if(!statusCode){
      statusCode = '200';
    }
    $('meta[name=prerender-status-code]').remove();
    $('head').append('<meta name="prerender-status-code" content="' + statusCode + '">');
  }
};

var longTermSubs = new SubsManager({
  cacheLimit: 9999,
  expireIn: 9999
});

FlowRouter.route("/", {
  name: "home",
  action () {
    setTitle();
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("home");
  },
  subscriptions () {
    this.register('deepstreamsOnAir', longTermSubs.subscribe('deepstreamsOnAir'));
    this.register('bestStreams', longTermSubs.subscribe('bestStreams'));
    this.register('mostRecentStreams', longTermSubs.subscribe('mostRecentStreams'));
  },
  triggersEnter: [function(){
    Session.set('mediaDataType', null); // so doesn't show up on stream preview icons
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/about", {
  name: "about",
  action () {
    setTitle('About');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("about");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/terms", {
  name: "terms",
  action () {
    setTitle('Terms');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    FlowLayout.render("terms");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/watch/:userPathSegment/:streamPathSegment", {
  name: "watch",
  action (params) {
    setTitle('Stream');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    var shortId = idFromPathSegment(params.streamPathSegment);
    FlowLayout.render("watch_page", {onCuratePage: false, userPathSegment: params.userPathSegment, streamPathSegment: params.streamPathSegment, shortId: shortId});
  },
  subscriptions (params) {
    var shortId = idFromPathSegment(params.streamPathSegment);
    this.register('currentDeepstream', Meteor.subscribe('singleDeepstream', params.userPathSegment, shortId));
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/curate/:userPathSegment/:streamPathSegment", {
  name: "curate",
  action (params) {
    setTitle('Curate Stream');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    var shortId = idFromPathSegment(params.streamPathSegment);
    FlowLayout.render("watch_page", {onCuratePage: true, userPathSegment: params.userPathSegment, streamPathSegment: params.streamPathSegment, shortId: shortId});
  },
  subscriptions (params) {
    var shortId = idFromPathSegment(params.streamPathSegment);
    this.register('currentDeepstream', Meteor.subscribe('singleDeepstream', params.userPathSegment, shortId));
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }, function(){
    Session.set('curateMode', true);
  }],
  triggersExit: [function(){
    Session.set('curateMode', false);
  }]
});

FlowRouter.route("/twitter-signup", {
  name: "twitter-signup",
  subscriptions () {
    this.register('tempUser', Meteor.subscribe('tempUsernamePub'));
  },
  action () {
    // TODO these can be passed into signup render
    Session.set("emailUser", false);
    Session.set('signingInWithTwitter', false);
    setTitle('Signup');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("signup");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/email-signup", {
  name: "email-signup",
  action () {
    Session.set("emailUser", true);
    Session.set('signingInWithTwitter', false);
    setTitle('Signup');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("signup");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/signup", {
  name: "signup",
  action () {
    Session.set("emailUser", true);
    Session.set('signingInWithTwitter', false);
    setTitle('Signup');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("signup_page");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});


FlowRouter.route("/login", {
  name: "login",
  action () {
    setTitle('Login');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("login")
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/my_streams", {
  name: "my_streams",
  action () {
    setTitle('My Deep Streams');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    FlowLayout.render("my_streams");
  },
  subscriptions () {
    this.register('myDeepstreams', longTermSubs.subscribe('myDeepstreams'));
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/terms", {
  name: "terms",
  action () {
    setTitle('Terms');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    FlowLayout.render("terms");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/stats", {
  path: "stats",
  action (){
    FlowLayout.render("stats");
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

// handle user bailing in middle of twitter signup, before a username is chosen. this probably only happens on page load or reload.
FlowRouter.triggers.enter([function(context) {
  if (!Session.get('signingInWithTwitter')) { // don't forcible logout user if in the middle of twitter signup
    var user = Meteor.user();
    var currentRoute = context.route;
    if (user && currentRoute){
      if(!user.username && currentRoute !== 'twitter-signup'){ // if user has no username, confirm they are on the page where they can fill that out
        Meteor.logout(); // otherwise log them out
        setTimeout(function(){
          throw new Meteor.Error('Forcibly logged out user, presumably because they did not finish twitter signup (setting username etc...)');
        }, 0);
      }
    }
  }
}]);


FlowRouter.subscriptions = function() {
  this.register('userData', longTermSubs.subscribe('userData'));
};

//
//FlowRouter.route("privacy", {
//  path: "privacy",
//  template: "privacy",
//  action () {
//    if (this.ready()) {
//      setTitle('Privacy Policy');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  data () {},
//  onRun (){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("profile", {
//  path: "/profile/:username", // can put in display username
//  template: "profile",
//  action () {
//    if (this.ready()) {
//      setTitle(this.params.username + "'s Profile");
//      setMetaImage();
//      setMetaDescription();
//      return this.render();
//    }
//  },
//  waitOn () {
//    var username = this.params.username.toLowerCase();
//    return [Meteor.subscribe('userProfilePub', username),
//           Meteor.subscribe('userStoriesPub', username)];
//  },
//  data () {
//    var username = this.params.username.toLowerCase();
//    var user;
//      if (this.ready()) {
//        user = Meteor.users.findOne({username : username});
//        if (user) {
//          setStatusCode();
//          return {
//            user : user
//          }
//        } else {
//          setStatusCode("404");
//          this.render("user_not_found");
//        }
//      }
//  },
//  onRun (){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("recover_password", {
//  path: "recover-password",
//  template: "recover_password",
//  action () {
//    if (this.ready()) {
//      setTitle('Recover Password');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onRun (){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("reset_password", {
//  path: "reset-password/:resetPasswordToken",
//  template: "reset_password",
//  data () {
//    Session.set("resetPasswordToken", this.params.resetPasswordToken);
//  },
//  action () {
//    if (this.ready()) {
//      setTitle('Reset Password');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onRun (){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("my_story_profile", {
//  path: "my-stories",
//  template: "my_story_profile",
//  waitOn () {
//    return [Meteor.subscribe('myStoriesPub')];
//  },
//  action () {
//    if (this.ready()) {
//      setTitle('My Stories');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onBeforeAction () {
//    var user;
//    if ((user = Meteor.user()) || Meteor.loggingIn()) {
//      return this.next();
//    } else {
//      this.redirect("home", {
//        replaceState: true
//      });
//      return notifyInfo("You must be logged in to view your stories");
//    }
//  },
//  onRun (){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//
////FlowRouter.route("loading", {
////  path: "loading",
////  template: "loading_page"
////});
//

