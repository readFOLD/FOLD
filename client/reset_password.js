Template.reset_password_form.onCreated(function() {
  this.message = new ReactiveVar('');
})

Template.reset_password_form.helpers({
  message () {
    return Template.instance().message.get();
  },
  resetPassword (){
    return Session.get('resetPasswordToken');
  }
})

Template.reset_password_form.events({
  'submit #reset-password-form' (e, t) {
    e.preventDefault();
    
    var password = t.$('#reset-password-password').val();
    var passwordConfirm = t.$('#reset-password-password-confirm').val();

    var result = checkValidPassword(password);
    if (!result.status) {
      t.message.set(result.message);
      return
    }

    var result2 = checkValidPasswordConfirmation(password, passwordConfirm);
    if (!result2.status) {
      t.message.set(result2.message);
      return
    }

    Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(err) {
      if (err) {
        t.message.set('We are sorry but something went wrong.');
      } else {
        t.message.set('Your password has been successfully changed. Welcome back!');
        Meteor.setTimeout( function(){
            FlowRouter.go('home')
        }, 1500);
      }
    });
  }
});
