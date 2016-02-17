Template.admin.helpers({
  usersWhoLoveStories: function(){
    return _.sortBy(Meteor.users.find().fetch(), function(e){ return -1 * e.profile.favorites.length })
  },
  emailAddress: function () {
    if (this.emails) {
      return this.emails[0].address;
    }
  },
  twitterHandle: function () {
    if (this.services && this.services.twitter && this.services.twitter.screenName) {
      return '@' + this.services.twitter.screenName;
    }
  }
});

Template.admin.events({
  'keypress .impersonate': function (e,t) {
    if(enterPress(e)){
      var username = t.$('input.impersonate').val();
      Meteor.call('impersonate', username, function (err, userId) {
        if(err){
          notifyError(err)
        } else {
          Meteor.connection.setUserId(userId);
          notifySuccess("Ok you're in! Be very very careful.");
          Router.go('/');
        }
      });
    }
  }
});


Template.read_admin_ui.helpers({
  emailAddress: function () {
    var user = Meteor.users.findOne(this.authorId);
    if (user && user.emails) {
      return user.emails[0].address;
    }
  },
  twitterHandle: function () {
    var user = Meteor.users.findOne(this.authorId);
    if (user && user.services && user.services.twitter) {
      return '@' + user.services.twitter.screenName;
    }
  }
});

Template.admin_recent_drafts.helpers({
  recentDrafts: function() {
    return Stories.find({
      published : false
    }, {
        sort: {
          savedAt: -1
        }
      }
    );
  }
});

Template.admin_recent_drafts.events({
  'click .show-more': function(){
    Session.set("adminRecentDraftsMore", Session.get("adminRecentDraftsMore") + 1);
  }
});


Template.admin_recent_drafts.onCreated(function(){
  Session.setDefault('adminRecentDraftsMore', 0);

  var that = this;

  this.autorun(function(){
    that.subscribe("adminRecentDraftsPub", {more: Session.get("adminRecentDraftsMore")})
  });
});

Template.admin_recent_activities.onCreated(function(){
  Session.setDefault('adminRecentActivitiesMore', 0);

  var that = this;

  this.autorun(function(){
    that.subscribe("adminRecentActivitiesPub", {more: Session.get("adminRecentActivitiesMore")})
  });
});

Template.admin_recent_activities.events({
  'click .show-more': function(){
    Session.set("adminRecentActivitiesMore", Session.get("adminRecentActivitiesMore") + 1);
  }
});


Template.admin_recent_activities.helpers({
  activities: function(){
    return Activities.find({}, {sort: {published: -1}});
  }
});
