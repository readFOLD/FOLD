Template.admin.helpers({
  usersWhoLoveStories: function(){
    return _.sortBy(Meteor.users.find().fetch(), function(e){ return -1 * e.profile.favorites.length })
  }
});


Template.admin.helpers({
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


Template.read_admin_ui.onCreated(function(){
  this.subscribe('adminOtherUserPub', this.data.authorId);
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


