Template.login_form.onCreated(function() {
  this.loginError = new ReactiveVar(false);
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
    
    inputs = $('#login-form').serializeArray();
    user_info = {};
    _.each(inputs, function(input) {
        key = input['name'];
        value = input['value'];
        user_info[key]=value;
      });
    Meteor.loginWithPassword(user_info.username.toLowerCase(), user_info.password, function(err){
      if (err) {
        template.loginError.set(err.reason); 
      } else {
        returnFromSignIn();
        notifyLogin();
      }
      return;
    })
  }
});
