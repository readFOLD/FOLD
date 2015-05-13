var formatDate, weekDays, formatDateNice, monthNames;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

// Friday 2/20/2015 20:29:22
formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};

// February 7th, 2015
formatDateNice = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return monthNames[(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear();
};

loginWithTwitter = function() {
  Session.set('signingInWithTwitter', true);
  Meteor.loginWithTwitter({
    requestPermissions: ['user']
  }, function (err) {
    if (err) {
      notifyError("Twitter login failed");
      Session.set('signingInWithTwitter', false);
      throw(err); // throw error so we see it on kadira
    } else if (!Meteor.user().username) { // if they are signing up for the first time they won't have a username yet
      Router.go('twitter-signup');
    } else { // otherwise they are a returning user, they are now logged in and free to proceed
      notifyLogin();
    }
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
    var filterValue = $(e.target).val();
    Session.set('filterValue', filterValue);
    analytics.track('Select filter', {
      label: filterValue
    });
  }
});

var curatedStoriesSub,
  trendingStoriesSub,
  newestStoriesSub,
  starredStoriesSub;

var subscriptionsReady = new ReactiveDict();


// these methods all keep the subscription open for the lifetime of the window, but can be called again safely
var subscribeToCuratedStories = function(cb){
  if(!curatedStoriesSub){
    curatedStoriesSub = Meteor.subscribe("curatedStoriesPub", function(){
      var timeToLoadStories = Date.now() - createHomePageDate;
      trackTiming('Subscription', 'Full curated stories ready (time since created template)', timeToLoadStories);
      subscriptionsReady.set('curatedStories', true);
      if(cb){
        cb();
      }
    })
  } else {
    if(cb){
      cb();
    }
  }
};
var subscribeToTrendingStories = function(cb){
  if(!trendingStoriesSub){
    trendingStoriesSub = Meteor.subscribe("trendingStoriesPub", function(){
      subscriptionsReady.set('trendingStories', true);
      if(cb){
        cb();
      }
    })
  } else {
    if(cb){
      cb();
    }
  }
};
var subscribeToNewestStories = function(cb){
  if(!newestStoriesSub){
    newestStoriesSub = Meteor.subscribe("newestStoriesPub", function(){
      subscriptionsReady.set('newestStories', true);
      if(cb){
        cb();
      }
    })
  } else {
    if(cb){
      cb();
    }
  }
};

var subscribeToStarredStories = function(cb){
  if(!starredStoriesSub){
    starredStoriesSub = Meteor.subscribe("starredStoriesPub", function(){
      subscriptionsReady.set('starredStories', true);
      if(cb){
        cb();
      }
    })
  } else {
    if(cb){
      cb();
    }
  }
};

var createHomePageDate;

Template.all_stories.onCreated(function(){
  var that = this;
  createHomePageDate = Date.now();
  subscribeToCuratedStories(function(){
    subscribeToTrendingStories(function() {
      subscribeToNewestStories(function(){
        subscribeToStarredStories(function(){
          if (!that.view.isDestroyed){ // because this happens asynchronously, the user may have already navigated away
            that.autorun(function(){
              that.subscribe('minimalUsersPub', Stories.find({ published: true}, {fields: {authorId:1}, reactive: false}).map(function(story){return story.authorId}));
            });
          }
        })
      })
    });
  });

  var notFirstRun = false;
  this.autorun(function(){
    Session.get('filterValue'); // re-run whenever filter value changes
    if (notFirstRun){
      $(window).scrollTop(0)
    }
    notFirstRun = true;
  })

});

Template.all_stories.helpers({ // most of these are reactive false, but they will react when switch back and forth due to nesting inside ifs (so they rerun when switching between filters)
  curatedStories: function() {
    // preview versions of all these stories come from fast-render so we can show them right away
    return Stories.find({ published: true, editorsPick: true}, {sort: {'editorsPickAt': -1}, limit: 30, reactive: false});
  },
  trendingStories: function() {
    if (subscriptionsReady.get('trendingStories')) {
      return Stories.find({published: true}, {sort: {'analytics.views.total': -1}, limit: 30, reactive: false});
    }
  },
  newestStories: function() {
    if (subscriptionsReady.get('newestStories')) {
      return Stories.find({published: true}, {sort: {'publishedAt': -1}, limit: 30, reactive: false});
    }
  },
  starredStories: function() {
    if (subscriptionsReady.get('starredStories')) { // TODO remove the sort after the publication works
      return Stories.find({published: true}, {sort: {'favoritedTotal': -1}, limit: 30, reactive: false});
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
    return(!(subscriptionsReady.get(Session.get('filterValue') + 'Stories')))
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
    return '/profile/' + (this.authorDisplayUsername || this.authorUsername); // TODO migrate drafts and only use authorDisplayUsername
  },
  contextCountOfType: function(type){
    return this.contextBlockTypeCount ? this.contextBlockTypeCount[type] : this.contextCountOfType(type);
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
  "mouseenter .user-action": function(d) {
    Template.instance().showUserInfo.set(true);
  },
  "mouseleave .user-action": function(d) {
    Template.instance().showUserInfo.set(false);
  },
  "click .signin": function(d) {
    Session.set('signingIn', true);
  },
  "click .logout" : function(e) {
    e.preventDefault();
    Template.instance().showUserInfo.set(false);
    Meteor.logout();
  }
});

var closeSignInOverlay = function(){
  Session.set('signingIn', false);
};

// TODO close sign in overlay on esc (27) need to do on whole window though

Template.signin_overlay.events({
  "click .close": function(d) {
    closeSignInOverlay();
    analytics.track('Click close sign-in overlay');
  },
  "click .twitter-signin": function(d) {
    closeSignInOverlay();
    loginWithTwitter();
    analytics.track('Click login with Twitter');
  },
  "click .email-signin": function(d) {
    closeSignInOverlay();
    loginWithEmail();
    analytics.track('Click login with email');
  }
});
