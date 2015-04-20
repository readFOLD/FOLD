window.isValidPassword = function(p) {
  if (p.length >= 6) {
    return true;
  } else {
    return false;
  }
}

var checkPassword = function(p1,p2) {
  if (!isValidPassword(p1) || !(p1===p2)) {
    return Template.instance().invalidPassword.set(true);
  } else {
    return Template.instance().invalidPassword.set(false);
  }
};

var createUser = function(user, template) {
  Accounts.createUser({
    email: user.email,
    password: user.password,
    username: user.username,
    signupCode: user.signupCode,
    profile : {
      "name" : user.name
      }
    }, function(err) {
      if (err) {
        template.signupError.set(err.reason || err.error);
      } else {
        Router.go('/');
     }});
  };

Template.signup_form.onCreated(function() {
  this.invalidPassword = new ReactiveVar(false);
  this.signupError = new ReactiveVar();
});

Template.signup_form.helpers({
  tempUsername: function() {
    if (Meteor.user()) {
      return Meteor.user().tempUsername;
    }
    return;
  },
  emailUser: function() {  
   return Session.get('emailUser');
  },
  invalidPassword: function() {
    return Template.instance().invalidPassword.get();
  },
  signupError: function() {
    return Template.instance().signupError.get();
  }

});

Template.signup_form.events({
  'submit #signup-form': function (e, template) {
    e.preventDefault();

    var inputs = $('#signup-form').serializeArray();
    var userInfo = {};
    _.each(inputs, function (input) {
      key = input['name'];
      value = input['value'];
      userInfo[key] = value;
    });

    if (Meteor.user()) { // if just finishing signup and already created a user via twitter
      Meteor.call('updateUserInfo', userInfo, function (err) {
        if (err) {
          template.signupError.set(err.reason || err.error);
        } else {
          Router.go('/');
        }
      });
    } else { // if email user
      checkPassword(userInfo.password, userInfo.password2);
      if (!template.invalidPassword.get()) {
        createUser(userInfo, template);
      }
    }
  }
});
