Template.reset_password_form.onCreated(function() {
  this.message = new ReactiveVar('');
})

Template.reset_password_form.helpers({
  message: function() {
    return Template.instance().message.get();
  },
  resetPassword: function(){
    return Session.get('resetPasswordToken');
  }
})

Template.reset_password_form.events({
  'submit #reset-password-form': function(e, t) {
    e.preventDefault();
    
    var password = t.$('#reset-password-password').val();
    var passwordConfirm = t.$('#reset-password-password-confirm').val();

    if (_.isEmpty(password)) {
      t.message.set('Please fill in all required fields.');
      return;
    }

    if (!isValidPassword(password)) {
      t.message.set('Please enter a valid password.');
      return;
    }

    if (password !== passwordConfirm) {
      t.message.set('Your two passwords are not equivalent.');
      return;
    }
 
    Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(err) {
      if (err) {
        t.message.set('We are sorry but something went wrong.');
      } else {
        t.message.set('Your password has been successfully changed. Welcome back!');
        Meteor.setTimeout( function(){
            Router.go('home')
        }, 1500);
      }
    });
  }
});
