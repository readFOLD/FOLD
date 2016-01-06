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
      theme:'colorful',
      delay: 8000
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

window.notifyBrowser = function(){
  $.amaran({
      content: {
        message: "Hi! We're so glad you're writing a story on FOLD. Feel free to try out our editor in any browser and give us feedback, but for the best experience right now, we recommend using Chrome!",
        color: 'white',
        bgcolor: '#585094' // panel-color
      },
      sticky: true,
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

window.notifyImageSizeError = function(){
  notifyError("Wow, that's a really big file! Can you make it any smaller? We support files up to " + CLOUDINARY_FILE_SIZE/1000000 + ' MB');
};
