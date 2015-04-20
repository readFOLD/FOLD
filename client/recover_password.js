isNotEmpty = function(value) {
    if (value && value !== ''){
        return true;
    }
    return false;
};

isEmail = function(value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    return false;
};

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
    var email = forgotPasswordForm.find('#recover-password-email').val().toLowerCase();

    if(!isEmail(email)) {
      t.message.set('Please enter a valid email address.');
      return false;
    }

    if(!isNotEmpty(email)) {
      t.message.set('Please fill in all required fields.');
      return false;
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