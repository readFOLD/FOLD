var ytScriptLoaded = false;

var ytApiReady = new ReactiveVar(false);

window.mainPlayer = {
  play(){
    switch(this.activeStreamSource){
      case 'youtube':
        this._youTubePlayer.playVideo();
        break;
      case 'ustream':
        this._ustreamPlayer.callMethod('play');
        break;
      case 'bambuser':
        this._bambuserPlayer.playBroadcast();
        break;
      case 'twitch':
        this._twitchPlayer.playVideo();
        break;
      default:
        throw new Meteor.Error('main player has no active stream source')
    }
  },
  pause(){
    switch(this.activeStreamSource){
      case 'youtube':
        this._youTubePlayer.pauseVideo();
        break;
      case 'ustream':
        this._ustreamPlayer.callMethod('pause');
        break;
      case 'bambuser':
        this._bambuserPlayer.pauseBroadcast();
        break;
      case 'twitch':
        this._twitchPlayer.pauseVideo();
        break;
      default:
        throw new Meteor.Error('main player has no active stream source')
    }
  },
  stop(){
    switch(this.activeStreamSource){
      case 'youtube':
        this._youTubePlayer.stopVideo();
        break;
      case 'ustream':
        this._ustreamPlayer.callMethod('stop');
        break;
      case 'bambuser':
        this._bambuserPlayer.pauseBroadcast();
        break;
      case 'twitch':
        this._twitchPlayer.pauseVideo();
        break;
      default:
        throw new Meteor.Error('main player has no active stream source')
    }
  },
  mute(){
    switch(this.activeStreamSource){
      case 'youtube':
        this._youTubePlayer.mute();
        break;
      case 'ustream':
        this._ustreamPlayer.callMethod('volume', 0);
        break;
      case 'bambuser':
        this._bambuserPlayer.mute();
        break;
      case 'twitch':
        this._twitchPlayer.mute();
        break;
      default:
        throw new Meteor.Error('main player has no active stream source')
    }
  },
  unmute(){
    switch(this.activeStreamSource){
      case 'youtube':
        this._youTubePlayer.unMute();
        break;
      case 'ustream':
        this._ustreamPlayer.callMethod('volume', 100); // TO-DO return volume to wherever they were before mute
        break;
      case 'bambuser':
        this._bambuserPlayer.unmute();
        break;
      case 'twitch':
        this._twitchPlayer.unmute();
        break;
      default:
        throw new Meteor.Error('main player has no active stream source')
    }
  }
};


Template.watch_page.onCreated(function () {
  if(!ytScriptLoaded){
    $.getScript('https://www.youtube.com/iframe_api', function () {});
    ytScriptLoaded = true;
  }

  this.mainStreamIFrameId = Random.id(8);
  this.mainStreamFlashPlayerId = Random.id(8);



  var that = this;

  this.settingsMenuOpen = new ReactiveVar();


  window.onYouTubeIframeAPIReady = function() {
    ytApiReady.set(true);
  };

  window.bambuserPlayerReady = function(){
    console.log('Bambuser player ready');
    mainPlayer._bambuserPlayer = getFlashMovie(that.mainStreamFlashPlayerId);
  };


  window.bambuserCuratorWebcamPlayerReady = function(){
    console.log('Bambuser curator webcam player ready');
    $('.curator-webcam-stream-container').addClass('ready'); // TODO, do this correctly
  };

  window.twitchPlayerEventCallback = function(events){
    if(_.findWhere(events, {event: 'playerInit'})){
      console.log('Twitch player ready');
      mainPlayer._twitchPlayer = getFlashMovie(that.mainStreamFlashPlayerId);
    }
  };


  // confirm stream exists confirm user is curator if on curate page. forward curators to curate if they are on watch page
  this.autorun(function(){
    if(FlowRouter.subsReady()){
      var stream = Deepstreams.findOne({shortId: that.data.shortId()}, {reactive: false});
      var user = Meteor.user();

      if(!stream){
        return FlowLayout.render("stream_not_found");
      }

      if (that.data.onCuratePage()){
        if ((user = Meteor.user())) { // if there is a user
          if (!_.contains(stream.curatorIds, user._id)) { // if they don't own the stream take them to stream not found
            return FlowLayout.render("stream_not_found");
          }
          var accessPriority = Meteor.user().accessPriority;
          if (!accessPriority || accessPriority > window.createAccessLevel){
            FlowRouter.withReplaceState(function(){
              FlowRouter.go(stream.watchPath());
            });
            notifyInfo("Creating and editing streams is temporarily disabled, possibly because things blew up (in a good way). Sorry about that! We'll have everything back up as soon as we can. Until then, why not check out some of the other great content authors in the community have written?")
          }
        } else if (Meteor.loggingIn()) {
          return
        } else {
          Session.set('signingIn', true); // if there is no user, take them to the signin page
          Session.set('signingInFrom', setSigningInFrom());

          FlowRouter.withReplaceState(function(){
            FlowRouter.go(stream.watchPath());
          });
        }
      } else if (user && _.contains(stream.curatorIds, user._id)){
        FlowRouter.withReplaceState(function(){
          FlowRouter.go(stream.curatePath());
        });
      }

    }
  });

  this.autorun(function(){
    Session.set("streamShortId", that.data.shortId());
  });

  // march through creation steps, or setup most recent context type to display when arrive on page if past curation
  this.autorun(function(){
    if(FlowRouter.subsReady()){
      var deepstream = Deepstreams.findOne({shortId: that.data.shortId()}, {reactive: false});
      var reactiveDeepstream = Deepstreams.findOne({shortId: that.data.shortId()}, {fields: {creationStep: 1}});

      if(that.data.onCuratePage()){
        if (_.contains(['find_stream'], reactiveDeepstream.creationStep)){
          Session.set("mediaDataType", 'stream');
          return
        } else if (reactiveDeepstream.creationStep === 'add_cards') {
          Session.set("mediaDataType", 'image');
          return
        }
      }
    }
  });


  this.activeStream = new ReactiveVar();
  this.userControlledActiveStreamId = new ReactiveVar();

  // switch between streams
  this.autorun(function(){ // TO-DO Performance, don't rerun on every stream switch, only get fields needed
    if(FlowRouter.subsReady()) {
      var userControlledActiveStreamId = that.userControlledActiveStreamId.get();
      var deepstream = Deepstreams.findOne({shortId: that.data.shortId()});

      if(!Session.get('curateMode') && userControlledActiveStreamId && deepstream.userStreamSwitchAllowed()){
        that.activeStream.set(deepstream.getStream(userControlledActiveStreamId));
      } else{
        that.activeStream.set(deepstream.activeStream());
      }
    }
  });

});

Template.watch_page.onRendered(function(){
  var that = this;

  this.mainPlayerYTApiActivated = false;
  this.mainPlayerUSApiActivated = false;

  // activate jsAPIs for main stream
  this.autorun(function(){
    if(ytApiReady.get() && FlowRouter.subsReady()){
      var activeStream = that.activeStream.get();
      if(!activeStream){
        return
      }
      switch(activeStream.source){
        case 'youtube':
          if ( !this.mainPlayerYTApiActivated ){
            console.log('activate the yt api!!')
            this.mainPlayerYTApiActivated = true;
            Meteor.setTimeout(function(){ // TODO this is a hack. Why does it need to wait?
              var youTubePlayer = new YT.Player(that.mainStreamIFrameId, {
                events: {
                  'onReady': onMainPlayerReady,
                  'onStateChange': onMainPlayerStateChange
                }
              });
              mainPlayer._youTubePlayer = youTubePlayer;
            }, 1000);
          }
          mainPlayer.activeStreamSource = 'youtube';
          break;
        case 'ustream':
          if ( !this.mainPlayerUSApiActivated ){
            console.log('activate the ustream api!!')
            this.mainPlayerUSApiActivated = true;
            Meteor.setTimeout(function(){ // TODO this is a hack. Why does it need to wait?
              var ustreamPlayer = UstreamEmbed(that.mainStreamIFrameId);
              mainPlayer._ustreamPlayer = ustreamPlayer;
            }, 1000);
          }
          Meteor.setTimeout(onMainPlayerReady, 4000); // TODO, this is a hack. Is there any way to know that the player is ready?
          mainPlayer.activeStreamSource = 'ustream';
          break;
        case 'bambuser':
          mainPlayer.activeStreamSource = 'bambuser';
        case 'twitch':
          mainPlayer.activeStreamSource = 'twitch';
      }

    }
  });

  // focus on title when title/description overlay appears
  this.autorun(function(){
    if(FlowRouter.subsReady()) {
      var deepstream = Deepstreams.findOne({shortId: that.data.shortId()}, {fields: {creationStep: 1}});
      if (deepstream.creationStep === 'title_description') {
        Meteor.setTimeout(function() { // TODO this is a hack.
          that.$('input[name=title]')[0].focus();
        }, 100);
      }
    }
  });

  this.autorun(function(){
    let context;
    if(context = getCurrentContext()){
      Session.set('activeContextId', context._id);
    }
  });

  onMainPlayerReady = function(event){
    //mainPlayer.play(); // if streamUrl uses autoplayUrl, this is effectively a fallback
  };


  onMainPlayerStateChange = function(event){
    console.log('PlayerStateChange')
    console.log(event)
  }
});


var titleMax = 60;
var descriptionMax = 270;


Template.watch_page.helpers({
  activeStream (){
    return Template.instance().activeStream.get();
  },
  active (){ // inside #each streams
    var activeStream = Template.instance().activeStream.get();
    if (activeStream){
      return this._id === activeStream._id;
    }
  },
  allowStreamPreview (){
    return true;
    //return Session.get('curateMode') && Deepstreams.findOne({shortId: Template.instance().data.shortId()}, {fields: {'directorMode': 1}}).directorMode
  },
  mainStreamIFrameId (){
    return Template.instance().mainStreamIFrameId;
  },
  mainStreamFlashPlayerId (){
    return Template.instance().mainStreamFlashPlayerId;
  },
  mainStreamInIFrame (){
    return _.contains(['ustream', 'youtube'], Template.instance().activeStream.get().source);
  },
  mainStreamInFlashPlayer (){
    return _.contains(['bambuser', 'twitch'], Template.instance().activeStream.get().source);
  },
  onCuratePage (){
    return Template.instance().data.onCuratePage ? Template.instance().data.onCuratePage() : null;
  },
  thisDeepstream () {
    if (FlowRouter.subsReady()) {
      return Deepstreams.findOne({shortId: Template.instance().data.shortId()});
    }
  },
  streamUrl (){
    var activeStream = Template.instance().activeStream.get();
    if(activeStream){
      return activeStream.autoplayUrl();
    }
  },
  mainStreamFlashVars (){
    var activeStream = Template.instance().activeStream.get();
    var addlParams;

    switch(activeStream.source){
      case 'bambuser':
        addlParams='&callback=bambuserPlayerReady';
        break;
      case 'twitch':
        addlParams='&eventsCallback=twitchPlayerEventCallback';
        break;
    }
    if(activeStream){
      return activeStream.flashVars() + addlParams;
    }
  },
  curatorWebcamFlashVars (){

    switch(this.source){
      case 'bambuser':
        addlParams='&callback=bambuserCuratorWebcamPlayerReady';
        break;
      //case 'twitch':
      //  addlParams='&eventsCallback=twitchPlayerEventCallback';
      //  break;
    }
    return this.flashVars() + addlParams;
  },
  bambuserPlayer (){
    return Template.instance().activeStream.get().source === 'bambuser'
  },
  twitchPlayer (){
    return Template.instance().activeStream.get().source === 'twitch'
  },
  showTitleDescriptionEditOverlay (){
    return this.creationStep == 'title_description';
  },
  showTutorial (){
    return _.contains(['find_stream', 'add_cards', 'go_on_air'], this.creationStep)
  },
  showRightSection (){
    return !soloOverlayContextModeActive() && (Session.get("curateMode") || !Session.get('reducedView'));
  },
  expandMainSection (){
    return !Session.get("curateMode") && Session.get('reducedView');
  },
  showWebcamSetup (){
    return Session.get("curateMode") && Session.get('mediaDataType') === 'webcam'; // always setup on webcam
  },
  showChat (){
    return Session.get('showChat', true); // TODO this is probably not what we want
  },
  showContextSearch (){
    return Session.get('mediaDataType') && Session.get("curateMode") && Session.get('mediaDataType') !=='webcam';
  },
  showPreviewEditButton (){
    return this.onAir || this.creationStep === 'go_on_air';
  },
  soloOverlayContextMode (){
    return soloOverlayContextModeActive();
  },
  PiP (){
    return soloOverlayContextModeActive();
  },
  streamTitleElement (){
    if (Session.get('curateMode')) {
      // this is contenteditable in curate mode
      return '<div class="stream-title notranslate" placeholder="Title" contenteditable="true" dir="auto">' + _.escape(this.title) + '</div>';
    } else {
      return '<div class="stream-title">' + _.escape(this.title) + '</div>';
    }
  },
  streamDescriptionElement (){
    if (Session.get('curateMode')) {
      // this is contenteditable in curate mode
      return '<div class="stream-description notranslate" placeholder="Enter a description" contenteditable="true" dir="auto">' + _.escape(this.description) + '</div>';
    } else {
      return '<div class="stream-description">' + _.escape(this.description) + '</div>';
    }
  },
  showStreamSwitcher (){
    return Session.get('curateMode') || this.userStreamSwitchAllowed();
  },
  settingsMenuOpen (){
    return Template.instance().settingsMenuOpen.get();
  },
  livestreams (){
    return _.where(this.streams, { live: true });
  },
  deadstreams (){
    return _.where(this.streams, { live: false });
  }
});

var basicErrorHandler = function(err){
  if(err){
    notifyError(err);
    throw(err);
  }
};

var saveStreamTitle = function(template){
  streamTitle = $.trim(template.$('div.stream-title').text());
  Session.set('saveState', 'saving');
  return Meteor.call('updateStreamTitle', template.data.shortId(), streamTitle, basicErrorHandler)
};

Template.watch_page.events({
  'click .set-main-stream' (e, t){
    if(Session.get('curateMode')){
      Meteor.call('setActiveStream', t.data.shortId(), this._id ,basicErrorHandler);
    } else {
      t.userControlledActiveStreamId.set(this._id);
    }
  },
  'click .delete-stream' (e, t){
    var streamElement = t.$('[data-stream-id=' + this._id + ']');
    streamElement.addClass('to-delete');
    if(confirm('Are you sure you want to delete this stream?'))
    {
      streamElement.fadeOut(500, () => {
        Meteor.call('removeStreamFromStream', Session.get("streamShortId"), this._id, basicErrorHandler);
      });
    } else {
      streamElement.removeClass('to-delete');
    }
  },
  'click .preview' (e,t){
    t.userControlledActiveStreamId.set(null); // so that stream selection doesn't switch
    Session.set('curateMode', false);
  },
  'click .return-to-curate' (){
    Session.set('curateMode', true);
  },
  'click .publish' (e, t){
    if (this.creationStep === 'go_on_air') {
      if(!this.streams.length){
        notifyError('Please add a stream before you publish your deepstream');
        Meteor.call('goToFindStreamStep', t.data.shortId(), basicErrorHandler);
      } else {
        Meteor.call('proceedFromGoOnAirStep', t.data.shortId(), basicErrorHandler);
      }
    } else if (!this.creationStep) {
      Meteor.call('publishStream', t.data.shortId(), function(err){
        if(err){
          basicErrorHandler(err);
        } else {
          notifySuccess("Congratulations! Your Deep Stream is now on air!");
        }
      });
    } // TODO handle if in the middle of creation (or just disable button or something)
  },
  'click .unpublish' (e, t){
    Meteor.call('unpublishStream', t.data.shortId(), basicErrorHandler);
  },
  'click .show-stream-search' (e, t){
    if(this.creationStep && this.creationStep !== 'go_on_air'){
      Meteor.call('goToFindStreamStep', t.data.shortId(), basicErrorHandler);
    } else {
      Session.set('mediaDataType', 'stream');
    }
  },
  'blur .stream-title[contenteditable]' (e,template) {
    saveStreamTitle(template);
  },
  'keypress .stream-title[contenteditable]' (e,template) {
    if (e.keyCode === 13){ // return
      e.preventDefault();
      saveStreamTitle(template);
    }
  },
  'paste [contenteditable]': window.plainTextPaste,
  'drop [contenteditable]' (e){
    e.preventDefault();
    return false;
  },
  'blur .stream-description[contenteditable]' (e,template) {
    streamDescription = $.trim(template.$('div.stream-description').text());
    Session.set('saveState', 'saving');
    return Meteor.call('updateStreamDescription', template.data.shortId(), streamDescription, basicErrorHandler);
  },
  'click .director-mode-off' (e,t){
    return Meteor.call('directorModeOff', t.data.shortId(), basicErrorHandler)
  },
  'click .director-mode-on' (e,t){
    return Meteor.call('directorModeOn', t.data.shortId(), basicErrorHandler)
  },
  'mouseenter .settings-button-and-menu' (e, template){
    template.settingsMenuOpen.set(true);
  },
  'mouseleave .settings-menu-container' (e, template){
    template.settingsMenuOpen.set(false);
  },
  'click .microphone' (e,t){
    notifyFeature('Live audio broadcast: coming soon!');
  },
  'click .webcam' (e,t){
    Session.set('mediaDataType', 'webcam');
  },
  'click .email-share-button' (e,t){
    notifyFeature('Success!! Email share: coming soon!');
  },
  'click .twitter-share-button' (e,t){
    notifyFeature('Success!! Twitter share: coming soon!');
  },
  'click .facebook-share-button' (e,t){
    notifyFeature('Success!! Facebook share: coming soon!');
  },
  'click .favorite-button' (e,t){
    notifyFeature('Success!! Favoriting streams: coming soon!');
  },
  'click .PiP-overlay' (e,t){
    clearCurrentContext();
  },
  'click .context-mini-preview' (e,t){
    clearCurrentContext();
    Meteor.setTimeout( () =>{
      var offset = 130;
      var contextToScrollTo = $('.context-section[data-context-id=' + this._id + ']');
      var container = $('.context-area');
      container.animate({scrollTop: (contextToScrollTo.offset().top - container.offset().top + container.scrollTop() - offset)});
    })
  },
  'click .show-timeline' (e,t){
    notifyFeature('Twitter timeline: Coming soon!')
  }
});

Template.stream_li.onCreated(function(){
  this.previewMode = new ReactiveVar();
});

Template.stream_li.helpers({
  active (){
    return Template.instance().data.active;
  },
  previewMode (){
    return Template.instance().previewMode.get();
  },
  showPreviewButton (){
    return Template.instance().data.allowPreview;
  },
  disablePreviewButton (){
    return this.source === 'twitch';
  }
});

Template.stream_li.events({
  'click .preview-stream' (e, t){
    return t.previewMode.set(true);
  }
});

Template.context_browser_area.helpers({
  showShowTimelineButton (){
    return Session.get('curateMode');
  }
});

Template.context_card_column.helpers({
  isActiveContext (){
    return Session.equals('activeContextId', this._id);
  }
});

Template.context_browser_area.onRendered(function(){
  // make context sortable
  var sortableSets = [
    {
      outerDiv: '.context-area',
      listItem: '.list-item-context-plus-annotation'
    },{
      outerDiv: '.previews-container',
      listItem: '.context-mini-preview'
    }
  ];
  
  _.each(sortableSets, (sortableSet) => {
    let sortableOuterDiv = sortableSet.outerDiv;
    let sortableListItem = sortableSet.listItem;

    this.$(sortableOuterDiv).sortable({
      items: sortableListItem,
      stop: () => {
        var newOrder = this.$(sortableOuterDiv).sortable('toArray', {attribute: 'data-context-id'});
        Meteor.call('reorderContext', Session.get('streamShortId'), newOrder, saveCallback);
      }
    });
    this.$(sortableOuterDiv).disableSelection();

    Tracker.autorun(function () {
      if(Session.get('curateMode')){
        this.$(sortableOuterDiv).sortable('enable');
      } else {
        this.$(sortableOuterDiv).sortable('disable');
      }
    })
  });
});


Template.context_browser.onRendered(function() {
  Tracker.autorun(() => {
    this.contextBlocks;
    updateActiveContext();
  });
});

Template.context_browser.helpers({
  mediaTypeForDisplay (){
    return pluralizeMediaType(Session.get('mediaDataType') || Session.get('previousMediaDataType')).toUpperCase();
  },
  contextBlocks (){
    return this.orderedContext();
  },
  soloSidebarContextMode (){
    var currentContext = getCurrentContext();
    return currentContext && currentContext.soloModeLocation === 'sidebar';
  },
  showCloseSidebarIcon (){
    return !Session.get('reducedView') && !soloOverlayContextModeActive();
  },
  showOpenSidebarIcon (){
    return Session.get('reducedView') && !soloOverlayContextModeActive();
  }
});

Template.context_browser.events({
  'click .close' (){
    Session.set('previousMediaDataType', Session.get('mediaDataType'));
    Session.set('reducedView', true);
  },
  'click .open' (){
    Session.set('reducedView', false);
  },
  'click .add-new-context-row' (){
    Session.set('mediaDataType', Session.get('previousMediaDataType') || 'image');
  },
  'click .delete-context' (e, t){
    if(confirm('Are you sure you want to delete this ' + singularizeMediaType(this.type) + '? This cannot be undone.')){
      t.$('.list-item-context-plus-annotation[data-context-id=' + this._id + ']').fadeOut(500, () => {
          Meteor.call('removeContextFromStream', Session.get("streamShortId"), this._id, basicErrorHandler);
      });
    }
  },
  'click .context-section .clickable' (e, t){

    if ($(e.target).is('textarea')) { // don't go to big browser when its time to edit context
      return
    }
    if(this.hasSoloMode()){
      setCurrentContext(this);
    }
  },
  'click .switch-to-list-mode' (){
    clearCurrentContext();
  },
  'scroll .context-area.list-mode': updateActiveContext
});

Template.overlay_context_browser.onRendered(function(){
  document.body.style.overflow = 'hidden';
  $(window).scrollTop(0);

  if (Session.get('mediaDataType') === 'video') {
    Meteor.setTimeout(function () { // mute stream if playing a video
      mainPlayer.mute();
    }, 1000); // TODO Hack, if mute main video before youtube video loads, will play as muted. Need to mute as soon as loaded
  }

});

Template.overlay_context_browser.onDestroyed(function(){
  document.body.style.overflow = 'auto';
  if(Session.get('mediaDataType') === 'video'){
    mainPlayer.unmute(); // TODO - only unmute if was unmuted before created
  }
});

Template.overlay_context_browser.events({
  'click .close' (){
    clearCurrentContext();
  }
});

Template.solo_context_section.events({
  'click .close' (){
    clearCurrentContext();
  }
});

Template.solo_context_section.helpers(horizontalBlockHelpers);
Template.solo_context_section.helpers({
  showProvider (){
    return this.soloModeLocation === 'overlay';
  }
});
Template.list_item_context_section.helpers(horizontalBlockHelpers);

Template.title_description_overlay.onCreated(function(){
  this.titleLength = new ReactiveVar(this.title ? this.title.length : 0);
  this.descriptionLength = new ReactiveVar(this.description ? this.description.length : 0);
});

Template.title_description_overlay.helpers({
  titleLength (){
    return  Template.instance().titleLength.get();
  },
  titleMax (){
    return titleMax;
  },
  descriptionLength (){
    return Template.instance().descriptionLength.get();
  },
  descriptionMax (){
    return descriptionMax;
  }
});

Template.title_description_overlay.events({
  'keypress .set-title' (e, t){
    if (e.keyCode === 13){
      e.preventDefault();
      $('.set-description').focus();
    }
  },
  'keypress .set-description' (e, t){
    if (e.keyCode === 13){
      e.preventDefault();
      $('#publish-with-title-description').submit();
    }
  },
  'keyup .set-title' (e, t){
    t.titleLength.set($(e.currentTarget).val().length);
  },
  'keyup .set-description' (e, t){
    t.descriptionLength.set($(e.currentTarget).val().length);
  },
  'submit #publish-with-title-description' (e, t){
    e.preventDefault();
    var title = t.$('.set-title').val();
    var description = t.$('.set-description').val();
    Meteor.call('publishStream', this.shortId, title, description, function(err){
      if(err){
        basicErrorHandler(err);
      } else {
        notifySuccess("Congratulations! Your Deep Stream is now on air!");
      }
    });
  },
  'click .close' (e, t){
    Meteor.call('goBackFromTitleDescriptionStep', this.shortId, basicErrorHandler);
  }
});

Template.creation_tutorial.helpers({
  onFindStreamStep (){
    return this.creationStep == 'find_stream';
  },
  onAddCardsStep (){
    return this.creationStep == 'add_cards';
  },
  onGoOnAirStep (){
    return this.creationStep == 'go_on_air';
  }
});

Template.creation_tutorial.events({
  'click .find-stream .text' (e, t){
    Meteor.call('goToFindStreamStep', this.shortId, basicErrorHandler);
  },
  'click .add-cards .text' (e, t){
    Meteor.call('goToAddCardsStep', this.shortId, basicErrorHandler);
  },
  'click .go-on-air .text' (e, t){
    Meteor.call('goToPublishStreamStep', this.shortId, basicErrorHandler);
  },
  'click .find-stream button' (e, t){
    Meteor.call('skipFindStreamStep', this.shortId, basicErrorHandler);
  },
  'click .add-cards button' (e, t){
    Meteor.call('skipAddCardsStep', this.shortId, basicErrorHandler);
  },
  'click .title-description-overlay .close' (e, t){
    Meteor.call('goBackFromTitleDescriptionStep', this.shortId, basicErrorHandler);
  }
});

Template.relevant_content_icon.helpers({
  iconTemplate (){
    return this.type + '_icon';
  }
});

Template.annotation_section.helpers({
  annotation: textContentHelper
});

Template.webcam_setup.events({
  'submit #bambuser-webcam' (e, t){
    console.log('cloocik')
    e.preventDefault();
    var bambuserUsername = t.$('input[name=bambuser-username]').val();
    if(!bambuserUsername){
      return notifyError('Please enter your Bambuser username')
    }
    Meteor.call('startCuratorWebcam', Session.get("streamShortId"), {source: 'bambuser', reference: {username: bambuserUsername}}, function(err, result){
      if(err){
        return basicErrorHandler(err);
      }
      notifySuccess('You are now narrating your DeepStream!');
    });
  }
});
