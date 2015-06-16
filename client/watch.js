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


var titleMax = 90;
var descriptionMax = 270;

Template.watch.helpers({
  onCuratePage: function(){
    return Template.instance().data.onCuratePage();
  },
  thisDeepstream: function() {
    if (FlowRouter.subsReady()) {
      return Deepstreams.findOne({shortId: Template.instance().data.shortId()});
    }
  },
  streamUrl: function(){
    var activeStream = this.activeStream()
    if(activeStream){
      return this.activeStream().url()
    }
  },
  showTitleDescriptionEditOverlay: function(){
    return this.creationStep == 'title_description';
  },
  showTutorial: function(){
    return _.contains(['find_stream', 'add_cards', 'go_on_air'], this.creationStep)
  },
  onFindStreamStep: function(){
    return this.creationStep == 'find_stream';
  },
  onAddCardsStep: function(){
    return this.creationStep == 'add_cards';
  },
  onGoOnAirStep: function(){
    return this.creationStep == 'go_on_air';
  },
  titleLength: function(){
    return  Template.instance().titleLength.get();
  },
  titleMax: function(){
    return titleMax;
  },
  descriptionLength: function(){
    return Template.instance().descriptionLength.get();
  },
  descriptionMax: function(){
    return descriptionMax;
  }
});

var basicErrorHandler = function(err){
  if(err){
    notifyError(err);
    throw(err);
  }
};


Template.watch.onCreated(function(){
  this.titleLength = new ReactiveVar(0);
  this.descriptionLength = new ReactiveVar(0);
})

Template.watch.events({
  'click .set-main-stream': function(){
    Deepstreams.update({_id: 'someid'}, {$set: {activeStreamId: this._id}});
  },
  'click .mute': function(){
    Session.set('mainPlayerMuted', true);
  },
  'click .unmute': function(){
    Session.set('mainPlayerMuted', false);
  },
  'click .preview': function(){
    Session.set('curateMode', false);
  },
  'click .return-to-curate': function(){
    Session.set('curateMode', true);
  },
  'keypress .set-title': function(e, t){
    if (e.keyCode === 13){
      e.preventDefault();
      $('.set-description').focus();
    }
  },
  'keypress .set-description': function(e, t){
    if (e.keyCode === 13){
      e.preventDefault();
      $('#set-title-description').submit();
    }
  },
  'keyup .set-title': function(e, t){
    t.titleLength.set($(e.currentTarget).val().length);
  },
  'keyup .set-description': function(e, t){
    t.descriptionLength.set($(e.currentTarget).val().length);
  },
  'submit #set-title-description': function(e, t){
    e.preventDefault();
    var title = t.$('.set-title').val();
    var description = t.$('.set-description').val();
    Meteor.call('setStreamTitleDescription', t.data.shortId(), title, description, basicErrorHandler);
  },
  'click .find-stream button': function(e, t){
    Meteor.call('skipFindStreamStep', t.data.shortId(), basicErrorHandler);
  },
  'click .add-cards button': function(e, t){
    Meteor.call('skipAddCardsStep', t.data.shortId(), basicErrorHandler);
  },
  'click .go-on-air button': function(e, t){
    Meteor.call('publishStream', t.data.shortId(), basicErrorHandler);
  }
});
