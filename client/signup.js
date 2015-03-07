var checkPassword = function(p1,p2) {
  if (!(p1.length >= 6) || !(p1===p2)) {
    return Template.instance().invalidPassword.set(true);
  } else {
    return Template.instance().invalidPassword.set(false);
  }
};

var createUser = function(user, template) {
  console.log({
    email: user.email,
    password: user.password,
    username: user.username,
    profile : { "name" : user.name }
    });
  Accounts.createUser({
    email: user.email,
    password: user.password,
    username: user.username,
    profile : { "name" : user.name }
    }, function(err) {
      if (err) {
        template.invalidUserSubmission.set(err.reason);
      } else {
        Router.go('/');
     }});
    return;
  };

Template.signup_form.created = function() {
  this.invalidPassword = new ReactiveVar(false);
  this.invalidUserSubmission = new ReactiveVar('');
}
Template.signup_form.helpers({
  tempUsername: function() {
    if (Meteor.user()) {
      return Meteor.user().tempUsername;
    }
    return;
  },
  emailUser: function() {  
    if (Meteor.user()) {
        return false;
    }
    return true;
  },
  invalidPassword: function() {
    return Template.instance().invalidPassword.get();
  },
  invalidUserSubmission: function() {
    return Template.instance().invalidUserSubmission.get();
  }

});

Template.signup_form.events({
  'submit #signup-form' : function(e, template) {
    e.preventDefault();

    inputs = $('#signup-form').serializeArray();
    user_info = {};
    _.each(inputs, function(input) {
        key = input['name'];
        value = input['value'];
        user_info[key]=value;
      });

    if (Meteor.user()) {
      Meteor.call('updateUserInfo', user_info, function(err) {
      if (err) {
        return alert(err); 
      } else {
        Router.go('/');
      }});
      return;
    } 

    checkPassword(user_info.password, user_info.password2);
    if (!template.invalidPassword.get()) { 
      createUser(user_info, template);
    }
    return;
    }
  })