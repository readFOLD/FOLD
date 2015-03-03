Template.signup.helpers({
  twitterUsername: function() {
    return Template.instance().twitterUsername.get();
  }
});

Template.signup.created = function() {
  this.twitterUsername = new ReactiveVar();
  if (Meteor.user()) {
    console.log(Meteor.user());
  }
}
