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


var filters = ['curated', 'trending', 'starred', 'newest'];
Session.setDefault('filterValue', filters[0]); // this must correspond to the first thing in the dropdown

Template.home.helpers({
  user: function() {
    return Meteor.user();
  },
  filterOpen: function() {
    return Session.get("filterOpen");
  },
  filter: function() {
    return Session.get("filter");
  },
  category: function() {
    return Session.get("category");
  }
});


Template.home.events({
  "click .logo-title a": function(e, t) {
    // reset search query
    Session.set('storySearchQuery', null);

    // reset filter
    Session.set('filterValue', filters[0]);
    t.$("select.filters-select").val(filters[0]);
    t.$("select.filters-select").selectOrDie("update");

  }
});

Template.search.onCreated(function() {
  this.autorun(function(){
    if(!Session.get('storySearchQuery')){
      $("input").val(null);
    }
  })


});

Template.search.onRendered(function() {
  if(this.data.slim){
    this.$("button").hide(); // hack to hide button
  } else {
    var storySearchQuery;
    if(storySearchQuery = Session.get('storySearchQuery')){
      this.$("input").val(storySearchQuery);
    }
  }
});

Template.search.helpers({
  showClearSearch: function(){
    return Session.get('storySearchQuery');
  }
});

Template.search.events({
  'click .clear-search': function(e, t){
    // this is the business logic
    Meteor.defer(function(){
      return Session.set('storySearchQuery', null);
    });

    // do this so the ui is snappy
    t.$("input").val(null);
    t.$("button").hide();

  },
  'keydown': function(e, t){
    if(t.data.slim){
      t.$("button").show(); // compensate for hack from above
    }
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
  var options = {};
  if(this.data.slim){
    options.placeholder = "Explore";
  } else {
    var filterValue;
    if(filterValue = Session.get('filterValue')){
      $("select").val(filterValue);
    }
  }
  $("select").selectOrDie(options);

});


Template.filters.helpers({
  filters: function() {
    return _.map(filters, function(filter){
      return {
        value: filter,
        label: filter === 'curated' ? 'FOLD Picks' : _s.capitalize(filter)
      }
    })
  },
  conditionallySelected: function(){
    return Session.equals('filterValue', this.toString()) ? 'selected' : '';
  }
});

Template.filters.events({
  "change select": function(e, t) {
    var filterValue = $(e.target).val();
    Session.set('filterValue', filterValue);
    Session.set('storySearchQuery', null);
    if(t.data.slim){
      Router.go('/');
    }
    trackEvent('Select filter', {
      label: filterValue
    });
  }
});

Template.search.events({
  "keyup input": _.throttle(function(e, t) {
    var text = $(e.target).val().trim();
    Session.set('storySearchQuery', text);
    if(enterPress(e) && t.data.slim){
      Router.go('/');
    }
    $('html, body').scrollTop(0);
  }, 200, {leading: false})
});

var curatedStoriesSub,
  trendingStoriesSub,
  newestStoriesSub,
  starredStoriesSub;


var getSubscriptionPage = function(filterValue){
  return subscriptionsPage.get(filterValue + 'Stories')
};

var setSubscriptionPage = function(filterValue, val){
  return subscriptionsPage.set(filterValue + 'Stories', val);
};

var getCurrentSubscriptionPage = function(){
  var storySearchQuery = Session.get('storySearchQuery');
  return getSubscriptionPage(storySearchQuery ? ('search:' + storySearchQuery) : Session.get('filterValue'));
};

var setCurrentSubscriptionPage = function(val){
  var storySearchQuery = Session.get('storySearchQuery');
  return setSubscriptionPage(storySearchQuery ? ('search:' + storySearchQuery) : Session.get('filterValue'), val);
};


var incrementSubscriptionPage = function(filterValue){
  setSubscriptionPage(filterValue, getSubscriptionPage(filterValue) + 1);
};


var incrementCurrentSubscriptionPage = function(){
  setCurrentSubscriptionPage(getCurrentSubscriptionPage() + 1);
};

var subscriptionsReady = new ReactiveDict();
var subscriptionsPage = new ReactiveDict();
_.each(filters, function(filter){
  setSubscriptionPage(filter, -1);
});

setSubscriptionPage('curated', 0); // curated stories are preloaded



var homeSubs = new SubsManager({
  cacheLimit: 9999,
  expireIn: 99999999
});

var searchUserSubs = new SubsManager({
  cacheLimit: 1,
  expireIn: 60
});

// these methods all keep the subscription open for the lifetime of the window, but can be called again safely
var subscribeToCuratedStories = function(cb){
  if(!curatedStoriesSub){
    curatedStoriesSub = homeSubs.subscribe("curatedStoriesPub", function(){
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
    trendingStoriesSub = homeSubs.subscribe("trendingStoriesPub", function(){
      incrementSubscriptionPage('trending');
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
    newestStoriesSub = homeSubs.subscribe("newestStoriesPub", function(){
      incrementSubscriptionPage('newest');
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
    starredStoriesSub = homeSubs.subscribe("starredStoriesPub", function(){
      incrementSubscriptionPage('starred');
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
var whichUserPics = new Tracker.Dependency();

Template.all_stories.onCreated(function(){
  var that = this;
  createHomePageDate = Date.now();
  subscribeToCuratedStories(function(){
    if (!that.view.isDestroyed){ // because this happens asynchronously, the user may have already navigated away
      that.autorun(function(){
        whichUserPics.depend();
        that.subscribe('minimalUsersPub', _.sortBy(Stories.find({ published: true}, {fields: {authorId:1}, reactive: false}).map(function(story){return story.authorId}), _.identity));
      });
    }
    subscribeToTrendingStories(function() {
      subscribeToNewestStories(function(){
        subscribeToStarredStories(function(){
          whichUserPics.changed();
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
  });

  // first page of search results, or when flip back to query
  this.autorun(function(){
    var storySearchQuery = Session.get('storySearchQuery');
    if(storySearchQuery){
      Tracker.nonreactive(function(){
        var currentPage = getCurrentSubscriptionPage();
        if(typeof currentPage !== 'number'){
          currentPage = 0;
          setCurrentSubscriptionPage(currentPage);
        }
        StorySearch.search(storySearchQuery, {page: currentPage});
        PersonSearch.search(storySearchQuery, {page: 0});
      })
    }
  });

  // further pages of search results
  this.autorun(function(){
    var currentPage = getCurrentSubscriptionPage();
    Tracker.nonreactive(function(){
      var storySearchQuery = Session.get('storySearchQuery');
      if(storySearchQuery && currentPage){
        StorySearch.search(storySearchQuery, {page: currentPage});
      }
    });
  });

  subscribeToStorySearchedMinimalUsers = _.debounce(function(){
    return searchUserSubs.subscribe('minimalUsersPub', _.sortBy(StorySearch.getData({}, true).map(function(story){return story.authorId}), _.identity));
  }, 1000);

  // TODO, we just loaded this data with the search....
  subscribeToPeopleSearchedMinimalUsers = _.debounce(function(){
    return searchUserSubs.subscribe('minimalUsersPub', _.sortBy(PersonSearch.getData({}, true).map(function(person){return person._id}), _.identity));
  }, 1000);

  this.autorun(function(){
    if(StorySearch.getStatus().loaded){
      subscribeToStorySearchedMinimalUsers();
    }
    if(PersonSearch.getStatus().loaded){
      subscribeToPeopleSearchedMinimalUsers();
    }
  });


});

search = null;

var currentHomeStories = function(){

  var limit = (getCurrentSubscriptionPage() + 1) * PUB_SIZE;

  if (limit <= 0){
    return
  }

  if(Session.get('storySearchQuery')){
    var storyResults = StorySearch.getData({
      sort:[
        ["editorsPickAt", "desc"],
        ["favoritedTotal", "desc"],
        ["savedAt", "desc"]
      ],
      docTransform: function(doc){
        return new Story(doc);
      }
    });
    var personResults = PersonSearch.getData({
      sort:[
        ["followersTotal", "desc"],
        ["followingTotal", "desc"],
        ["favoritesTotal", "desc"],
        ["createdAt", "desc"]
      ]
    });
    var searchResults = _.union(personResults, storyResults)
    searchResults.count = function(){
      return storyResults.length
    }
    return searchResults;
  }

  switch (Session.get('filterValue')) {
    case 'curated': // preview versions of all these stories come from fast-render so we can show them right away
      return Stories.find({ published: true, editorsPick: true}, {sort: {'editorsPickAt': -1}, limit: limit, reactive: true}); // .fetch() prevents a weird "Bad index" error
      break;
    case 'newest':
      return Stories.find({published: true}, {sort: {'publishedAt': -1}, limit: limit, reactive: true});
      break;
    case 'trending':
      return Stories.find({published: true}, {sort: {'analytics.views.total': -1}, limit: limit, reactive: true});
      break;
    case 'starred':
      return Stories.find({published: true}, {sort: {'favoritedTotal': -1}, limit: limit, reactive: true});
      break;
  }
};

Template.all_stories.events({
  'click .show-more' : function(e,t){

    var storySearchQuery = Session.get('storySearchQuery');
    if(storySearchQuery){
      incrementCurrentSubscriptionPage();
    } else {
      var filterValue = Session.get('filterValue');
      subscriptionsReady.set(filterValue + 'Stories', false);
      homeSubs.subscribe(filterValue + 'StoriesPub', {page: getCurrentSubscriptionPage() + 1}, function(){
        incrementCurrentSubscriptionPage();
        whichUserPics.changed();
        subscriptionsReady.set(filterValue + 'Stories', true);
      })
    }

  },
  'click .dismiss-box': function (e,t) {
    Session.set('boxDismissed', true);
  }
});

Template.all_stories.helpers({ // most of these are reactive false, but they will react when switch back and forth due to nesting inside ifs (so they rerun when switching between filters)
  stories: currentHomeStories,
  storiesLoading: function(){
    return(!(subscriptionsReady.get(Session.get('filterValue') + 'Stories')) || PersonSearch.getStatus().loading
    || StorySearch.getStatus().loading)
  },
  moreToShow: function(){
    var stories = currentHomeStories();
    if (!stories){
      return false
    }
    return currentHomeStories().count() >= (getCurrentSubscriptionPage() + 1) * PUB_SIZE
  },
  boxDismissed: function(){
    return Session.get('boxDismissed')
  }
});


Template.story_preview.helpers({
  story: function(){
    return Template.instance().data.story || Stories.findOne(this._id);
  }
});


Template._story_preview_content.onCreated(function(){
  this.showProfileInfoVariable = new ReactiveVar();
  var that = this;
  var timer = null;
  this.hideProfileInfo = function(){
    timer = Meteor.setTimeout(function(){
      that.showProfileInfoVariable.set(false);
      timer = null;
    }, 300)
  };
  this.cancelHideProfileInfo = function(){
    if(timer){
      Meteor.clearTimeout(timer);
    }
  };
  this.showProfileInfo = function(){
    that.cancelHideProfileInfo();
    that.showProfileInfoVariable.set(true);
  }
});

Template._story_preview_content.helpers({
  showProfileInfo: function(){
    return Template.instance().showProfileInfoVariable.get()
  }
});
Template._story_preview_content.events({
  "mouseenter .byline": function(d) {
    Template.instance().showProfileInfo();
  },
  "mouseleave .byline": function(d) {
    Template.instance().hideProfileInfo();
  },
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
    openSignInOverlay();
  },
  "click .logout" : function(e) {
    e.preventDefault();
    Template.instance().showUserInfo.set(false);
    Meteor.logout();
  }
});
