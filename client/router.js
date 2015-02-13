var ExistingStoryController;

ExistingStoryController = RouteController.extend({
  onRun: function() {
    console.log('set currentY to null');
    Session.set("currentY", null);
    return this.next();
  }
});

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

Router.route("read", {
  path: "read/:userPathSegment/:storyPathSegment",
  template: "read",
  controller: ExistingStoryController,
  waitOn: function() {
    return [Meteor.subscribe('readStoryPub', this.params.userPathSegment, this.params.storyPathSegment), Meteor.subscribe('contextBlocksPub')];
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  },
  data: function() {
    var story;
    story = Stories.findOne();
    if (story) {
      Session.set("story", story);
      Session.set("storyId", story._id);
      Session.set("backgroundImage", story.backgroundImage);
      Session.set("horizontalSectionsMap", _.map(_.pluck(story.verticalSections, "contextBlocks"), function(cBlocks, i) {
        return {
          verticalIndex: i,
          horizontal: _.map(cBlocks, function(block, i) {
            return {
              horizontalIndex: i
            };
          })
        };
      }));
      return story;
    }
  },
  onBeforeAction: function() {
    Session.set("newStory", false);
    Session.set("read", true);
    return this.next();
  }
});

Router.route("create", {
  path: "create",
  template: "create",
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  onBeforeAction: function() {
    if (Meteor.user() || Meteor.loggingIn()) {
      return this.next();
    } else {
      this.redirect("home", {
        replaceState: true
      });
      return alert("You must be logged in to create a story");
    }
  },
  data: function() {
    var story, user;
    story = new Story;
    Session.set("story", story);
    Session.set("horizontalSectionsMap", []);
    Session.set("newStory", true);
    Session.set("read", false);
    if (user = Meteor.user()) {
      story.updateAuthor(user);
    }
    return story;
  }
});

Router.route("edit", {
  path: "create/:userPathSegment/:storyPathSegment",
  template: "create",
  controller: ExistingStoryController,
  onRun: function() {
    $('html, body').scrollTop(0);
    return this.next();
  },
  waitOn: function() {
    return [Meteor.subscribe('createStoryPub', this.params.userPathSegment, this.params.storyPathSegment), Meteor.subscribe('contextBlocksPub')];
  },
  data: function() {
    var story;
    story = Stories.findOne();
    if (story) {

      Session.set("story", story);
      Session.set("storyId", story._id);
      Session.set("backgroundImage", story.backgroundImage);
      Session.set("horizontalSectionsMap", _.map(_.pluck(story.verticalSections, "contextBlocks"), function(cBlocks, i) {
        return {
          verticalIndex: i,
          horizontal: _.map(cBlocks, function(block, i) {
            return {
              horizontalIndex: i
            };
          })
        };
      }));
      return story;
    }
  },
  action: function() {
    if (this.ready()) {
      return this.render();
    }
  },
  onBeforeAction: function() {
    var user;
    Session.set("newStory", false);
    Session.set("read", false);
    Session.set("userPathSegment", this.params.userPathSegment);
    Session.set("storyPathSegment", this.params.storyPathSegment);
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
