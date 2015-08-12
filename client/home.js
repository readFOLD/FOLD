var formatDate, weekDays, formatDateNice, monthNames;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Friday 2/20/2015 20:29:22
formatDate = function (date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};

// February 7th, 2015
formatDateNice = function (date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return monthNames[(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear();
};

loginWithTwitter = function () {
  Session.set('signingInWithTwitter', true);
  Meteor.loginWithTwitter({
    requestPermissions: ['user']
  }, function (err) {
    if (err) {
      notifyError("Twitter login failed");
      Session.set('signingInWithTwitter', false);
      throw(err); // throw error so we see it on kadira
    } else if (!Meteor.user().username) { // if they are signing up for the first time they won't have a username yet
      FlowRouter.go('twitter-signup');
    } else { // otherwise they are a returning user, they are now logged in and free to proceed
      notifyLogin();
    }
  });
};

loginWithEmail = function () {
  FlowRouter.go('login')
};

Template.home.helpers({
  user: function () {
    return Meteor.user();
  },
  filterOpen: function () {
    return Session.get("filterOpen");
  },
  sticky: function () {
    return Session.get("sticky");
  },
  filter: function () {
    return Session.get("filter");
  },
  category: function () {
    return Session.get("category");
  }
});


Template.categories.helpers({
  categories: function () {
    return ['all', 'news', 'history', 'art', 'technology', 'politics', 'e-sports', 'music', 'gaming', 'sponsored'];
  },
  selected: function () {
    return Session.equals("category", this.toString());
  }
});

Template.categories.events({
  "click li": function (d) {
    var srcE;
    srcE = d.srcElement ? d.srcElement : d.target;
    return Session.set('category', $(srcE).data('category'));
  }
});

Template.filters.onRendered(function () {
  $("select").selectOrDie({});
});

var filters = ['curated', 'trending', 'starred', 'newest'];
Session.set('filterValue', filters[0]); // this must correspond to the first thingin the dropdown

Template.filters.helpers({
  filters: function () {
    return filters
  },
  conditionallySelected: function () {
    return Session.equals('filterValue', this.toString()) ? 'selected' : '';
  }
});

Template.filters.events({
  "change select": function (e, t) {
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


var getSubscriptionPage = function (filterValue) {
  return subscriptionsPage.get(filterValue + 'Stories')
};

var setSubscriptionPage = function (filterValue, val) {
  return subscriptionsPage.set(filterValue + 'Stories', val);
};

var getCurrentSubscriptionPage = function () {
  return getSubscriptionPage(Session.get('filterValue'));
};

var setCurrentSubscriptionPage = function (val) {
  return setSubscriptionPage(Session.get('filterValue'), val);
};


var incrementSubscriptionPage = function (filterValue) {
  setSubscriptionPage(filterValue, getSubscriptionPage(filterValue) + 1);
};


var incrementCurrentSubscriptionPage = function () {
  setCurrentSubscriptionPage(getCurrentSubscriptionPage() + 1);
};

var subscriptionsReady = new ReactiveDict();
var subscriptionsPage = new ReactiveDict();
_.each(filters, function (filter) {
  setSubscriptionPage(filter, -1);
});

setSubscriptionPage('curated', 0); // curated stories are preloaded


var homeSubs = new SubsManager({
  cacheLimit: 9999,
  expireIn: 99999999
});

// these methods all keep the subscription open for the lifetime of the window, but can be called again safely
var subscribeToCuratedStories = function (cb) {
  if (!curatedStoriesSub) {
    curatedStoriesSub = homeSubs.subscribe("curatedStoriesPub", function () {
      var timeToLoadStories = Date.now() - createHomePageDate;
      trackTiming('Subscription', 'Full curated stories ready (time since created template)', timeToLoadStories);
      subscriptionsReady.set('curatedStories', true);
      if (cb) {
        cb();
      }
    })
  } else {
    if (cb) {
      cb();
    }
  }
};
var subscribeToTrendingStories = function (cb) {
  if (!trendingStoriesSub) {
    trendingStoriesSub = homeSubs.subscribe("trendingStoriesPub", function () {
      incrementSubscriptionPage('trending');
      subscriptionsReady.set('trendingStories', true);
      if (cb) {
        cb();
      }
    })
  } else {
    if (cb) {
      cb();
    }
  }
};
var subscribeToNewestStories = function (cb) {
  if (!newestStoriesSub) {
    newestStoriesSub = homeSubs.subscribe("newestStoriesPub", function () {
      incrementSubscriptionPage('newest');
      subscriptionsReady.set('newestStories', true);
      if (cb) {
        cb();
      }
    })
  } else {
    if (cb) {
      cb();
    }
  }
};

var subscribeToStarredStories = function (cb) {
  if (!starredStoriesSub) {
    starredStoriesSub = homeSubs.subscribe("starredStoriesPub", function () {
      incrementSubscriptionPage('starred');
      subscriptionsReady.set('starredStories', true);
      if (cb) {
        cb();
      }
    })
  } else {
    if (cb) {
      cb();
    }
  }
};

var createHomePageDate;

Template.all_stories.onCreated(function () {
  var that = this;
  createHomePageDate = Date.now();
  subscribeToCuratedStories(function () {
    subscribeToTrendingStories(function () {
      subscribeToNewestStories(function () {
        subscribeToStarredStories(function () {
          if (!that.view.isDestroyed) { // because this happens asynchronously, the user may have already navigated away
            that.autorun(function () {
              that.subscribe('minimalUsersPub', Stories.find({published: true}, {
                fields: {authorId: 1},
                reactive: false
              }).map(function (story) {
                return story.authorId
              }));
            });
          }
        })
      })
    });
  });

  var notFirstRun = false;
  this.autorun(function () {
    Session.get('filterValue'); // re-run whenever filter value changes
    if (notFirstRun) {
      $(window).scrollTop(0)
    }
    notFirstRun = true;
  });
});


var currentHomeStories = function () {

  var limit = (getCurrentSubscriptionPage() + 1) * PUB_SIZE;

  if (limit <= 0) {
    return
  }

  switch (Session.get('filterValue')) {
    case 'curated': // preview versions of all these stories come from fast-render so we can show them right away
      return Stories.find({published: true, editorsPick: true}, {
        sort: {'editorsPickAt': -1},
        limit: limit,
        reactive: true
      }); // .fetch() prevents a weird "Bad index" error
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
  'click .show-more': function (e, t) {
    var filterValue = Session.get('filterValue');
    subscriptionsReady.set(filterValue + 'Stories', false);
    homeSubs.subscribe(filterValue + 'StoriesPub', {page: getCurrentSubscriptionPage() + 1}, function () {
      incrementCurrentSubscriptionPage();
      subscriptionsReady.set(filterValue + 'Stories', true);
    })
  }
});

Template.all_stories.helpers({ // most of these are reactive false, but they will react when switch back and forth due to nesting inside ifs (so they rerun when switching between filters)
  stories: currentHomeStories,
  storiesLoading: function () {
    return (!(subscriptionsReady.get(Session.get('filterValue') + 'Stories')))
  },
  moreToShow: function () {
    var stories = currentHomeStories();
    if (!stories) {
      return false
    }
    return currentHomeStories().count() >= (getCurrentSubscriptionPage() + 1) * PUB_SIZE
  }
});

Template.story_preview.helpers({
  story: function () {
    return Stories.findOne(this._id);
  }
});

Template._story_preview_content.helpers({
  lastPublishDate: function () {
    if (this.publishedAt) {
      return formatDateNice(this.publishedAt);
    }
  },
  story: function () {
    if (Template.instance().data.useDraftStory) {
      return this.draftStory;
    } else {
      return this;
    }
  },
  linkRoute: function () {
    return Template.instance().data.useDraftStory ? 'edit' : 'read';
  },
  author: function () {
    return Meteor.users.findOne(this.authorId)
  },
  profileUrl: function () {
    return '/profile/' + (this.authorDisplayUsername || this.authorUsername); // TODO migrate drafts and only use authorDisplayUsername
  },
  contextCountOfType: function (type) {
    return this.contextBlockTypeCount ? this.contextBlockTypeCount[type] : this.contextCountOfType(type);
  }
});

Template.login_buttons.helpers({
  showUserInfo: function () {
    return Template.instance().showUserInfo.get();
  }
});

Template.login_buttons.onCreated(function () {
  return this.showUserInfo = new ReactiveVar(false);
});

Template.login_buttons.events({
  "mouseenter .user-action": function (d) {
    Template.instance().showUserInfo.set(true);
  },
  "mouseleave .user-action": function (d) {
    Template.instance().showUserInfo.set(false);
  },
  "click .signin": function (d) {
    Session.set('signingIn', true);
    setSigningInFrom();
  },
  "click .logout": function (e) {
    e.preventDefault();
    Template.instance().showUserInfo.set(false);
    Meteor.logout();
  }
});

window.setSigningInFrom = function () {
  Session.set('signingInFrom', FlowRouter.current().path);
};

window.returnFromSignIn = function () {
  FlowRouter.go(Session.get('signingInFrom') || '/');
}

var closeSignInOverlay = function () {
  Session.set('signingIn', false);
};

// TODO close sign in overlay on esc (27) need to do on whole window though

Template.signin_overlay.events({
  "click .close": function (d) {
    closeSignInOverlay();
    analytics.track('Click close sign-in overlay');
  },
  "click .twitter-signin": function (d) {
    closeSignInOverlay();
    loginWithTwitter();
    analytics.track('Click login with Twitter');
  },
  "click .email-signin": function (d) {
    closeSignInOverlay();
    loginWithEmail();
    analytics.track('Click login with email');
  }
});


// DEEPSTREAM

Meteor.startup(function () {
  Session.setDefault('homeStreamListMode', 'best');
  Session.setDefault('homeStreamListType', 'both');
});


Template.top_banner.helpers({
  showBestStreams: function () {
    return Session.equals('homeStreamListMode', 'best');
  },
  showMostRecentStreams: function () {
    return Session.equals('homeStreamListMode', 'most_recent');
  }
});

Template.home.onCreated(function () {
  var that = this;
  this.noMoreStreamResults = new ReactiveVar();
  this.loadingStreamResults = new ReactiveVar();

  this.streamSearch = function(query){
    that.loadingStreamResults.set(true);
    that.noMoreStreamResults.set(null);
    Meteor.call('streamSearchList', query, function (err, results) {
      that.loadingStreamResults.set(false);
      if (err) {
        that.noMoreStreamResults.set('No more results'); // TO-DO - surface error to user?
        throw(err);
        return;
      }

      var items = results.items;
      var nextPage = results.nextPage;

      if (!items || !items.length) {
        that.noMoreStreamResults.set('No results found');
        return;
      }
      _.chain(items)
        .map(ContextBlock.searchMappings['all_streaming_services'].mapFn || _.identity)
        .each(function (item, i) {
          _.extend(item, {
            type: "stream",
            //authorId: Meteor.user() ? Meteor.user()._id : ,
            searchQuery: query,
            searchOption: "homepage_search",
            nextPage: nextPage,
            ordinalId: count(),
            fullDetails: items[i] // include all original details from the api
          });
          //_.defaults(item, {
          //  source: source // for multi-source search, may already have a source
          //});

          SearchResults.insert(item);
        });
    });
  }

});
Template.home.onRendered(function () {
  var query = Session.get('homeStreamListQuery');
  if (query) {
    this.$('#stream-search-input').val(query);
  }
});



Template.home.helpers({
  noMoreStreamResults: function(){
    return Template.instance().noMoreStreamResults.get();
  },
  loadingStreamResults: function(){
    return Template.instance().loadingStreamResults.get();
  },
  showDeepstreamsOnly: function(){
    return Session.equals('homeStreamListType', 'deepstreams');
  },
  showLivestreamsOnly: function(){
    return Session.equals('homeStreamListType', 'livestreams');
  },
  showDeepstreamsAndLivestreams: function(){
    return Session.equals('homeStreamListType', 'both');
  },
  showDeepstreams: function(){
    return Session.equals('homeStreamListType', 'both') || Session.equals('homeStreamListType', 'deepstreams');
  },
  showLivestreams: function(){
    return Session.equals('homeStreamListType', 'both') || Session.equals('homeStreamListType', 'livestreams');
  }
});

Template.home.events({
  "submit .stream-search-form": function (e, t) {
    e.preventDefault();
    var query = t.$('#stream-search-input').val();
    Session.set('homeStreamListQuery', query);
    Session.set('homeStreamListMode', 'search');

    // TODO DRY
    if(SearchResults.find({
      searchQuery: Session.get('homeStreamListQuery'),
      searchOption: "homepage_search"
    }).count() === 0){
      t.streamSearch(query);
    } else {
      t.noMoreStreamResults.set(null);
    }
  },
  "click .show-best-streams": function (e, t) {
    t.$('#stream-search-input').val('');
    Session.set('homeStreamListMode', 'best');
  },
  "click .show-most-recent-streams": function (e, t) {
    t.$('#stream-search-input').val('');
    Session.set('homeStreamListMode', 'most_recent');
  },
  "click .show-deepstreams-only": function (e, t) {
    Session.set('homeStreamListType', 'deepstreams');
  },
  "click .show-livestreams-only": function (e, t) {
    Session.set('homeStreamListType', 'livestreams');
  },
  "click .show-deepstreams-and-livestreams": function (e, t) {
    Session.set('homeStreamListType', 'both');
  }
});

Template.deepstreams.helpers({
  streams: function () {
    if (FlowRouter.subsReady()) {
      var selector = {onAir: true};
      var sort = {createdAt: -1};
      switch (Session.get('homeStreamListMode')) {
        case 'best':
          _.extend(selector, {
            editorsPick: true
          });
          break;
        case 'most_recent':
          // do nothing, already sorted by createdAt
          break;
        case 'search':
          var regExp = buildRegExp(Session.get('homeStreamListQuery'));
          _.extend(selector, {
            $or: [
              {title: regExp},
              {description: regExp},
              {username: regExp}
              //{ $text: { $search: searchText, $language: 'en' } }
            ]
          });
          break;
      }
      return Deepstreams.find(selector, {
        sort: sort
      });
    }
  }
});

Template.streams.helpers({
  streams: function () {
    if (FlowRouter.subsReady()) {
      var sort = {};
      switch (Session.get('homeStreamListMode')) {
        case 'best':
          return Streams.find({}, {
            sort: {
              currentViewers: -1
            },
            limit: 20
          }).map(function(stream){
            return _.extend({_id: stream._id}, ContextBlock.searchMappings['all_streaming_services'].mapFn(stream));
          }).map(function(stream){ return new Stream(stream)}); // TODO refactor all this so that streams make a bit more sense
          break;
        case 'most_recent':
          return Streams.find({}, {
            sort: {
              createdAt: -1
            },
            limit: 20
          }).map(function(stream){
            return _.extend({_id: stream._id}, ContextBlock.searchMappings['all_streaming_services'].mapFn(stream));
          }).map(function(stream){ return new Stream(stream)});
          break;
        case 'search':
          return SearchResults.find({
            searchQuery: Session.get('homeStreamListQuery'),
            searchOption: "homepage_search"
          })
      }
    }
  }
});

Template.stream_preview.onCreated(function () {
  this.showPreviewOverlay = new ReactiveVar();
});

Template.stream_preview.events({
  'click .close': function(e,t){
    t.showPreviewOverlay.set(false);
  },
  'click .show-preview-overlay': function(e,t){
    t.showPreviewOverlay.set(true);
  }
});

Template.stream_preview.helpers({
  'showPreviewOverlay': function(){
    return Template.instance().showPreviewOverlay.get();
  }
});

Template.my_streams.helpers({
  streams: function () {
    if (FlowRouter.subsReady()) {
      return Deepstreams.find({curatorId: Meteor.user()._id});
    }
  }
});


