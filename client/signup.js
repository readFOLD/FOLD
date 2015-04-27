var createUser = function(user, template) {
  Accounts.createUser({
    email: user.email,
    password: user.password,
    username: user.username,
    profile : {
      "name" : user.name
      }
    }, function(err) {
      if (err) {
        if (err.error === 'username') {
          template.usernameError.set(err.reason || err.error);          
        } else if (err.error === 'email') {
          template.emailError.set(err.reason || err.error);          
        } else {
          template.signupError.set(err.reason || err.error);          
        }

      } else {
        Router.go('/');
        notifyLogin();
     }});
  };

Template.signup_form.onCreated(function() {
  this.signupError = new ReactiveVar();
  this.emailError = new ReactiveVar();
  this.nameError = new ReactiveVar();
  this.usernameError = new ReactiveVar();
  this.passwordError = new ReactiveVar();
  this.password2Error = new ReactiveVar();
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
  signupError: function() {
    return Template.instance().signupError.get();
  },
  emailError: function () { 
    return Template.instance().emailError.get();
  },
  nameError: function () { 
    return Template.instance().nameError.get();
  },
  usernameError: function () { 
    return Template.instance().usernameError.get();
  },
  passwordError: function () { 
    return Template.instance().passwordError.get();
  },
  password2Error: function () { 
    return Template.instance().password2Error.get();
  }
});

Template.signup_form.events({
  'blur input#signup-email, submit #signup-form': function(e, t) {
    var email = $(e.currentTarget).val();
    email = trimInput(email);

    var result = checkValidEmail(email)
    if (!result.status) {
      t.emailError.set(result.message)
    } else {
      t.emailError.set(false)
    }
  },
  'blur input#signup-name, submit #signup-form': function(e, t) {
    var name = $(e.currentTarget).val();
    name = trimInput(name);

    var result = checkValidName(name)
    if (!result.status) {
      t.nameError.set(result.message)
    } else {
      t.nameError.set(false)
    }
  },
  'blur input#signup-username, submit #signup-form': function(e, t) {
    var username = $("#signup-username").val();
    username = trimInput(username);

    var result = checkValidUsername(username)
    if (!result.status) {
      t.usernameError.set(result.message)
    } else {
      t.usernameError.set(false)
    }
  },
  'blur input#signup-password, blur input#signup-password2, submit #signup-form': function(e, t) {
    var p1 = $("#signup-password").val();
    var p2 = $("#signup-password2").val();

    var result = checkValidPassword(p1, p2);
    if (!result.status) {
      t.passwordError.set(result.message)
    } else {
      t.passwordError.set(false)
    }

    var result2 = checkValidPasswordConfirmation(p1, p2);
    if (!result2.status) {
      t.password2Error.set(result2.message)
    } else {
      t.password2Error.set(false)
    }
  },
  'submit #signup-form': function (e, t) {
    e.preventDefault();

    if (t.emailError.get() || t.usernameError.get() || t.passwordError.get()|| t.password2Error.get()) {
      t.signupError.set('Please fix errors in required fields');
      return;
    }

    var inputs = $('#signup-form').serializeArray();
    var userInfo = {};
    _.each(inputs, function (input) {
      key = input['name'];
      value = input['value'];
      userInfo[key] = value;
    });

    if (Meteor.user()) { // if just finishing signup and already created a user via twitter
      Meteor.call('updateInitialTwitterUserInfo', userInfo, function (err) {
        if (err) {
          t.signupError.set(err.reason || err.error);
        } else {
          Router.go('/');
          notifyLogin();
        }
      });
    } 
    else { // if email user
      createUser(userInfo, t);
    }
  }
});
