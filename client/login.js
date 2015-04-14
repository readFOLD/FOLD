Template.login_form.onCreated(function() {
  this.loginFailed = new ReactiveVar(false);
});

Template.login_form.helpers({
  loginFailed: function() {
    return Template.instance().loginFailed.get();
  } 
});


Template.login_form.events({
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
        template.loginFailed.set(true); 
      } else {
        Router.go("/")
      }
      return;
    })
  }
});

