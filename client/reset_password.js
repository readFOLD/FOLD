// if (Accounts._resetPasswordToken) {
//   Session.set('resetPassword', Accounts._resetPasswordToken);
// }

Template.reset_password_form.helpers({
  resetPassword: function(){
    console.log(Accounts, Accounts._resetPasswordToken);
    return Session.get('resetPasswordToken');
  }
});

Template.reset_password_form.events({
  'submit #reset-password-form': function(e, t) {
    e.preventDefault();
    
    var inputs = $(e.currentTarget).serializeArray();
    var userInfo = {};
    _.each(inputs, function(input) {
      key = input['name'];
      value = input['value'];
      userInfo[key] = value;
    });

    // console.log(password, passwordConfirm);
 
    if (isNotEmpty(userInfo.password) && areValidPasswords(userInfo.password, userInfo.passwordConfirm)) {
      Accounts.resetPassword(Session.get('resetPasswordToken'), userInfo.password, function(err) {
        console.log(err);
        if (err) {
          console.log('We are sorry but something went wrong.');
        } else {
          console.log('Your password has been changed. Welcome back!');
          Session.set('resetPasswordToken', null);
          Router.go("/login")
        }
      });
    }
    return false;
  }
});