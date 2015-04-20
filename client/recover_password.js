Template.recover_password_form.events({
  'submit #recover-password-form': function(e, t) {
    e.preventDefault();
 
    var forgotPasswordForm = $(e.currentTarget);
    var email = forgotPasswordForm.find('#recover-password-email').val().toLowerCase();

    if (isNotEmpty(email) && isEmail(email)) {
 
      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            console.log('This email does not exist.');
          } else {
            console.log('We are sorry but something went wrong.');
          }
        } else {
          console.log('Email Sent. Check your mailbox.');
        }
      });
 
    }
    return false;
  },
});