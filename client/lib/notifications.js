window.notifyRemix = function(message){
  $.amaran({
      content: {
        message: message,
        color: 'white',
        bgcolor: '#EA1D75' // remix-color
      },
      'position' :'top right',
      theme:'colorful'
    }
  );
};

window.notifyFeature = window.notifyRemix;

window.notifySuccess = function(message){
  $.amaran({
      content: {
        message: message,
        color: 'white',
        bgcolor: '#1DB259' // action-color
      },
      'position' :'top right',
      theme:'colorful'
    }
  );
};

window.notifyLogin = function(){
  var user = Meteor.user();
  var name = user.profile.name ? user.profile.name.split(' ')[0] : user.profile.displayUsername;
  notifySuccess('Welcome ' + name + '!');
};


window.notifyError = function(message){
  $.amaran({
      content: {
        message: message,
        color: 'white',
        bgcolor: '#ff1b0c' // danger-color
      },
      'position' :'top right',
      theme:'colorful'
    }
  );
};

window.notifyInfo = function(message){
  $.amaran({
      content: {
        message: message,
        color: 'white',
        bgcolor: '#585094' // panel-color
      },
      'position' :'top right',
      theme:'colorful'
    }
  );
};

window.notifyDeploy = function(message, sticky){
  $.amaran({
      content: {
        message: message,
        color: 'white',
        bgcolor: '#585094' // panel-color
      },
      'position' :'top right',
      theme:'colorful',
      sticky: sticky,
      clearAll: true
    }
  );
  $('.amaran').addClass('migration-notification');
};
