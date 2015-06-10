//Template.watch.onRendered(function(){
//  console.log('watch is rendered')
//  var tag = document.createElement('script');
//
//  tag.src = "https://www.youtube.com/iframe_api";
//  var firstScriptTag = document.getElementsByTagName('script')[0];
//  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//  console.log(firstScriptTag)
//
//// 3. This function creates an <iframe> (and YouTube player)
////    after the API code downloads.
//  var player;
//  window.onYouTubeIframeAPIReady = function() {
//    console.log('api ready')
//    player = new YT.Player('player-div', {
//      height: '390',
//      width: '640',
//      videoId: 'M7lc1UVf-VE',
//      events: {
//        'onReady': onPlayerReady,
//        'onStateChange': onPlayerStateChange
//      }
//    });
//    banana = player;
//  }
//
//  YT.load()
//
//// 4. The API will call this function when the video player is ready.
//  onPlayerReady = function(event) {
//    console.log(3333);
//    event.target.playVideo();
//  }
//
//// 5. The API calls this function when the player's state changes.
////    The function indicates that when playing a video (state=1),
////    the player should play for six seconds and then stop.
//  var done = false;
//  onPlayerStateChange = function(event) {
//    if (event.data == YT.PlayerState.PLAYING && !done) {
//      setTimeout(stopVideo, 6000);
//      done = true;
//    }
//  }
//})







Template.watch.onCreated(function () {
  $.getScript('https://www.youtube.com/iframe_api', function () {}); // TODO, do this in a way that won't do it lots of times

  var that = this;

  window.onYouTubeIframeAPIReady = function() {
    console.log('api ready!!!!!')
    var youTubePlayer = new YT.Player('main-stream', {
      events: {
        'onReady': onMainPlayerReady,
        'onStateChange': onMainPlayerStateChange
      }
    });

    mainPlayer = youTubePlayer; // for now, just get all the functions. later do this function by function.
  };

  onMainPlayerReady = function(event){
    that.autorun(function(){
      if(Session.get('mainPlayerMuted')){
        mainPlayer.mute();
      } else {
        mainPlayer.unMute();
      }
    });

    event.target.playVideo();
  };


  onMainPlayerStateChange = function(){
    console.log('PlayerStateChange')
  }

});




Template.watch.helpers({
  streamUrl: function(){
    if (FlowRouter.subsReady()){
      return Deepstreams.findOne().activeStream().url()
    }
  }
});

Template.watch.events({
  'click .walrus': function(){
    Deepstreams.update({_id: 'someid'}, {$set: {activeStreamId: 'walrus_stream123'}});
  },
  'click .ant': function(){
    Deepstreams.update({_id: 'someid'}, {$set: {activeStreamId: 'ant_stream654'}});
  },
  'click .mute': function(){
    Session.set('mainPlayerMuted', true);
  },
  'click .unmute': function(){
    Session.set('mainPlayerMuted', false);
  }
});
