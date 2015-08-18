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
  action: function() {
    setTitle();
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    return FlowLayout.render("home");
  },
  subscriptions: function() {
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
  action: function() {
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
  action: function() {
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
  action: function(params) {
    setTitle('Stream');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    var shortId = idFromPathSegment(params.streamPathSegment);
    FlowLayout.render("watch", {onCuratePage: false, userPathSegment: params.userPathSegment, streamPathSegment: params.streamPathSegment, shortId: shortId});
  },
  subscriptions: function(params) {
    var shortId = idFromPathSegment(params.streamPathSegment);
    this.register('currentDeepstream', Meteor.subscribe('singleDeepstream', params.userPathSegment, shortId));
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/curate/:userPathSegment/:streamPathSegment", {
  name: "curate",
  action: function(params) {
    setTitle('Curate Stream');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    var shortId = idFromPathSegment(params.streamPathSegment);
    FlowLayout.render("watch", {onCuratePage: true, userPathSegment: params.userPathSegment, streamPathSegment: params.streamPathSegment, shortId: shortId});
  },
  subscriptions: function(params) {
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
  subscriptions: function() {
    this.register('tempUser', Meteor.subscribe('tempUsernamePub'));
  },
  action: function() {
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
  action: function() {
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
  action: function() {
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
  action: function() {
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
  action: function() {
    setTitle('My Deep Streams');
    setMetaImage();
    setMetaDescription();
    setStatusCode();
    FlowLayout.render("my_streams");
  },
  subscriptions: function() {
    this.register('myDeepstreams', longTermSubs.subscribe('myDeepstreams'));
  },
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});

FlowRouter.route("/terms", {
  name: "terms",
  action: function() {
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
  action: function(){
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
//  action: function() {
//    if (this.ready()) {
//      setTitle('Privacy Policy');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  data: function() {},
//  onRun: function(){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("profile", {
//  path: "/profile/:username", // can put in display username
//  template: "profile",
//  action: function() {
//    if (this.ready()) {
//      setTitle(this.params.username + "'s Profile");
//      setMetaImage();
//      setMetaDescription();
//      return this.render();
//    }
//  },
//  waitOn: function() {
//    var username = this.params.username.toLowerCase();
//    return [Meteor.subscribe('userProfilePub', username),
//           Meteor.subscribe('userStoriesPub', username)];
//  },
//  data: function() {
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
//          // TODO add 404 tags for seo etc...
//        }
//      }
//  },
//  onRun: function(){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("recover_password", {
//  path: "recover-password",
//  template: "recover_password",
//  action: function() {
//    if (this.ready()) {
//      setTitle('Recover Password');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onRun: function(){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("reset_password", {
//  path: "reset-password/:resetPasswordToken",
//  template: "reset_password",
//  data: function() {
//    Session.set("resetPasswordToken", this.params.resetPasswordToken);
//  },
//  action: function() {
//    if (this.ready()) {
//      setTitle('Reset Password');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onRun: function(){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("my_story_profile", {
//  path: "my-stories",
//  template: "my_story_profile",
//  waitOn: function() {
//    return [Meteor.subscribe('myStoriesPub')];
//  },
//  action: function() {
//    if (this.ready()) {
//      setTitle('My Stories');
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onBeforeAction: function() {
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
//  onRun: function(){
//    $('html, body').scrollTop(0);
//    this.next();
//  }
//});
//
//FlowRouter.route("read", {
//  path: "read/:userPathSegment/:storyPathSegment",
//  template: "read",
//  waitOn: function() { // subscribe and wait for story if don't have it yet
//    var shortId = idFromPathSegment(this.params.storyPathSegment);
//    var story = Stories.findOne({shortId: shortId}, {reactive: false, fields: {verticalSections: 1}});
//    if (story && story.verticalSections) { // confirm that full "read story" is loaded
//      return [];
//    } else {
//      return [Meteor.subscribe('readStoryPub', this.params.userPathSegment, shortId)]; // NOTE: this subscription is stopped as soon as the story is found the way this is currently structured 4/30/15 ba84a22b
//    }
//  },
//  action: function() {
//    if (this.ready()) {
//      return this.render();
//    }
//  },
//
//  data: function() {
//    var story;
//    if (this.ready()){
//      var shortId = idFromPathSegment(this.params.storyPathSegment);
//      story = Stories.findOne({shortId: shortId}, {reactive: false});
//      if (story) {
//        Session.set("story", story);
//        Session.set("storyId", story._id);
//        Session.set("storyShortId", shortId);
//        Session.set("headerImage", story.headerImage);
//        Session.set("horizontalSectionsMap", _.map(_.pluck(story.verticalSections, "contextBlocks"), function (cBlockIds, i) {
//          return {
//            verticalIndex: i,
//            horizontal: _.map(cBlockIds, function (id, i) {
//              return {
//                _id: id,
//                horizontalIndex: i
//              }
//            })
//          };
//        }));
//        setTitle(story.title);
//        setMetaImage(story.headerImageUrl());
//        setMetaDescription(story.contentPreview());
//        setStatusCode();
//        return story;
//      } else {
//        setTitle("Story not found");
//        setMetaImage();
//        setMetaDescription();
//        setStatusCode("404");
//        this.render("story_not_found");
//        // TODO add 404 tags for seo etc...
//      }
//    }
//  },
//  onRun: function(){
//    Session.set("wrap", {});
//    Session.set("currentXByYId", {});
//    Session.set("showMinimap", true);
//    Session.set("mobileContextView", false);
//    Session.set("currentY", null);
//    Session.set("previousY", null);
//    Session.set("scrollTop", 0);
//    $(window).scrollTop(0);
//    this.next();
//  },
//  onBeforeAction: function() {
//    Session.set("newStory", false);
//    Session.set("read", true);
//
//    return this.next();
//  },
//  onAfterAction: function(){
//    Session.set("showDraft", false);
//  }
//});
//
//
//FlowRouter.route("edit", {
//  path: "create/:userPathSegment/:storyPathSegment",
//  template: "create",
//  waitOn: function() {
//    shortId = idFromPathSegment(this.params.storyPathSegment);
//    return [Meteor.subscribe('createStoryPub', this.params.userPathSegment, shortId), Meteor.subscribe('contextBlocksPub', shortId)];
//  },
//  data: function() {
//    var story;
//    if (this.ready()) {
//      var shortId = idFromPathSegment(this.params.storyPathSegment);
//      story = Stories.findOne({shortId: shortId});
//      if (story && story.draftStory) {
//        Session.set("story", story.draftStory);
//        Session.set("storyId", story._id);
//        Session.set("storyShortId", shortId);
//        Session.set("storyPublished", story.published);
//        Session.set("headerImage", story.draftStory.headerImage);
//        Session.set("userPathSegment", this.params.userPathSegment);
//
//        Session.set("horizontalSectionsMap", _.map(_.pluck(story.draftStory.verticalSections, "contextBlocks"), function (cBlockIds, i) {
//          return {
//            verticalIndex: i,
//            horizontal: _.map(cBlockIds, function (id, i) {
//              return {
//                _id: id,
//                horizontalIndex: i
//              }
//            })
//          };
//        }));
//        setTitle('Editing: ' + story.draftStory.title || 'a new story');
//        setStatusCode();
//        return story;
//      } else {
//        setTitle('Story not found');
//        setStatusCode('404');
//        this.render("story_not_found");
//        // TODO add 404 tags for seo etc...
//      }
//    }
//  },
//  onRun: function(){
//    Session.set("wrap", {});
//    Session.set("currentXByYId", {});
//    Session.set("currentY", null);
//    Session.set("previousY", null);
//    Session.set("read", false);
//    Session.set("newStory", false);
//    Session.set("showDraft", true);
//    Session.set("showMinimap", true);
//    Session.set('saveState', 'saved');
//    Session.set('scrollTop', 0);
//    $(window).scrollTop(0);
//
//    if (Meteor.isClient){
//      window.readyToMigrate.set(false);
//    }
//    this.next();
//  },
//  action: function() {
//    if (this.ready()) {
//      setMetaImage();
//      setMetaDescription();
//      setStatusCode();
//      return this.render();
//    }
//  },
//  onBeforeAction: function() {
//    var user, data;
//    if ((user = Meteor.user()) || Meteor.loggingIn()) { // if there is a user
//      data = this.data();
//      if (user && data && user._id !== data.authorId) { // if they don't own the story take them to story not found
//        return this.render("story_not_found");
//      }
//      var accessPriority = Meteor.user().accessPriority;
//      if (!accessPriority || accessPriority > window.createAccessLevel){
//        this.redirect("home", {
//          replaceState: true
//        });
//        notifyInfo("Creating and editing stories is temporarily disabled, possibly because things blew up (in a good way). Sorry about that! We'll have everything back up as soon as we can. Until then, why not check out some of the other great content authors in the community have written?")
//      }
//      return this.next(); // if they do own the story, let them through to create
//    } else {
//      Session.set('signingIn', true); // if there is no user, take them to the signin page
//      this.redirect("home", { // TO-DO, after they sign in, they should get back to the create page
//        replaceState: true
//      });
//      return this.next();
//    }
//  }
//});
//
//



//
////FlowRouter.route("loading", {
////  path: "loading",
////  template: "loading_page"
////});
//

