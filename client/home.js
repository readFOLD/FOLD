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
  Meteor.loginWithTwitter({
    requestPermissions: ['user']
  }, function (err) {
    if (err) {
      alert("can't login with Twitter");
    } else if (!Meteor.user().username) {
      Router.go('/signup');
    } 
    return;
  });
};

loginWithEmail = function() {
  Router.go('/login')
}

Template.home.helpers({
  profileImage: function() {
    return Meteor.user().profile.profile_picture;
  },
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

Template.home.rendered = function() {
  $("select").selectOrDie({

  })
  // return $('div.content').each(function(i, e) {
  //   return $(e).dotdotdot({
  //     ellipsis: '...'
  //   });
  // });
};

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
    return Stories.find({ published: true }, {reactive: false});
  }
});

Template._story_preview_content.helpers({
  lastPublishDate: function() {
    return formatDateNice(this.publishDate);
  }
});

Template.user_stories.events({
  "click div#delete": function(d) {
    var srcE, storyId;
    srcE = d.srcElement ? d.srcElement : d.target;
    storyId = $(srcE).closest('div.story').data('story-id');
    return Stories.remove({
      _id: storyId
    });
  }
});

Template.login_buttons.helpers({
  signingIn: function() {
    return Template.instance().signingIn.get();
  }
});

Template.login_buttons.created = function() {
  return this.signingIn = new ReactiveVar(false);
};

Template.login_buttons.events({
  "mouseover": function(d) {
    Template.instance().signingIn.set(true);
  },
  "mouseout": function(d) {
    Template.instance().signingIn.set(false);
  },
  'click .logout' : function(e) {
    e.preventDefault();
    Meteor.logout();
  },
  "click .twitter-signin": function(d) {
    return loginWithTwitter();
  },
  "click .email-signin": function(d) {
    return loginWithEmail();
  }
})
