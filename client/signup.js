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
     }});
  };

Template.signup_form.onCreated(function() {
  this.invalidPassword = new ReactiveVar(false);
  this.signupError = new ReactiveVar();
  this.emailError = new ReactiveVar();
  this.usernameError = new ReactiveVar();
  this.passwordError = new ReactiveVar();
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
  },
  emailError: function () { 
    return Template.instance().emailError.get();
  },
  usernameError: function () { 
    return Template.instance().usernameError.get();
  },
  passwordError: function () { 
    return Template.instance().passwordError.get();
  }
});

Template.signup_form.events({
  'blur input#signup-email': function(e, t) {
    var val = $(e.currentTarget).val();
    if (!SimpleSchema.RegEx.Email.test(val) && val !== '') {
      t.emailError.set('Invalid e-mail address');
      return;
    }

    if (SimpleSchema.RegEx.Email.test(val) && val !== '') {
      t.emailError.set('');
      return;
    }
  },
  'blur input#signup-username': function(e, t) {
    var username = $("#signup-username").val();
    username = trimInput(username);

    var result = checkValidUsername(username)
    if (!result.status) {
      t.usernameError.set(result.message)
    } else {
      t.usernameError.set(false)
    }
  },
  'blur input#signup-password, blur input#signup-password2': function(e, t) {
    var p1 = $("#signup-password").val();
    var p2 = $("#signup-password2").val();

    if (!isValidPassword(p1)) {
      t.passwordError.set('Password too short')
      return;
    }

    if (p1 !== p2) {
      t.passwordError.set('Passwords do not match')
      return;
    }

    if (p1 === p2) {
      t.passwordError.set('')
      return;
    }
  },
  'submit #signup-form': function (e, t) {
    e.preventDefault();

    if (t.emailError.get() || t.usernameError.get() || t.passwordError.get()) {
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
        }
      });
    } else { // if email user
      checkPassword(userInfo.password, userInfo.password2);
      if (!t.invalidPassword.get()) {
        createUser(userInfo, t);
      }
    }
  }
});
