Template.login_form.helpers({
  loginFailed: function() {
    return Template.instance().loginFailed.get();
  } 
})

Template.login_form.events({
  'submit #login-form' : function(e, target) {
    e.preventDefault();
    var username = target.find('#login-username').value
        password = target.find('#login-password').value;
    
    Meteor.loginWithPassword(username, password, function(err){
      if (err) {
        return Template.instance().loginFailed.set(true);
      } else {
        Router.go("/")
      }
    })
  }
})

Template.login_form.created = function() {
  this.loginFailed = new ReactiveVar();
}