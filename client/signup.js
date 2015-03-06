// var isValidUsername = 

var checkPassword = function(p1,p2) {
  if (!(p1.length >= 6) || !(p1===p2)) {
    return Template.instance().invalidPassword.set(true);
  } else {
    return Template.instance().invalidPassword.set(false);
  }
};

var createUser = function(user) {
  Accounts.createUser({email: user.email, password: user.password, username: user.username,
    profile: {
      'name':user.name
    }}, function(err) {
      if (err) {
       //error creating user TODO
      } else {
        Router.go('/');
     }
    })
    return;
  };

Template.signup_form.created = function() {
  this.invalidPassword = new ReactiveVar(false);
}
Template.signup_form.helpers({
  tempUsername: function() {  
    if (Meteor.user()) {
      return Meteor.user().tempUsername;
    }
  },
  invalidPassword: function() {
    return Template.instance().invalidPassword.get();
  }
});

Template.signup_form.events({
  'submit #signup-form' : function(e, target) {
    e.preventDefault();

    inputs = $('#signup-form').serializeArray();
    user_info = {};
    _.each(inputs, function(input) {
        key = input['name'];
        value = input['value'];
        user_info[key]=value;
      });

    //TODO
    // if (Meteor.user()) {
    //   //twitter signup, update user info
    //   return;
    // } 

    checkPassword(user_info.password, user_info.password2);
    if (!Template.instance().invalidPassword.get()) {
      createUser(user_info);
    }
    return;
    }
  })