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




var ytScriptLoaded = false;

var ytApiReady = new ReactiveVar(false);

Template.watch.onCreated(function () {
  if(!ytScriptLoaded){
    $.getScript('https://www.youtube.com/iframe_api', function () {});
    ytScriptLoaded = true;
  }

  this.mainStreamId = Random.id(8);

  var that = this;

  window.onYouTubeIframeAPIReady = function() {
    ytApiReady.set(true);
  };

  this.autorun(function(){ // TODO confirm user is curator
    if(FlowRouter.subsReady() && that.data.onCuratePage()){
      if ((user = Meteor.user())) { // if there is a user
        //if (user && data && user._id !== data.authorId) { // if they don't own the story take them to story not found
        //  return this.render("story_not_found");
        //}
        var accessPriority = Meteor.user().accessPriority; // TODO update for Deepstream
        if (!accessPriority || accessPriority > window.createAccessLevel){
          //FlowRouter.withReplaceState(function(){
            FlowRouter.go('/')
          //})
          notifyInfo("Creating and editing streams is temporarily disabled, possibly because things blew up (in a good way). Sorry about that! We'll have everything back up as soon as we can. Until then, why not check out some of the other great content authors in the community have written?")
        }
      } else if (Meteor.loggingIn()) {
        return
      } else {
        Session.set('signingIn', true); // if there is no user, take them to the signin page
        //FlowRouter.withReplaceState(function(){  // TO-DO, after they sign in, they should get back to the curate page
          FlowRouter.go('/')
        //})
      }
    }
  });

  this.autorun(function(){
    Session.set("streamShortId", that.data.shortId());
  });

});

Template.watch.onRendered(function(){
  var that = this;


  this.autorun(function(){
    if(ytApiReady.get()){
      Meteor.setTimeout(function(){ // TODO this is a hack. Why does it need to wait???
        var youTubePlayer = new YT.Player(that.mainStreamId, {
          events: {
            'onReady': onMainPlayerReady,
            'onStateChange': onMainPlayerStateChange
          }
        });
        mainPlayer = youTubePlayer; // for now, just get all the functions. later do this function by function.
      }, 1000);
    }
  });

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
})


var titleMax = 90;
var descriptionMax = 270;

Template.watch.helpers({
  mainStreamId: function(){
    return Template.instance().mainStreamId;
  },
  onCuratePage: function(){
    return Template.instance().data.onCuratePage ? Template.instance().data.onCuratePage() : null;
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
  },
  showStreamSearch: function(){
    return Template.instance().data.onCuratePage && (this.creationStep === 'find_stream' || Session.get('newHorizontalDataType') === 'stream');
  },
  showContextSearch: function(){
    return Template.instance().data.onCuratePage && (this.creationStep === 'add_cards' || Session.get('newHorizontalDataType') !== 'stream');
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
});

Template.watch.events({
  'click .set-main-stream': function(e, t){
    Meteor.call('setActiveStream', t.data.shortId(), this._id ,basicErrorHandler);
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
  'click .find-stream .text': function(e, t){
    Meteor.call('goToFindStreamStep', t.data.shortId(), basicErrorHandler);
  },
  'click .add-cards .text': function(e, t){
    Meteor.call('goToAddCardsStep', t.data.shortId(), basicErrorHandler);
  },
  'click .go-on-air .text': function(e, t){
    Meteor.call('goToPublishStreamStep', t.data.shortId(), basicErrorHandler);
  },
  'click .find-stream button': function(e, t){
    Meteor.call('skipFindStreamStep', t.data.shortId(), basicErrorHandler);
  },
  'click .add-cards button': function(e, t){
    Meteor.call('skipAddCardsStep', t.data.shortId(), basicErrorHandler);
  },
  'click .go-on-air button': function(e, t){
    Meteor.call('publishStream', t.data.shortId(), function(err){
      if(err){
        basicErrorHandler(err)
      } else {
        notifySuccess("Congratulations! Your Deep Stream is now on air!")
      }
    });
  },
  'click .publish': function(e, t){
    Meteor.call('publishStream', t.data.shortId(), function(err){
      if(err){
        basicErrorHandler(err)
      } else {
        notifySuccess("Congratulations! Your Deep Stream is now on air!")
      }
    });
  },
  'click .unpublish': function(e, t){
    Meteor.call('unpublishStream', t.data.shortId(), basicErrorHandler);
  },
  'click .show-stream-search': function(e, t){
    console.log(this)
    if(this.creationStep && this.creationStep !== 'go_on_air'){
      Meteor.call('goToFindStreamStep', t.data.shortId(), basicErrorHandler);
    } else {
      Session.set('searchClass', 'stream')
    }
  }
});
