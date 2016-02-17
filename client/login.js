

// TODO close sign in overlay on esc (27) need to do on whole window though

var newUserInfo;

Template.signin_overlay.onCreated(function(){
  Session.set('signinStage', 'signup');
  newUserInfo = {};
});

Template.signin_overlay.helpers({
  explanation (){
    var signingIn = Session.get('signingIn');
    if(typeof signingIn === 'string'){
      return signingIn
    }
  },
  onSignupStage (){
    return Session.equals('signinStage', 'signup');
  },
  onLoginStage (){
    return Session.equals('signinStage', 'login');
  },
  onInfoStage (){
    return Session.equals('signinStage', 'info');
  },
  onPasswordStage (){
    return Session.equals('signinStage', 'password');
  },
  onOnboardingStage (){
    return Session.equals('signinStage', 'onboarding');
  },
  onForgotStage (){
    return Session.equals('signinStage', 'forgot');
  }
});

Template.signin_overlay.events({
  "click .close" (d) {
    closeSignInOverlay();
    trackEvent('Click close sign-in overlay');
  },
  "click" (e){
    if($(e.currentTarget).hasClass('signin-overlay') && Session.equals('signinStage', 'signup')){
      closeSignInOverlay();
      trackEvent('Click outside sign-in overlay and close');
    }
  },
  "click .twitter-signin" (d) {
    Meteor.loginWithTwitter({
      requestPermissions: ['user']
    }, function (err) {
      if (err) {
        notifyError("Twitter login failed");
        throw(err); // throw error so we see it on kadira
      } else if (!Meteor.user().username) { // if they are signing up for the first time they won't have a username yet
        Session.set('signinStage', 'info');
      } else { // otherwise they are a returning user, they are now logged in and free to proceed
        closeSignInOverlay();
        notifyLogin();
      }
    });

    trackEvent('Click login with Twitter');
  },
  "click .email-signup" (d) {
    Session.set('signinStage', 'info');
    trackEvent('Click sign up with email');
  },
  "click .go-to-login" (e, t){
    Session.set('signinStage', 'login');
  },
  "click .back-to-info" (e, t){
    Session.set('signinStage', 'info');
  },
  "click .back-to-signup" (e, t){
    Session.set('signinStage', 'signup');
  },
  "click .back-to-login" (e, t){
    Session.set('signinStage', 'login');
  },
  "click .forgot-password" (e, t){
    Session.set('signinStage', 'forgot');
  }
});


Template.info_form.onCreated(function() {
  this.signupError = new ReactiveVar();
  this.emailError = new ReactiveVar();
  this.nameError = new ReactiveVar();
  this.usernameError = new ReactiveVar();
  this.emailComplete = new ReactiveVar();
  this.nameComplete = new ReactiveVar();
  this.usernameComplete = new ReactiveVar();
  this.submitting = new ReactiveVar();
});

Template.info_form.helpers({
  tempUsername () {
    if (Meteor.user()) {
      return Meteor.user().tempUsername;
    }
    return;
  },
  signupError () {
    return Template.instance().signupError.get();
  },
  emailError  () {
    return Template.instance().emailError.get();
  },
  nameError  () {
    return Template.instance().nameError.get();
  },
  usernameError  () {
    return Template.instance().usernameError.get();
  },
  emailComplete  () {
    return Template.instance().emailComplete.get();
  },
  nameComplete  () {
    return Template.instance().nameComplete.get();
  },
  usernameComplete  () {
    return Template.instance().usernameComplete.get();
  },
  submitting  () {
    Template.instance().submitting.get()
  },
  disableSignup  () {
    return Template.instance().submitting.get()
      || !Template.instance().emailComplete.get()
      || !Template.instance().nameComplete.get()
      || !Template.instance().usernameComplete.get()
      || Template.instance().emailError.get()
      || Template.instance().nameError.get()
      || Template.instance().usernameError.get()
  }
});

var checkEmailField =  function(e, t, suppressError) {
  var email = t.$('input.signup-email').val();
  email = trimInput(email);

  var result = checkValidEmail(email);
  if (!result.status) {
    if(!suppressError) {
      t.emailError.set(result.message)
    }
  } else {
    t.emailError.set(false)
    t.emailComplete.set(true);
  }
};

var checkNameField = function(e, t, suppressError) {
  var name = t.$('input.signup-name').val();
  name = trimInput(name);

  var result = checkValidName(name);
  if (!result.status) {
    if(!suppressError){
      t.nameError.set(result.message)
    }
  } else {
    t.nameError.set(false)
    t.nameComplete.set(true)
  }
};

var checkUsernameField = function(e, t, suppressError) {
  var username = t.$(".signup-username").val();
  username = trimInput(username);

  var result = checkValidUsername(username);
  if (!result.status) {
    if(!suppressError){
      t.usernameError.set(result.message)
    }
  } else {
    t.usernameError.set(false)
    t.usernameComplete.set(true)
  }
};

var checkPassword = function(e, t) {
  var p1 = t.$(".signup-password").val();

  var result = checkValidPassword(p1);
  if (!result.status) {
    t.passwordError.set(result.message);
  } else {
    t.passwordError.set(false);
    t.passwordComplete.set(true);
  }
};

var checkPasswordConfirmation = function(e, t) {
  var p1 = t.$(".signup-password").val();
  var p2 = t.$(".signup-password2").val();

  var result2 = checkValidPasswordConfirmation(p1, p2);
  if (!result2.status) {
    t.password2Error.set(result2.message);
  } else {
    t.password2Error.set(false);
    t.password2Complete.set(true);
  }
};

Template.info_form.onRendered(function(){
  this.$('input')[0].focus();

  // in case coming back
  checkEmailField(null, this, true);
  checkNameField(null, this, true);
  checkUsernameField(null, this, true);
});

Template.info_form.helpers({
  initialName (){
    if (newUserInfo.profile && newUserInfo.profile.name ){
      return newUserInfo.profile.name
    } else {
      var user = Meteor.user();
      if(user && user.profile && user.profile.name){
        return user.profile.name;
      }
    }
  },
  initialEmail (){
    if (newUserInfo.email){
      return newUserInfo.email
    }
  },
  initialUsername (){
    if (newUserInfo.username){
      return newUserInfo.username
    } else {
      var user = Meteor.user();
      if(user && user.tempUsername){
        return user.tempUsername;
      }
    }
  },

})
Template.info_form.events({
  'blur input.signup-email': checkEmailField,
  'keyup input.signup-email' (e,t) {
    if (enterPress(e) || t.emailError.get()) {
      Meteor.setTimeout(function() {
        checkEmailField(e, t);
      });
    }
  },
  'blur input.signup-name': checkNameField,
  'keyup input.signup-name' (e,t) {
    Meteor.setTimeout(function(){
      checkNameField(e, t);
    });
  },
  'blur input.signup-username': checkUsernameField,
  'keyup input.signup-username' (e,t) {
    if (enterPress(e) || t.usernameError.get()) {
      Meteor.setTimeout(function() {
        checkUsernameField(e, t);
      });
    }
  },
  'submit'  (e, t) {
    var key;
    e.preventDefault();

    if(t.submitting.get()){
      return
    } else {
      t.submitting.set(true)
    }

    if (t.emailError.get() || t.usernameError.get()) {
      t.submitting.set(false);
      return;
    } else {
      t.signupError.set(null);
    }

    var inputs = t.$('#info-form').serializeArray();
    var userInfo = {};
    _.each(inputs, function (input) {
      key = input['name'];
      value = input['value'];
      userInfo[key] = value;
    });

    if (Meteor.user()) { // if just finishing signup and already created a user via twitter
      Meteor.call('updateInitialTwitterUserInfo', userInfo, function (err) {
        t.submitting.set(false);
        if (err) {
          t.signupError.set(err.reason || err.error);
        } else {
          Session.set('signinStage', 'onboarding');
          notifyLogin();
          newUserInfo = {};
          trackEvent('New user signed up', {label: 'twitter'});
        }
      });
    } else { // if email user

      newUserInfo = {
        email: userInfo.email,
        username: userInfo.username,
        profile: {
          "name": userInfo.name
        }
      };

      Meteor.call('validateUserInfo', newUserInfo, function(err) {
        t.submitting.set(false);
        if (err) {
          if (err.error === 'username') {
            t.usernameError.set(err.reason || err.error);
          } else if (err.error === 'email') {
            t.emailError.set(err.reason || err.error);
          } else {
            t.signupError.set(err.reason || err.error);
          }

        } else {
          Session.set('signinStage', 'password');
        }
      });
    }
  }
});



Template.password_form.onCreated(function() {
  this.signupError = new ReactiveVar();
  this.passwordError = new ReactiveVar();
  this.password2Error = new ReactiveVar();
  this.passwordComplete = new ReactiveVar();
  this.password2Complete = new ReactiveVar();
  this.disableSignup = new ReactiveVar();
  this.submitting = new ReactiveVar();
});

Template.password_form.onRendered(function(){
  this.$('input')[0].focus();
});


Template.password_form.helpers({
  signupError () {
    return Template.instance().signupError.get();
  },
  passwordError  () {
    return Template.instance().passwordError.get();
  },
  password2Error  () {
    return Template.instance().password2Error.get();
  },
  passwordComplete  () {
    return Template.instance().passwordComplete.get();
  },
  password2Complete  () {
    return Template.instance().password2Complete.get();
  },
  submitting  () {
    return Template.instance().submitting.get();
  },
  disableSignup  () {
    return Template.instance().submitting.get()
      || !Template.instance().passwordComplete.get()
      || !Template.instance().password2Complete.get()
      || Template.instance().passwordError.get()
      || Template.instance().password2Error.get()
  }
});


Template.password_form.events({
  'blur input.signup-password': checkPassword,
  'keyup input.signup-password' (e,t) {
    if (enterPress(e) || t.passwordError.get()) {
      Meteor.setTimeout(function() {
        checkPassword(e, t);
      });
    }
  },
  'keyup input.signup-password2' (e,t) {
    Meteor.setTimeout(function() {
      checkPasswordConfirmation(e, t);
    });
  },
  'submit'  (e, t) {
    e.preventDefault();
    checkPassword(e, t);
    checkPasswordConfirmation(e, t);

    if(t.submitting.get()){
      return
    } else {
      t.submitting.set(true)
    }

    if (t.passwordError.get()|| t.password2Error.get()) {
      t.submitting.set(false);
      return;
    } else {
      t.signupError.set(null);
    }

    var inputs = t.$('#password-form').serializeArray();
    var userInfo = {};
    _.each(inputs, function (input) {
      var key = input['name'];
      value = input['value'];
      userInfo[key] = value;
    });

    newUserInfo.password = userInfo.password;

    Accounts.createUser(newUserInfo, function(err) {
      t.submitting.set(false);
      if (err) {
        t.signupError.set(err.reason || err.error);
      } else {
        Session.set('signinStage', 'onboarding');
        newUserInfo = {};
        notifyLogin();
        trackEvent('New user signed up', {label: 'email'});
      }
    });
  }
});


Template.onboarding_screen.events({
  'click a, click button' (){
    closeSignInOverlay();
  }
});

Template.login_form.onCreated(function() {
  this.loginError = new ReactiveVar(false);
  this.submitting = new ReactiveVar(false);
});

Template.login_form.onRendered(function(){
  this.$('input')[0].focus();
});


Template.login_form.helpers({
  loginError () {
    return Template.instance().loginError.get();
  }
});

Template.login_form.events({
  'keypress input' (e, template) {
    template.loginError.set(false);
  },
  'submit #login-form'  (e, template) {
    e.preventDefault();


    if(template.submitting.get()){
      return
    } else {
      template.submitting.set(true);
    }

    inputs = template.$('#login-form').serializeArray();
    user_info = {};
    _.each(inputs, function(input) {
        var key = input['name'];
        value = input['value'];
        user_info[key]=value;
      });
    Meteor.loginWithPassword(user_info.username.toLowerCase(), user_info.password, function(err){
      template.submitting.set(false);
      if (err) {
        var errorText;
        switch(err.reason){
          case 'User not found':
            errorText = "Hmmm... we can't find that username / email";
            break;
          case 'Incorrect password':
            errorText = "Incorrect password";
            break;
          case 'User has no password set':
            errorText = "Looks like you signed up with Twitter.\nClick below!";
            break;
          default:
            errorText = err.reason;
        }
        template.loginError.set(errorText);
      } else {
        notifyLogin();
        closeSignInOverlay();
      }
      return;
    })
  }
});
