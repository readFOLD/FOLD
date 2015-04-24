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
