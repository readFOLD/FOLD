sendWelcomeEmail = function(user){
  var email = user.emails[0].address;

  Mandrill.messages.sendTemplate({
    template_name: 'welcome-e-mail',
    template_content: [
    ],
    message: {
      to: [
        {email: email}
      ]
    }
  });
};
