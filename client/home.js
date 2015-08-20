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
  closeSignInOverlay();
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

Template.signup_page.events({
  "click .twitter-signin": function (d) {
    loginWithTwitter();
    analytics.track('Click sign up with Twitter');
  }
})

// DEEPSTREAM

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
  Session.set('homeStreamListMode', 'best');
  Session.set('homeStreamListType', 'both');
  Session.set('homeStreamListQuery', null);

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
      var sort = {};
      switch (Session.get('homeStreamListMode')) {
        case 'best':
          _.extend(selector, {
            editorsPick: true
          });
          _.extend(sort, {
            editorsPickAt: -1
          });
          break;
        case 'most_recent':
          _.extend(sort, {
            createdAt: -1
          });
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
  },
  subsReady: function(){
    return FlowRouter.subsReady();
  }
});

Template.deepstream_preview.onCreated(function(){

  this.contentPreview = new ReactiveVar(this.data.deepstream.mostRecentContextOfTypes(['news', 'twitter', 'text']));
});

Template.deepstream_preview.helpers({
  linkPath: function () {
    return Template.instance().data.linkToCurate ? this.curatePath() : this.watchPath();
  },
  contentPreview: function(){
    return Template.instance().contentPreview.get();
  },
  previewTypeIs: function(type){
    var contentPreview = Template.instance().contentPreview.get();
    return contentPreview && contentPreview.type == type;
  }
});

Template.deepstream_preview.events({
  'click .news-button': function(d, t) {
    t.contentPreview.set(this.mostRecentContextOfType('news'));
  },
  'click .twitter-button': function(d, t) {
    t.contentPreview.set(this.mostRecentContextOfType('twitter'));
  },
  'click .text-button': function(d, t) {
    t.contentPreview.set(this.mostRecentContextOfType('text'));
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

Template.stream_preview.events({
  'click .close': function(e,t){
    Session.set('showPreviewOverlayForStreamId', null);
  },
  'click .show-preview-overlay': function(e,t){
    Session.set('showPreviewOverlayForStreamId', this._id);
  }
});

Template.stream_preview.helpers({
  'showPreviewOverlay': function(){
    return Session.equals('showPreviewOverlayForStreamId', this._id);
  }
});

Template.my_streams.helpers({
  streams: function () {
    if (FlowRouter.subsReady()) {
      return Deepstreams.find({curatorId: Meteor.user()._id});
    }
  }
});


