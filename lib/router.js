var setTitle = function(pageName){
  if (Meteor.isClient){
    var title;
    if(pageName) {
      title = pageName + ' - FOLD';
    } else {
      title = 'FOLD';
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
      $('meta[property="og:image"]').attr('content', "http://res.cloudinary.com/fold/image/upload/v1/static/FOLD_fb_image.png");
      $('meta[property="og:image:secure_url"]').attr('content', "https://res.cloudinary.com/fold/image/upload/v1/static/FOLD_fb_image.png");
      $('meta[name="twitter:image"]').attr('content', "https://res.cloudinary.com/fold/image/upload/v1/static/FOLD_twitter_image.png");
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

var shortTermSubs = new SubsManager({
  cacheLimit: 1,
  expireIn: 1
});

Router.route("home", {
  path: "/",
  template: "home",
  action () {
    if (this.ready()) {
      setTitle();
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  waitOn (){
    return [shortTermSubs.subscribe('curatedAndUserFollowingStoriesPub', {preview: true})];
  },
  fastRender: true,
  data () {},
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("about", {
  path: "/about",
  onBeforeAction (){
    this.redirect("/read/FOLD/what-is-fold-TiyWEK6C", {}, {
      replaceState: true
    });
  },
  action () {
    if (this.ready()) {
      setTitle('About');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  data () {},
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("terms", {
  path: "/terms",
  template: "terms",
  action () {
    if (this.ready()) {
      setTitle('Terms');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  data () {},
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("privacy", {
  path: "/privacy",
  template: "privacy",
  action () {
    if (this.ready()) {
      setTitle('Privacy Policy');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  data () {},
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("profile", {
  path: "/profile/:username", // can put in display username
  template: "profile",
  action () {
    if (this.ready()) {
      setTitle(this.params.username + "'s Profile");
      setMetaImage();
      setMetaDescription();
      return this.render();
    }
  },
  waitOn () {
    var username = this.params.username.toLowerCase();
    var subs = [Meteor.subscribe('userProfilePub', username),
           Meteor.subscribe('userStoriesPub', username)];

    var user = Meteor.user();

    if(user && Meteor.user().username === username){ // if users own profile
      subs.push(Meteor.subscribe('myStoriesPub'));
    }

    return subs;
  },
  data () {
    var username = this.params.username.toLowerCase();
    var user;
      if (this.ready()) {
        user = Meteor.users.findOne({username : username});
        if (user) {
          setStatusCode();
          return {
            user : user          
          }
        } else {
          setStatusCode("404");
          this.render("user_not_found");
          // TODO add 404 tags for seo etc...
        }
      }
  },
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("reset_password", {
  path: "/reset-password/:resetPasswordToken",
  template: "reset_password",
  data () {
    Session.set("resetPasswordToken", this.params.resetPasswordToken);
  },
  action () {
    if (this.ready()) {
      setTitle('Reset Password');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("my_story_profile", {
  path: "/my-stories",
  template: "my_story_profile",
  waitOn () {
    return [Meteor.subscribe('myStoriesPub')];
  },
  action () {
    if (this.ready()) {
      setTitle('My Stories');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  onBeforeAction () {
    var user;
    if ((user = Meteor.user()) || Meteor.loggingIn()) {
      return this.next();
    } else {
      this.redirect("home", {}, {
        replaceState: true
      });
      return notifyInfo("You must be logged in to view your stories");
    }
  },
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});


var readSubs = new SubsManager({
  cacheLimit: 1,
  expireIn: 1
});

var readRouteDetails = {

  template: "read",
  waitOn () { // subscribe and wait for story if don't have it yet
    var shortId = idFromPathSegment(this.params.storyPathSegment);
    if (Meteor.isClient) { // if full ready story is already loaded due to visiting homepage, don't wait for it
      var story = Stories.findOne({shortId: shortId}, {reactive: false, fields: {verticalSections: 1}});
      if (story && story.verticalSections) { // confirm that full "read story" is loaded
        return [];
      }
    }
    return [readSubs.subscribe('readStoryPub', this.params.userPathSegment, shortId)];
  },
  action () {
    if (this.ready()) {
      return this.render();
    }
  },
  fastRender: true,
  data () {
    var story;
    if (this.ready()){
      var shortId = idFromPathSegment(this.params.storyPathSegment);
      story = Stories.findOne({shortId: shortId}, {reactive: false});
      if (story) {
        Session.set("story", story);
        Session.set("storyId", story._id);
        Session.set("storyShortId", shortId);
        Session.set("headerImage", story.headerImage);
        Session.set("horizontalSectionsMap", _.map(_.pluck(story.verticalSections, "contextBlocks"), function (cBlockIds, i) {
          var id = story.verticalSections[i]._id;
          return {
            verticalIndex: i,
            activeHeartbeats: story.analytics.heartbeats ? story.analytics.heartbeats.active[id] : 0,
            horizontal: _.map(cBlockIds, function (id, i) {
              return {
                _id: id,
                horizontalIndex: i,
                activeHeartbeats: story.analytics.heartbeats ? story.analytics.heartbeats.active[id] : 0
              }
            })
          };
        }));
        setTitle(story.title);
        setMetaImage(story.headerImageUrl());
        setMetaDescription(story.contentPreview());
        setStatusCode();
        return story;
      } else {
        setTitle("Story not found");
        setMetaImage();
        setMetaDescription();
        setStatusCode("404");
        this.render("story_not_found");
        // TODO add 404 tags for seo etc...
      }
    }
  },
  onRun (){
    resetXPositionMemory();
    Session.set("showMinimap", true);
    Session.set("hiddenContextShown", false);
    Session.set("currentY", null);
    Session.set("previousY", null);
    Session.set("poppedOutContextId", null);
    Session.set("contextOverlayId", null);
    Session.set("scrollTop", 0);
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  },

  onAfterAction (){
    Session.set("showDraft", false);
  }
};

Router.route("read", _.extend({
  path: "/read/:userPathSegment/:storyPathSegment",
  onBeforeAction () {
    if(embedMode()){
      this.redirect('embed', this.params, {replaceState: true})
      return this.next();
    }

    Session.set("newStory", false);
    Session.set("read", true);


    return this.next();
  }
}, readRouteDetails));


Router.route("embed", _.extend({
  path: "/embed/:userPathSegment/:storyPathSegment",
  onBeforeAction () {
    Session.set("newStory", false);
    Session.set("read", true);
    activateEmbedMode();

    return this.next();
  }
}, readRouteDetails));

var draftStoryRouteObject = {
  data () {
    var story;
    if (this.ready()) {
      var shortId = idFromPathSegment(this.params.storyPathSegment);
      story = Stories.findOne({shortId: shortId});
      if (story && story.draftStory) {
        Session.set("story", story.draftStory);
        Session.set("storyId", story._id);
        Session.set("storyShortId", shortId);
        Session.set("storyPublished", story.published);
        Session.set("headerImage", story.draftStory.headerImage);
        Session.set("userPathSegment", this.params.userPathSegment);

        Session.set("horizontalSectionsMap", _.map(_.pluck(story.draftStory.verticalSections, "contextBlocks"), function (cBlockIds, i) {
          return {
            verticalIndex: i,
            horizontal: _.map(cBlockIds, function (id, i) {
              return {
                _id: id,
                horizontalIndex: i
              }
            })
          };
        }));
        setTitle('Editing: ' + story.draftStory.title || 'a new story');
        setStatusCode();
        return story;
      } else {
        setTitle('Story not found');
        setStatusCode('404');
        this.render("story_not_found");
        // TODO add 404 tags for seo etc...
      }
    }
  },
  onRun (){
    resetXPositionMemory();
    Session.set("currentY", null);
    Session.set("poppedOutContextId", null);
    Session.set("contextOverlayId", null);
    Session.set("previousY", null);
    Session.set("read", false);
    Session.set("newStory", false);
    Session.set("showDraft", true);
    Session.set("showMinimap", true);
    Session.set('saveState', 'saved');
    Session.set('scrollTop', 0);
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });

    if(!window.isChrome){
      notifyBrowser();
    }

    if (Meteor.isClient){
      window.readyToMigrate.set(false);
    }
    this.next();
  },
  action () {
    if (this.ready()) {
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  }
};


Router.route("edit", _.extend({}, draftStoryRouteObject, {
  path: "/create/:userPathSegment/:storyPathSegment",
  template: "create",
  waitOn () {
    shortId = idFromPathSegment(this.params.storyPathSegment);
    return [Meteor.subscribe('createStoryPub', this.params.userPathSegment, shortId), Meteor.subscribe('contextBlocksPub', shortId)];
  },
  onBeforeAction () {
    if(embedMode()){
      this.redirect('embed', this.params, {replaceState: true});
      return this.next();
    }

    var user, data;
    if ((user = Meteor.user()) || Meteor.loggingIn()) { // if there is a user
      data = this.data();
      if (user && data && user._id !== data.authorId) { // if they don't own the story take them to story not found
        return this.render("story_not_found");
      }
      var accessPriority = Meteor.user().accessPriority;
      if (!accessPriority || accessPriority > window.createAccessLevel){
        this.redirect("home", {}, {
          replaceState: true
        });
        notifyInfo("Creating and editing stories is temporarily disabled, possibly because things blew up (in a good way). Sorry about that! We'll have everything back up as soon as we can. Until then, why not check out some of the other great content authors in the community have written?")
      }
      return this.next(); // if they do own the story, let them through to create
    } else {
      openSignInOverlay(); // if there is no user, take them to the signin page
      this.redirect("home", {}, { // TO-DO, after they sign in, they should get back to the create page
        replaceState: true
      });
      return this.next();
    }
  }
}));

Router.route("admin-read-draft", _.extend({}, draftStoryRouteObject, {
  path: "/admin/read-draft/:storyPathSegment",
  template: "create",
  waitOn () {
    shortId = idFromPathSegment(this.params.storyPathSegment);
    return [Meteor.subscribe('adminReadDraftPub', shortId), Meteor.subscribe('adminContextBlocksPub', shortId)];
  },
  onBeforeAction () {
    var user, data;
    if ((user = Meteor.user()) || Meteor.loggingIn()) { // if there is a user
      if(user.admin){
        return this.next(); // if they are an admin, let them through
      }
    }
  }
}));


Router.route("/unsubscribe", {
  path: "/unsubscribe",
  template: "unsubscribe",
  triggersEnter: [function(){
    $('html, body').scrollTop(0);
  }]
});


// handle user bailing in middle of twitter signup, before a username is chosen. this probably only happens on page load or reload.
Router.onBeforeAction(function() {
  setTimeout(() => {
    var user = Meteor.user();
    var currentRoute = this.route.getName();
    if (user && currentRoute){
      if(!user.username && currentRoute !== 'twitter-signup'){ // if user has no username, confirm they are on the page where they can fill that out
        Meteor.logout(); // otherwise log them out
        setTimeout(() => {
          throw new Meteor.Error('Forcibly logged out user, presumably because they did not finish twitter signup (setting username etc...)');
        }, 0);
      }
    }
  }, 100); // this might even be ok when set to 0

  this.next()
});


Router.route("admin", {
  path: "admin",
  template: "admin",
  waitOn () {
    if (Meteor.user() && Meteor.user().admin) {
      return [Meteor.subscribe('adminMostFavoritesUsersPub')];
    }
  },
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  },
  onBeforeAction () {
    var user, data;
    if ((user = Meteor.user()) || Meteor.loggingIn()) { // if there is a user
      if(user.admin){
        return this.next(); // if they are an admin, let them through
      }
    }
  }
});


Router.route("admin-recent-drafts", {
  path: "/admin/recent-drafts",
  template: "admin_recent_drafts",
  action () {
    if (this.ready()) {
      setTitle('Most recent drafts');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  onBeforeAction () {
    var user, data;
    if ((user = Meteor.user()) || Meteor.loggingIn()) { // if there is a user
      if(user.admin){
        return this.next(); // if they are an admin, let them through
      }
    }
  },
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("admin-recent-activities", {
  path: "/admin/recent-activities",
  template: "admin_recent_activities",
  action () {
    if (this.ready()) {
      setTitle('Most recent activities');
      setMetaImage();
      setMetaDescription();
      setStatusCode();
      return this.render();
    }
  },
  onBeforeAction () {
    var user, data;
    if ((user = Meteor.user()) || Meteor.loggingIn()) { // if there is a user
      if(user.admin){
        return this.next(); // if they are an admin, let them through
      }
    }
  },
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

Router.route("stats", {
  path: "stats",
  template: "stats",
  onRun (){
    Meteor.defer(function(){
      $(window).scrollTop(0);
    });
    this.next();
  }
});

//Router.route("loading", {
//  path: "loading",
//  template: "loading_page"
//});

Router.configure({
  waitOn () {
    return [
      Meteor.subscribe('userData')
    ]
  },
  loadingTemplate: 'loading_page',
  notFoundTemplate: "not_found"
});


// if embed but not a story, just take 'em to the about story
Router.onBeforeAction(function(){
  if (embedMode()) {
    var routeName = Router.current().route.getName();

    if (!_.contains(['edit', 'read', 'embed'], routeName)){
      this.redirect("about", {}, {replaceState: true});
    }
  }

  this.next();
});
