
Template.signup.helpers({
  twitterUsername: function() {
    if (Meteor.user() && Meteor.user().tempUsername) {
      return Meteor.user().tempUsername;
    }
  }
});

