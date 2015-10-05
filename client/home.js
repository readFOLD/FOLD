

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
  showUserInfo () {
    return Template.instance().showUserInfo.get();
  },
  loggingOut () {
    return Template.instance().loggingOut.get();
  }
});

Template.login_buttons.onCreated(function () {
  this.showUserInfo = new ReactiveVar(false);
  this.loggingOut = new ReactiveVar(false);
});

Template.login_buttons.events({
  "mouseenter .user-action" (d) {
    Template.instance().showUserInfo.set(true);
  },
  "mouseleave .user-action" (d) {
    Template.instance().showUserInfo.set(false);
  },
  "click .signin" (d) {
    Session.set('signingIn', true);
    setSigningInFrom();
  },
  "click .logout" (e, t) {
    e.preventDefault();
    t.showUserInfo.set(false);
    t.loggingOut.set(true);
    Meteor.logout(() =>
      t.loggingOut.set(false)
    );
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

// TO-DO close sign in overlay on esc (27) need to do on whole window though

Template.signin_overlay.events({
  "click .close" (d) {
    closeSignInOverlay();
    analytics.track('Click close sign-in overlay');
  },
  "click .twitter-signin, click .twitter-signup" (d) {
    closeSignInOverlay();
    loginWithTwitter();
    analytics.track('Click login with Twitter');
  },
  "click .email-signin" (d) {
    closeSignInOverlay();
    loginWithEmail();
    analytics.track('Click login with email');
  }
});

Template.signup_page.events({
  "click .twitter-signin" (d) {
    loginWithTwitter();
    analytics.track('Click sign up with Twitter');
  }
});

// DEEPSTREAM

Template.top_banner.helpers({
  showBestStreams () {
    return Session.equals('homeStreamListMode', 'best');
  },
  showMostRecentStreams () {
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
  noMoreStreamResults (){
    return Template.instance().noMoreStreamResults.get();
  },
  loadingStreamResults (){
    return Template.instance().loadingStreamResults.get();
  },
  showDeepstreamsOnly (){
    return Session.equals('homeStreamListType', 'deepstreams');
  },
  showLivestreamsOnly (){
    return Session.equals('homeStreamListType', 'livestreams');
  },
  showDeepstreamsAndLivestreams (){
    return Session.equals('homeStreamListType', 'both');
  },
  showDeepstreams (){
    return Session.equals('homeStreamListType', 'both') || Session.equals('homeStreamListType', 'deepstreams');
  },
  showLivestreams (){
    return Session.equals('homeStreamListType', 'both') || Session.equals('homeStreamListType', 'livestreams');
  }
});

var getHomepageStreamSearchResults = function() {
  return SearchResults.find({
    searchQuery: Session.get('homeStreamListQuery'),
    searchOption: "homepage_search"
  });
};

Template.home.events({
  "submit .stream-search-form" (e, t) {
    e.preventDefault();
    var query = t.$('#stream-search-input').val();
    Session.set('homeStreamListQuery', query);
    Session.set('homeStreamListMode', 'search');

    if(getHomepageStreamSearchResults().count() === 0){
      t.streamSearch(query);
    } else {
      t.noMoreStreamResults.set(null);
    }
  },
  "click .show-best-streams" (e, t) {
    t.$('#stream-search-input').val('');
    Session.set('homeStreamListMode', 'best');
  },
  "click .show-most-recent-streams" (e, t) {
    t.$('#stream-search-input').val('');
    Session.set('homeStreamListMode', 'most_recent');
  },
  "click .show-deepstreams-only" (e, t) {
    Session.set('homeStreamListType', 'deepstreams');
  },
  "click .show-livestreams-only" (e, t) {
    Session.set('homeStreamListType', 'livestreams');
  },
  "click .show-deepstreams-and-livestreams" (e, t) {
    Session.set('homeStreamListType', 'both');
  }
});

Template.deepstreams.helpers({
  streams () {
    if (FlowRouter.subsReady()) {
      var selector = {onAir: true};
      var sort = { live: -1 };
      switch (Session.get('homeStreamListMode')) {
        case 'best':
          _.extend(selector, {
            //editorsPick: true // TODO launch uncomment
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
      }, {
        reactive: false
      });
    }
  },
  subsReady (){
    return FlowRouter.subsReady();
  }
});

Template.deepstream_preview.onCreated(function(){
  this.subscribe('deepstreamPreviewContext', this.data.deepstream.shortId);
  this.contentPreviewType = new ReactiveVar('latest');
});

Template.deepstream_preview.helpers({
  title () {
    return this.title || '(untitled)';
  },
  linkPath () {
    return Template.instance().data.linkToCurate ? this.curatePath() : this.watchPath();
  },
  contentPreview (){
    switch (Template.instance().contentPreviewType.get()){
      case 'latest':
        return this.mostRecentContextOfTypes(['news', 'twitter', 'text']);
      case 'news':
        return this.mostRecentContextOfType('news');
      case 'twitter':
        return this.mostRecentContextOfType('twitter');
      case 'text':
        return this.mostRecentContextOfType('text');
    }
  },
  previewTypeIs (type){
    if (Template.instance().contentPreviewType.get() === 'latest'){
      let context;
      if (context = this.mostRecentContextOfTypes(['news', 'twitter', 'text'])){
        return context.type === type;
      }
    } else {
      return Template.instance().contentPreviewType.get() === type;
    }
  }
});

Template.deepstream_preview.events({
  'click .news-button' (d, t) {
    t.contentPreviewType.set('news');
  },
  'click .twitter-button' (d, t) {
    t.contentPreviewType.set('twitter');
  },
  'click .text-button' (d, t) {
    t.contentPreviewType.set('text');
  }
});

Template.streams.helpers({
  streams () {
    if (FlowRouter.subsReady()) {
      switch (Session.get('homeStreamListMode')) {
        case 'best':
          return Streams.find({}, {
            sort: {
              currentViewers: -1
            },
            limit: 20,
            reactive: false
          }).map(function(stream){
            return _.extend({_id: stream._id}, ContextBlock.searchMappings['all_streaming_services'].mapFn(stream));
          }).map(function(stream){ return new Stream(stream)}); // TODO refactor all this so that streams make a bit more sense
          break;
        case 'most_recent':
          return Streams.find({}, {
            sort: {
              creationDate: -1
            },
            limit: 20,
            reactive: false
          }).map(function(stream){
            return _.extend({_id: stream._id}, ContextBlock.searchMappings['all_streaming_services'].mapFn(stream));
          }).map(function(stream){ return new Stream(stream)});
          break;
        case 'search':
          return getHomepageStreamSearchResults().map(function(stream){ return new Stream(stream)});
      }
    }
  }
});

Template.stream_preview.events({
  'click .close' (e,t){
    Session.set('showPreviewOverlayForStreamId', null);
  },
  'click .show-preview-overlay' (e,t){
    Session.set('showPreviewOverlayForStreamId', this._id);
  }
});

Template.stream_preview.helpers({
  'showPreviewOverlay' (){
    return Session.equals('showPreviewOverlayForStreamId', this._id);
  }
});

Template.my_streams.helpers({
  streams () {
    if (FlowRouter.subsReady()) {
      return Deepstreams.find({curatorIds: Meteor.user()._id});
    }
  }
});

Template.my_streams.events({
  'click .delete-deepstream': function(){
    if (confirm('Are you sure you want to delete this deepstream? This cannot be undone.')){
      Meteor.call('deleteDeepstream', this.shortId, function(err, result) {
        if(err || !result){
          notifyError('Delete failed.');
        }
      });
    }
  }
});
