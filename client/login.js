Template.login_form.onCreated(function() {
  this.loginError = new ReactiveVar(false);
});

Template.login_form.helpers({
  loginError: function() {
    return Template.instance().loginError.get();
  } 
});

Template.login_form.events({
  'keypress input': function(e, template) {
    template.loginError.set(false);
  },
  'submit #login-form' : function(e, template) {
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
        Router.go("/");
        notifyLogin();
      }
      return;
    })
  }
});
