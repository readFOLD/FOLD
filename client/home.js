var formatDate, weekDays, formatDateNice, monthNames;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

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

Template.home.onRendered(function() {
  $("select").selectOrDie({

  });
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

Template.filters.helpers({
  filters: function() {
    return ['curated', 'trending', 'starred', 'newest'];
  },
  selected: function() {
    return Session.equals("filter", this.toString());
  }
});

Template.filters.events({
  "click li": function(d) {
    var srcE;
    srcE = d.srcElement ? d.srcElement : d.target;
    return Session.set('filter', $(srcE).data('filter'));
  }
});

Template.all_stories.helpers({
  stories: function() {
    return Stories.find({ published: true }, {sort: {'publishedAt': 1}, reactive: false}); // TODO update sort based on dropdown selection
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
  headerImageUrl: function() {
    return '//' + Meteor.settings["public"].AWS_BUCKET + '.s3.amazonaws.com/header-images/' + this.headerImage;
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
  "mouseover": function(d) {
    Template.instance().showUserInfo.set(true);
  },
  "mouseout": function(d) {
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
