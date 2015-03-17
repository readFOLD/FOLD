var idFromPathSegment = function(pathSegment) { // everything after last dash
  return pathSegment.substring(pathSegment.lastIndexOf('-') + 1);
};

Router.route("home", {
  path: "/",
  template: "home",
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  waitOn: function() {
    return this.subscribe('exploreStoriesPub', '', '', '').wait();
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  },
  data: function() {}
});

Router.route("about", {
  path: "about",
  template: "about",
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  },
  data: function() {}
});

Router.route("terms", {
  path: "terms",
  template: "terms",
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  },
  data: function() {}
});

Router.route("profile", {
  path: "profile",
  template: "profile",
  waitOn: function() {
    return [Meteor.subscribe('ownStoriesPub')];
  },
  onBeforeAction: function() {
    var user;
    if ((user = Meteor.user()) || Meteor.loggingIn()) {
      if (user) {
        this.subscribe('readStoriesPub', user.profile.favorites);
      }
      return this.next();
    } else {
      this.redirect("home", {
        replaceState: true
      });
      return alert("You must be logged in view your profile");
    }
  }
});

Router.route("my_stories", {
  path: "my-stories",
  template: "my_stories",
  waitOn: function() {
    return [Meteor.subscribe('ownStoriesPub')];
  },
  onBeforeAction: function() {
    var user;
    if ((user = Meteor.user()) || Meteor.loggingIn()) {
      //if (user) {
      //  this.subscribe('readStoriesPub', user.profile.favorites);
      //}
      return this.next();
    } else {
      this.redirect("home", {
        replaceState: true
      });
      return alert("You must be logged in view your profile");
    }
  }
});

Router.route("read", {
  path: "read/:userPathSegment/:storyPathSegment",
  template: "read",
  waitOn: function() {
    shortId = idFromPathSegment(this.params.storyPathSegment);
    return [Meteor.subscribe('readStoryPub', this.params.userPathSegment, shortId)];
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  },
  data: function() {
    var story;
    story = Stories.findOne({}, {reactive: false});
    if (story) {
      Session.set("story", story);
      Session.set("storyId", story._id);
      Session.set("backgroundImage", story.backgroundImage);
      Session.set("horizontalSectionsMap", _.map(_.pluck(story.verticalSections, "contextBlocks"), function(cBlocks, i) {
        return {
          verticalIndex: i,
          horizontal: _.map(_.pluck(cBlocks, '_id'), function(id, i) {
            return {
              _id: id,
              horizontalIndex: i
            }
          })
        };
      }));
      return story;
    }
  },
  onBeforeAction: function() {
    Session.set("currentY", null);
    Session.set("newStory", false);
    Session.set("read", true);
    Session.set("showDraft", false);
    return this.next();
  }
});


Router.route("edit", {
  path: "create/:userPathSegment/:storyPathSegment",
  template: "create",
  onRun: function() {
    Session.set("currentY", null);

    Session.set("userPathSegment", this.params.userPathSegment);
    $('html, body').scrollTop(0);
    return this.next();
  },
  waitOn: function() {
    shortId = idFromPathSegment(this.params.storyPathSegment);
    return [Meteor.subscribe('createStoryPub', this.params.userPathSegment, shortId), Meteor.subscribe('contextBlocksPub')];
  },
  data: function() {
    var story;
    story = Stories.findOne({shortId: idFromPathSegment(this.params.storyPathSegment)});
    if (story && story.draftStory) {
      Session.set("story", story.draftStory);
      Session.set("storyId", story._id);
      Session.set("storyPublished", story.published);
      Session.set("backgroundImage", story.draftStory.backgroundImage);
      Session.set("horizontalSectionsMap", _.map(_.pluck(story.draftStory.verticalSections, "contextBlocks"), function(cBlockIds, i) {
        return {
          verticalIndex: i,
          horizontal: _.map(cBlockIds, function(id, i) {
            return {
              _id: id,
              horizontalIndex: i
            }
          })
        };
      }));
      return story;
    }
  },
  action: function() {
    Session.set("read", false);
    Session.set("newStory", false);
    Session.set("showDraft", true);
    if (this.ready()) {
      return this.render();
    }
  },
  onBeforeAction: function() {
    var user;
    if ((user = Meteor.user()) || Meteor.loggingIn()) {
      if (user && user._id !== this.data().authorId) {
        this.redirect("read", this.data(), {
          replaceState: true
        });
        alert("Only the author may edit a story");
      }
      return this.next();
    } else {
      this.redirect("read", this.data(), {
        replaceState: true
      });
      alert("You must be logged in to edit a story");
      return this.next();
    }
  }
});

Router.route("signup", {
  path: "signup",
  template: "signup",
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  waitOn: function() {
    if (Meteor.user()) {
     [Meteor.subscribe('tempUsernamePub')];
      return this.next();
    }
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  }
});

Router.route("login", {
  path: "login",
  template: "login",
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  }
});
