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
    
    var inputs = $(e.currentTarget).serializeArray();
    var userInfo = {};
    _.each(inputs, function(input) {
      key = input['name'];
      value = input['value'];
      userInfo[key] = value;
    });

    if (!isNotEmpty(userInfo.password)) {
      t.message.set('Please fill in all required fields.');
      return false;
    }

    if (!isValidPassword(userInfo.password)) {
      t.message.set('Please enter a valid password.');
      return false;
    }

    if (userInfo.password !== userInfo.passwordConfirm) {
      t.message.set('Your two passwords are not equivalent.');
      return false;
    }
 
    Accounts.resetPassword(Session.get('resetPasswordToken'), userInfo.password, function(err) {
      if (err) {
        t.message.set('We are sorry but something went wrong.');
      } else {
        t.message.set('Your password has been successfully changed. Welcome back!');
      }
    });
    return false;
  }
});