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


var filters = ['mixed', 'curated', 'trending', 'starred', 'newest'];
Session.setDefault('filterValue', filters[0]); // this must correspond to the first thing in the dropdown

Template.home.helpers({
  user () {
    return Meteor.user();
  },
  filter () {
    return Session.get("filter");
  }
});


Template.home.events({
  "click .logo-title a" (e, t) {
    // reset search query
    Session.set('storySearchQuery', null);

    // reset filter
    Session.set('filterValue', filters[0]);
    t.$("select.filters-select").val(filters[0]);
    t.$("select.filters-select").selectOrDie("update");

  }
});

Template.top_banner.helpers({
  showingFeed () {
    return Session.equals('filterValue', 'mixed') && !Session.get('storySearchQuery');
  },
  showingLatest () {
    return Session.equals('filterValue', 'newest') && !Session.get('storySearchQuery');
  },
  altSlim (){
    return Template.instance().data && (Template.instance().data.slim || Meteor.Device.isPhone()) && hiddenContextMode()
  }
});

Template.top_banner.events({
  "click .show-newest" (e, t) {
    Meteor.defer(() => {
      Session.set('filterValue', 'newest');
      Session.set('storySearchQuery', null);
    });

    // do this so the ui is snappy
    t.$('.newest-toggle button').prop("disabled", "");
    t.$("input").val(null);
    t.$(".clear-search").hide();
    $(e.target).prop("disabled", "disabled");
  },
  "click .show-feed" (e, t) {
    Meteor.defer(() => {
      Session.set('filterValue', 'mixed');
      Session.set('storySearchQuery', null);
    });

    // do this so the ui is snappy
    t.$('.newest-toggle button').prop("disabled", "");
    t.$("input").val(null);
    t.$(".clear-search").hide();
    $(e.target).prop("disabled", "disabled");
  },
  "click .alt-signup-button" (d) {
    openSignInOverlay();
  },
  "click .alt-search-button" () {
    openSearchOverlay();
  },
  "click .alt-menu-button" () {
    openMenuOverlay();
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
  if(this.data && this.data.slim){
    this.$("button").hide(); // hack to hide button
  } else {
    var storySearchQuery;
    if(storySearchQuery = Session.get('storySearchQuery')){
      this.$("input").val(storySearchQuery);
    }
  }
});

Template.search.helpers({
  showClearSearch (){
    return Session.get('storySearchQuery');
  }
});

Template.search.events({
  'click .clear-search' (e, t){
    // this is the business logic
    Meteor.defer(function(){
      return Session.set('storySearchQuery', null);
    });

    // do this so the ui is snappy
    t.$("input").val(null);
    t.$("button").hide();

  },
  'keydown' (e, t){
    if(t.data.slim){
      t.$("button").show(); // compensate for hack from above
    }
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
  filters () {
    return _.map(filters, function(filter){
      return {
        value: filter,
        label: filter === 'curated' ? 'FOLD Picks' : _s.capitalize(filter)
      }
    })
  },
  conditionallySelected (){
    return Session.equals('filterValue', this.toString()) ? 'selected' : '';
  }
});

Template.filters.events({
  "change select" (e, t) {
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
  "submit" (e, t){
    e.preventDefault();
  },
  "keyup input": _.throttle(function(e, t) {
    var text = $(e.target).val().trim();

    if(enterPress(e)){
      $(e.target).blur();
      closeSearchOverlay();
      if(t.data.slim){
        Router.go('/');
      }
    }

    if(!Session.get('searchOverlayShown')){
      Session.set('storySearchQuery', text);
    }

    if(!t.data.slim){
      $('html, body').scrollTop(0);
    }


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

setSubscriptionPage('mixed', 0); // curated stories are preloaded
setSubscriptionPage('curated', 0); // curated stories are preloaded



var homeSubs = new SubsManager({
  cacheLimit: 9999,
  expireIn: 99999999
});

var followingHomeSubs = new SubsManager({
  cacheLimit: 99,
  expireIn: 99999999
});

var storySearchUserSubs = new SubsManager({
  cacheLimit: 1,
  expireIn: 60
});

var peopleSearchUserSubs = new SubsManager({
  cacheLimit: 1,
  expireIn: 60
});

// these methods all keep the subscription open for the lifetime of the window, but can be called again safely
var subscribeToCuratedStories = function(cb){
  if(!curatedStoriesSub){
    curatedStoriesSub = homeSubs.subscribe("curatedStoriesPub", function(){
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
    trendingStoriesSub = homeSubs.subscribe("trendingStoriesPub", {preview: true}, function(){
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
    newestStoriesSub = homeSubs.subscribe("newestStoriesPub", {preview: true}, function(){
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
    starredStoriesSub = homeSubs.subscribe("starredStoriesPub", {preview: true}, function(){
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
var additionalMixedPages = new Tracker.Dependency();

Template.all_stories.onCreated(function(){
  createHomePageDate = Date.now();

  this.autorun(() => {
    whichUserPics.depend();
    this.subscribe('minimalUsersPub', _.sortBy(Stories.find({published: true}, { fields: {authorId: 1}, reactive: false }).map(function (story) {
      return story.authorId
    }), _.identity));
  });

  subscriptionsReady.set('curatedStories', true); // we loaded a preview of these up front
  subscriptionsReady.set('mixedStories', true); // we loaded a preview of these up front

  Meteor.setTimeout(() =>{
    if (!this.view.isDestroyed) { // because this happens asynchronously, the user may have already navigated away
      subscribeToCuratedStories(() => { // might as well load the full versions of curated stories for a faster experience
        // do nothing for now
      });
    }
  }, 4500); // wait a few seconds to let the user orient before potentially slowing down the page for another couple seconds



  var notFirstRunA = false;

  this.autorun(function(){
    var user = Meteor.users.find(Meteor.userId(), {fields: {'profile.following': 1}}).fetch()[0];
    if(!user){
      return;
    }

    if(notFirstRunA){
      var following = user.profile.following;

      followingHomeSubs.clear();

      additionalMixedPages.changed();

      followingHomeSubs.subscribe("mixedStoriesPub", {authors: _.sortBy(following, _.identity), preview: true}, function(){ // preview for memory savings on server. can remove preview to make it faster to visit stories you're following
        subscriptionsReady.set('mixedStories', true);
        whichUserPics.changed();
      })
    }
    notFirstRunA = true;
  });

  var notFirstRunB = false;
  this.autorun(function(){
    Session.get('filterValue'); // re-run whenever filter value changes
    if (notFirstRunB){
      $(window).scrollTop(0)
    }
    notFirstRunB = true;
  });

  this.autorun(function () {
    if (adminMode()) {
      subscribeToCuratedStories(function () {
        subscribeToNewestStories(function () {
          subscribeToTrendingStories(function () {
            subscribeToStarredStories(function () {
              whichUserPics.changed();
            });
          });
        });
      });
    }
  });

  this.autorun(function () {
    if (Session.equals('filterValue', 'newest')) {
      subscriptionsReady.set('newestStories', false);
      subscribeToNewestStories(function () {
        subscriptionsReady.set('newestStories', true);
        whichUserPics.changed();
      });
    }
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
    return storySearchUserSubs.subscribe('minimalUsersPub', _.sortBy(StorySearch.getData({}, true).map(function(story){return story.authorId}), _.identity));
  }, 1000);

  // TO-DO, we just loaded this data with the search....
  subscribeToPeopleSearchedMinimalUsers = _.debounce(function(){
    return peopleSearchUserSubs.subscribe('minimalUsersPub', _.sortBy(PersonSearch.getData({}, true).map(function(person){return person._id}), _.identity));
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
      docTransform (doc){
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
    case 'mixed':
      if(!Meteor.userId()){
        return Stories.find({ published: true, editorsPick: true}, {sort: {'editorsPickAt': -1}, limit: limit, reactive: true});
      } else {
        return Stories.find({ published: true, $or: [{editorsPick: true}, {authorId: {$in: Meteor.user().profile.following || []}}]}, {sort: {'r': -1}, limit: limit, reactive: true});
      }
      break;
    case 'curated':
      return Stories.find({ published: true, editorsPick: true}, {sort: {'editorsPickAt': -1}, limit: limit, reactive: true});
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
  'click .show-more'  (e,t){

    var storySearchQuery = Session.get('storySearchQuery');
    if(storySearchQuery){
      incrementCurrentSubscriptionPage();
    } else if (adminMode() || (Session.get('filterValue') === 'newest')) { // legacy behavior + newest
      var filterValue = Session.get('filterValue');
      subscriptionsReady.set(filterValue + 'Stories', false);
      homeSubs.subscribe(filterValue + 'StoriesPub', {page: getCurrentSubscriptionPage() + 1}, function(){
        incrementCurrentSubscriptionPage();
        whichUserPics.changed();
        subscriptionsReady.set(filterValue + 'Stories', true);
      })
    } else if (Meteor.userId()) {
      var nextPage = getCurrentSubscriptionPage() + 1;

      t.autorun(() =>{ // autorun and depend is so that subs update when list of following users does
        additionalMixedPages.depend();
        var user;
        var currentPage;

        Tracker.nonreactive(function(){
          user = Meteor.user();
          currentPage = getCurrentSubscriptionPage();
        });

        var following = user.profile.following;

        subscriptionsReady.set('mixedStories', false);

        followingHomeSubs.subscribe("mixedStoriesPub", {authors: _.sortBy(following, _.identity), preview: true, page: nextPage}, function(){
          subscriptionsReady.set('mixedStories', true);
          if(nextPage === currentPage + 1){
            incrementCurrentSubscriptionPage();
          }
          whichUserPics.changed(); // TO-DO this gets run more often than it needs to when authors user is following changes
        })
      });
    } else {
      subscriptionsReady.set('curatedStories', false);
      homeSubs.subscribe('curatedStoriesPub', {page: getCurrentSubscriptionPage() + 1, preview: true}, function(){
        incrementCurrentSubscriptionPage();
        subscriptionsReady.set('curatedStories', true);
        whichUserPics.changed();
      });
    }

  },
  'click .dismiss-box'  (e,t) {
    Session.set('boxDismissed', true);
  },
  'click .clear-search'  (e,t) {
    Session.set('storySearchQuery', null);
  }
});

Template.all_stories.helpers({ // most of these are reactive false, but they will react when switch back and forth due to nesting inside ifs (so they rerun when switching between filters)
  stories: currentHomeStories,
  storiesLoading (){
    return(!(subscriptionsReady.get(Session.get('filterValue') + 'Stories')) || PersonSearch.getStatus().loading
    || StorySearch.getStatus().loading)
  },
  moreToShow (){
    var stories = currentHomeStories();
    if (!stories){
      return false
    }
    return currentHomeStories().count() >= (getCurrentSubscriptionPage() + 1) * PUB_SIZE
  },
  boxDismissed (){
    return Session.get('boxDismissed') || Session.get('storySearchQuery')
  },
  hideActivityFeed (){ // we'll hide it so it doesn't need to reload all activities
    return !Session.equals('filterValue', 'mixed') || Session.get('storySearchQuery');
  },
  currentSearch (){
    return Session.get('storySearchQuery')
  }
});


Template.story_preview.helpers({
  story (){
    return Template.instance().data.story || Stories.findOne(this._id);
  }
});

Template._story_preview_content.helpers({
  lastPublishDate () {
    if(this.publishedAt) {
      return prettyDateInPast(this.publishedAt);
    }
  },
  story (){
    if (Template.instance().data.useDraftStory){
      return this.draftStory;
    } else {
      return this;
    }
  },
  linkRoute (){
    return Template.instance().data.useDraftStory ? 'edit' : 'read';
  },
  author (){
    return Meteor.users.findOne(this.authorId)
  },
  profileUrl (){
    return '/profile/' + (this.authorDisplayUsername || this.authorUsername); // TODO migrate drafts and only use authorDisplayUsername
  },
  narrativeCount (){
    return this.narrativeBlockCount ? this.narrativeBlockCount : this.narrativeCount();
  },
  contextCountOfType (type){
    return this.contextBlockTypeCount ? this.contextBlockTypeCount[type] : this.contextCountOfType(type);
  }
});

Template.login_buttons.helpers({
  showUserInfo () {
    return Template.instance().showUserInfo.get();
  }
});

Template.login_buttons.onCreated(function() {
  return this.showUserInfo = new ReactiveVar(false);
});

Template.login_buttons.events({
  "mouseenter .user-action" (d) {
    Template.instance().showUserInfo.set(true);
  },
  "mouseleave .user-action" (d) {
    Template.instance().showUserInfo.set(false);
  },
  "click .signin" (d) {
    openSignInOverlay();
  },
  "click .logout"  (e) {
    e.preventDefault();
    Template.instance().showUserInfo.set(false);
    Meteor.logout();
  }
});

Template.search_overlay.events({
  'click .close' (){
    return closeSearchOverlay();
  }
});

Template.search.onRendered(function(){
  if(Session.get('searchOverlayShown')){
    this.$('input').focus();
  }
});

Template.menu_overlay.events({
  'click .close' (){
    return closeMenuOverlay();
  },
  'click a, click button' (){
    return closeMenuOverlay();
  },
  'click .search' (){
    return openSearchOverlay();
  },
  'click .sign-up' (){
    return openSignInOverlay();
  },
  'click .log-in' (){
    return openSignInOverlay('login');
  }
});

Template.embed_overlay.onRendered(function(){
  this.$('.embed-code').select();
});
Template.embed_overlay.events({
  'click .close' (){
    return closeEmbedOverlay();
  },
  'click' (e, t){
    return t.$('.embed-code').select();
  }
});

Template.how_to_overlay.onCreated(function(){
  this.totalSlides = 5;
  this.currentSlide = new ReactiveVar(0);
});
Template.how_to_overlay.events({
  'click .close' (){
    return closeHowToOverlay();
  },
  'click .right' (e, t){
    return t.currentSlide.set((t.currentSlide.get() + 1) % t.totalSlides);
  },
  'click .left' (e, t){
    var currentSlide = t.currentSlide.get();
    if (currentSlide === 0){
      return t.currentSlide.set(t.totalSlides - 1);
    } else {
      return t.currentSlide.set( (currentSlide - 1) % t.totalSlides);
    }
  },
  'click .bullet' (e, t){
    t.currentSlide.set($(e.currentTarget).data('slide'));
  }
});
Template.how_to_overlay.helpers({
  'currentSlide' (){
    return Template.instance().currentSlide.get();
  }
});
