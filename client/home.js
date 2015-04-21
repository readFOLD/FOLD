var formatDate, weekDays, formatDateNice, monthNames;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

window.headerImageUrl = function(headerImage, headerImageFormat){
  var image, imageFormat;

  if (headerImage){
    image = headerImage;
    imageFormat = headerImageFormat;
  } else {
    image = this.headerImage;
    imageFormat = this.headerImageFormat;
  }

  if (image) {
    return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/' + image
  }
}

// Friday 2/20/2015 20:29:22
formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};

// February 7th, 2015
formatDateNice = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return monthNames[(date.getMonth() + 1)] + " " + date.getDate() + ", " + date.getFullYear();
};

loginWithTwitter = function() {
  Session.set('signingInWithTwitter', true);
  Meteor.loginWithTwitter({
    requestPermissions: ['user']
  }, function (err) {
    if (err) {
      alert("Twitter login failed");
      Session.set('signingInWithTwitter', false);
      throw(err); // throw error so we see it on kadira
    } else if (!Meteor.user().username) { // if they are signing up for the first time they won't have a username yet
      Router.go('twitter-signup');
    }
    // otherwise they are a returning user, so do nothing because they are now logged in and free to proceed
  });
};

loginWithEmail = function() {
  Router.go('login')
};

Template.home.helpers({
  user: function() {
    return Meteor.user();
  },
  filterOpen: function() {
    return Session.get("filterOpen");
  },
  sticky: function() {
    return Session.get("sticky");
  },
  filter: function() {
    return Session.get("filter");
  },
  category: function() {
    return Session.get("category");
  }
});


Template.home.events({
  "click div#expand-filter": function(d) {
    var filterOpen, heightChange;
    filterOpen = Session.get("filterOpen");
    heightChange = filterOpen ? "-=100" : "+=100";
    $("div#filter").animate({
      height: heightChange
    }, 250);
    if (filterOpen) {
      $("div.logo").animate({
        top: "52px",
        opacity: 1
      }, 400, 'easeOutExpo');
    } else {
      $("div.logo").animate({
        top: "78px",
        opacity: 0
      }, 400, 'easeOutExpo');
    }
    return Session.set("filterOpen", !filterOpen);
  }
});

Template.categories.helpers({
  categories: function() {
    return ['all', 'news', 'history', 'art', 'technology', 'politics', 'e-sports', 'music', 'gaming', 'sponsored'];
  },
  selected: function() {
    return Session.equals("category", this.toString());
  }
});

Template.categories.events({
  "click li": function(d) {
    var srcE;
    srcE = d.srcElement ? d.srcElement : d.target;
    return Session.set('category', $(srcE).data('category'));
  }
});

Template.filters.onRendered(function() {
  $("select").selectOrDie({

  });
});

var filters = ['curated', 'trending', 'starred', 'newest'];
Session.set('filterValue', filters[0]); // this must correspond to the first thingin the dropdown

Template.filters.helpers({
  filters: function() {
    return filters
  },
  conditionallySelected: function(){
    return Session.equals('filterValue', this.toString()) ? 'selected' : '';
  }
});

Template.filters.events({
  "change select": function(e, t) {
    Session.set('filterValue', ($(e.target).val()));
  }
});

Template.all_stories.onCreated(function(){ // TODO reconcile with the below
  var that = this;
  this.autorun(function(){
    that.subscribe('minimalUsersPub', Stories.find({ published: true}, {fields: {authorId:1}}).map(function(story){return story.authorId}));
  });
});

var commonHomeSubscriptions = [];

Template.all_stories.onCreated(function(){
  if (!commonHomeSubscriptions.length ){ // subscribe to these the first time, and then keep them open so homepage loads right quick
    commonHomeSubscriptions = [Meteor.subscribe("curatedStoriesPub"), Meteor.subscribe("newestStoriesPub"), Meteor.subscribe("trendingStoriesPub")];
  }

  this.subscriptionsReady = new ReactiveVar([]);

  var that = this;
  this.autorun(function(){
    that.subscriptionsReady.set(_.chain(commonHomeSubscriptions)
        .filter(function(pub) { return pub.ready() })
        .value()
    );
  });

  var starredSubscription;

  this.autorun(function(){
    var user = Meteor.user();
    if (user && !_.isEmpty(user.profile.favorites)){
      starredSubscription = Meteor.subscribe("favoriteStoriesPub", user.profile.favorites)
    }
  });

});

Template.all_stories.helpers({ // most of these are reactive false, but they will react when switch back and forth due to nesting inside ifs (so they rerun when switching between filters)
  newestStories: function() {
    if (Template.instance().subscriptionsReady.get().length) {
      return Stories.find({published: true}, {sort: {'publishedAt': -1}, limit: 40, reactive: false});
    }
  },
  curatedStories: function() {
    if (Template.instance().subscriptionsReady.get().length){
      return Stories.find({ published: true, editorsPick: true}, {sort: {'editorsPickAt': -1}, limit: 40, reactive: false});
    }
  },
  trendingStories: function() {
    if (Template.instance().subscriptionsReady.get().length) {
      return Stories.find({published: true}, {sort: {'views': -1}, limit: 40, reactive: false});
    }
  },
  starredStories: function() {
    var user = Meteor.user();
    if (user && user.profile.favorites){
      return Stories.find({ published: true, _id: {$in: user.profile.favorites } }, {sort: {'publishedAt': -1}, reactive: true});
    }
  },
  showNewestStories: function(){
    return Session.equals('filterValue', 'newest')
  },
  showCuratedStories: function(){
    return Session.equals('filterValue', 'curated')
  },
  showTrendingStories: function(){
    return Session.equals('filterValue', 'trending')
  },
  showStarredStories: function(){
    return Session.equals('filterValue', 'starred')
  },
  storiesLoading: function(){
    return !Stories.find({}).count();
  },
  noStoriesForYou: function(){
    return !Meteor.user();
  }
});


Template.story_preview.helpers({
  story: function(){
    return Stories.findOne(this._id);
  }
});

Template._story_preview_content.helpers({
  lastPublishDate: function() {
    if(this.publishedAt) {
      return formatDateNice(this.publishedAt);
    }
  },
  headerImageUrl: headerImageUrl,
  story: function(){
    if (Template.instance().data.useDraftStory){
      return this.draftStory;
    } else {
      return this;
    }
  },
  linkRoute: function(){
    return Template.instance().data.useDraftStory ? 'edit' : 'read';
  },
  author: function(){
    return Meteor.users.findOne(this.authorId)
  },
  profileUrl: function(){
    return '/profile/' + (this.authorDisplayUsername || this.authorUsername); // TODO migrate and only use authorDisplayUsername
  }
});

Template.banner_buttons.helpers({
  showCreateStory: function() {
    if (!Meteor.user()){
      return true
    }
    var accessPriority = Meteor.user().accessPriority;
    return accessPriority && accessPriority <= window.createAccessLevel;
  }
});

Template.login_buttons.helpers({
  showUserInfo: function() {
    return Template.instance().showUserInfo.get();
  }
});

Template.login_buttons.onCreated(function() {
  return this.showUserInfo = new ReactiveVar(false);
});

Template.login_buttons.events({
  "mouseenter": function(d) {
    Template.instance().showUserInfo.set(true);
  },
  "mouseleave": function(d) {
    Template.instance().showUserInfo.set(false);
  },
  "click .signin": function(d) {
    Session.set('signingIn', true);
  },
  "click .logout" : function(e) {
    e.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});

var closeSignInOverlay = function(){
  Session.set('signingIn', false);
};

// TODO close sign in overlay on esc (27) need to do on whole window though

Template.signin_overlay.events({
  "click .close": function(d) {
    closeSignInOverlay();
  },
  "click .twitter-signin": function(d) {
    closeSignInOverlay();
    return loginWithTwitter();
  },
  "click .email-signin": function(d) {
    closeSignInOverlay();
    return loginWithEmail();
  }
});
