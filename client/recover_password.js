Template.recover_password_form.onCreated(function() {
  this.message = new ReactiveVar('');
})

Template.recover_password_form.helpers({
  message: function() {
    return Template.instance().message.get();
  }
})

Template.recover_password_form.events({
  'submit #recover-password-form': function(e, t) {
    e.preventDefault();

    var forgotPasswordForm = $(e.currentTarget);
    var email = t.$('#recover-password-email').val().toLowerCase();

    if(_.isEmpty(email)) {
      t.message.set('Please fill in all required fields.');
      return;
    }

    if(!SimpleSchema.RegEx.Email.test(email)) {
      t.message.set('Please enter a valid email address.');
      return;
    }

    Accounts.forgotPassword({email: email}, function(err) {
      if (err) {
        if (err.message === 'User not found [403]') {
          t.message.set('This email does not exist.');
        } else {
          t.message.set('We are sorry but something went wrong.');
        }
      } else {
        t.message.set('Email sent, expect it within a few minutes.');
      }
    });
  },
});