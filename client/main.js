var horizontalBlockHelpers, throttledResize, typeHelpers;


UI.registerHelper('selectedIf', function(val) {
  return val ? 'selected' : '';
});


Session.set("separation", 20);

window.windowSizeDep = new Tracker.Dependency();

Meteor.startup(function(){
  Tracker.autorun(function(){
    windowSizeDep.depend();

    var windowWidth = $(window).width();

    // Safari changes window size in a weird way that jquery doesn't register correctly when scroll up vs down
    Session.set("windowHeight", Meteor.Device.isPhone() && !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ? window.innerHeight : $(window).height());

    Session.set("minimapMaxHeight", Session.get("windowHeight") - 592);

    Session.set("windowWidth", windowWidth);



    if (Meteor.Device.isPhone()) {
      document.body.style.overflowX = "hidden";
      $('body').css('max-width', windowWidth);
    }

    var cardWidthFromWindowSize = getCardWidth(windowWidth);


    if(hiddenContextMode()){
      var cardHeightFromWidth = cardWidthFromWindowSize * 9 / 16;
      var cardHeightFromSpaceAvailable = Math.max($('.horizontal-context').height() - 110, 40);

      if(cardHeightFromSpaceAvailable < cardHeightFromWidth){
        Session.set("cardHeight", cardHeightFromSpaceAvailable);
        Session.set("cardWidth", cardHeightFromSpaceAvailable * 16 / 9);
      } else {
        if(cardHeightFromWidth < window.constants.baselineCardHeight){
          Session.set("cardHeight", cardHeightFromWidth);
        } else {
          Session.set("cardHeight", null);
        }
        Session.set("cardWidth", cardWidthFromWindowSize);
      }
    } else {
      Session.set("cardWidth", cardWidthFromWindowSize);

      Tracker.nonreactive(() => {
        if(Session.get("cardHeight")){
          Session.set("cardHeight", null);
        }
      })
    }

    throttledScrollUpdate();
  });

  Tracker.autorun(function(){
    if (Session.get('hiddenContextShown')){
      freezePageScroll();
    } else {
      unfreezePageScroll(); // TODO is this helping
    }
  });

  var windowResize = function() {
    windowSizeDep.changed();
  };

  throttledResize = _.throttle(windowResize, 20);

  $(window).resize(throttledResize);

  var justReloaded = window.codeReloaded;

  Tracker.autorun(function(){
    var signingIn = Session.get('signingIn');
    if (signingIn && !justReloaded){
      var trackingInfo = {nonInteraction: 1};
      if(typeof signingIn === 'string'){
        _.extend(trackingInfo,{
          label: signingIn,
          message: signingIn
        })
      }
      trackEvent('Opened sign-in overlay', trackingInfo);
    }

    justReloaded = false;
  });

  Tracker.autorun(function(){
    if( Meteor.Device.isPhone()){
      return activateHiddenContextMode()
    } else {
      var windowWidth = Session.get('windowWidth');
      var read = Session.get("read");

      var inHiddenContextMode;
      Tracker.nonreactive(function(){
        inHiddenContextMode = hiddenContextMode();
        inEmbedMode = embedMode();
      });

      var cutoff = inEmbedMode || Meteor.Device.isTablet() ? 1000 : 840;

      if (read){
        if (windowWidth < cutoff){
          if(!inHiddenContextMode){
            activateHiddenContextMode();
          }
        } else if (inHiddenContextMode) {
          deactivateHiddenContextMode();
        }
      } else if (inHiddenContextMode) {
        deactivateHiddenContextMode();
      }

    }
  });

  var restrictFocusToModal = function( event ) {
    var modal = $('.signin-modal');
    if (!modal.has(event.target)[0]) {
      event.stopPropagation();
      Meteor.setTimeout(function(){
        modal[0].focus();
        var input = $('.signin-modal input')[0];
        if(input){
          input.focus();
        }
      })
    }
  };

  Tracker.autorun(function(){
    if (Session.get('signingIn')){
      $(document).on('focusin', restrictFocusToModal);
    } else {
      $(document).off('focusin', restrictFocusToModal);
    }
  });

  Blaze.addBodyClass(function() {
    if(Router.current() && Router.current().route){
      return Router.current().route.getName();
    }
  });
});

Tracker.autorun(function(){
  if(!Session.get('hiddenContextMode')){
    Session.set('hiddenContextShown', false);
  }
});

Meteor.startup(function(){
  var inIFrame = function(){
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  if (inIFrame()){
    activateEmbedMode();
  }
});



window.hammerSwipeOptions = {
  pointers:	1,
  threshold: 8,
  velocity:	0.25 // 0.65
};

window.hammerDoubleTapOptions = {
  taps:	2
};


Hammer.defaults.cssProps.userSelect = 'text'; // prevent hammer from preventing text-select on mobile

var scrollPauseArmed = false;
var scrollPauseLength = 700;

var currentOrientation = window.orientation;

window.updateCurrentY = function() {
  var actualY, h, i, readMode, scrollTop, stickyTitle, vertTop, _i, _len, _ref;

  // if this is actually an orientation-change event, don't do anything
  var newOrientation = window.orientation;
  if(newOrientation !== currentOrientation){
    currentOrientation = newOrientation;
    return
  }

  scrollTop = $(document).scrollTop();

  readMode = window.constants.readModeOffset - 1;

  stickyTitle = 120;

  var inEmbedMode = embedMode();

  if(!inEmbedMode){
    Session.set("scrollTop", scrollTop);

    if(!Meteor.Device.isPhone()){
      $(".horizontal-context").css({
        opacity: 0.5 + Math.min(1.0, scrollTop / readMode) / 2
      });
      $("div#banner-overlay").css({
        opacity: Math.min(1.0, scrollTop / readMode)
      });
    }

  }

  if(!Meteor.Device.isPhone() && !inEmbedMode){
    if ((scrollTop >= readMode)){
      $("div.title-author").addClass("c");
      $("div.title-author").removeClass("a");
      $("div.title-author").removeClass("b");
    } else if (scrollTop >= stickyTitle) {
      $("div.title-author").addClass("b");
      $("div.title-author").removeClass("a");
      $("div.title-author").removeClass("c");
    } else {
      scrollPauseArmed = true;

      $("div.title-author").addClass("a");
      $("div.title-author").removeClass("b");
      $("div.title-author").removeClass("c");
    }


    if ((scrollTop >= readMode)) {
      $("div.title-overlay, div#banner-overlay").addClass("fixed");
      Session.set("pastHeader", true);
      $("div.horizontal-context").addClass("fixed");

      if(scrollPauseArmed && !inEmbedMode){
        freezePageScroll();
        $(document).scrollTop(readMode + 1);
        Meteor.setTimeout(function () {
          unfreezePageScroll();
        }, scrollPauseLength);
        scrollPauseArmed = false;
      }

      $("div.vertical-narrative").removeClass("fixed");
      $("div.vertical-narrative").addClass("free-scroll");


    } else {
      $("div.title-overlay, div#banner-overlay").removeClass("fixed");
      Session.set("pastHeader", false);
      $("div.horizontal-context").removeClass("fixed");
      $("div.vertical-narrative").removeClass("fixed");
      $("div.vertical-narrative").removeClass("free-scroll");
    }


  }




  if (inEmbedMode || Meteor.Device.isPhone() || (scrollTop >= readMode)) {
    if(inEmbedMode && hiddenContextMode() && (scrollTop < $('.title-overlay').height() - 20)){
      Session.set('pastHeader', false);
      return
    } else {
      Session.set('pastHeader', true);
    }
    _ref = _.map(window.getVerticalHeights(), function(height){ return height + window.constants.selectOffset});
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      h = _ref[i];
      if (scrollTop < h) {
        break;
      }
    }
    actualY = i - 1;
    if (Session.get('currentY') !== actualY) {
      Session.set("currentX", 0);
      return Session.set("currentY", actualY);
    }
  }
};

window.throttledScrollUpdate = _.throttle(window.updateCurrentY, 20);


Tracker.autorun(function(){
  if(!Session.get('pastHeader')){
    Session.set('currentY', null);
    Session.set('currentX', null);
  }
});


Tracker.autorun(function(){
  var story = Session.get('story');
  var currentY = Session.get("currentY");

  if (story && (currentY != null)) {
    var verticalSection = story.verticalSections[currentY];
    if(!verticalSection){
      return Session.set('currentYId', null);
    } else {
      return Session.set('currentYId', verticalSection._id);
    }
  } else {
    return Session.set('currentYId', null);
  }
});


Tracker.autorun(function(){

  var currentYId = Session.get("currentYId");

  if (currentYId){
    Session.set("currentX", getXByYId(currentYId));
  }
});

Tracker.autorun(function(){
  var story = Session.get('story');
  var currentY = Session.get("currentY");
  var currentXByYId = Session.get("currentXByYId"); // for reactivity

  if(!story || !story.verticalSections){
    return
  }
  var verticalSection = story.verticalSections[currentY];
  if(!verticalSection){
    return
  }

  if((hiddenContextMode() && !hiddenContextShown())){
    //Session.set("currentX", null);
    Tracker.nonreactive(function(){
      Session.set('previousXId', Session.get('currentXId'));
    });
    return Session.set("currentXId", null);
  } else {
    var currentX = getXByYId(verticalSection._id);

    if(typeof currentX === 'number'){
      var currentContextBlockId = verticalSection.contextBlocks[currentX];
      if (currentContextBlockId) {

        Tracker.nonreactive(function(){
          Session.set('previousXId', Session.get('currentXId'));
        });
        return Session.set('currentXId', currentContextBlockId);
      }
    }

    return Session.set('currentXId', null);
  }
});


Tracker.autorun(function(){
  var story = Session.get('story');
  if(!story){
    return
  }

  var id = story._id;

  var currentY = Session.get("currentY");

  var onReadPage;
  var storyRead;

  Tracker.nonreactive(function(){
    onReadPage = Session.get('read') && !Session.get('showDraft');
    storyRead = Session.equals('storyRead', id);
  });


  if(!onReadPage || storyRead){
    return
  }

  var totalLength = story.verticalSections.length;

  if (typeof currentY === 'number'){
    if((currentY + 1) >= totalLength * 0.67){
      Session.set('storyRead', id);
      console.log('read')
      Meteor.call('countStoryRead', id);
      analytics.track('Read story', _.extend({}, trackingInfoFromStory(story), { nonInteraction: 1 }));
    }
  }
});


Tracker.autorun(function(){
  var story = Session.get('story');

  if(!story){
    return
  }

  var id = story._id;

  var onReadPage;
  var storyViewed;

  Tracker.nonreactive(function(){
    onReadPage = Session.get('read') && !Session.get('showDraft');
    storyViewed = Session.equals('storyViewed', id);
  });


  if(!onReadPage || storyViewed){
    return
  }


  Session.set('storyViewed', id);
  Session.set('storyRead', null); // should reset whether story was read whenever switch which story was viewed so views and reads are comparable
  Meteor.call('countStoryView', id);
  trackEvent('View story', _.extend({}, trackingInfoFromStory(story), { nonInteraction: 1 }));
});




Meteor.startup(function() {
  Session.setDefault("filterOpen", false);
  Session.setDefault("filter", "curated");
  Session.setDefault("category", "all");
  Session.setDefault("pastY", []);
  Session.setDefault("pastX", []);
  Session.setDefault("currentY", void 0);
  Session.setDefault("previousY", void 0);
  Session.setDefault("currentX", void 0);
});

Meteor.startup(function(){
  $( window ).konami({
    code : [38,38,40,40,37,39,37,39, 66, 65],
    cheat () {
      $('body').addClass('konami');
    }
  });
  $( window ).konami({
    code : [70, 79, 76, 68, 65, 68, 77, 73, 78],
    cheat () {
      Session.set('adminMode', true);
    }
  });

});



typeHelpers = {
  text () {
    return this.type === "text";
  },
  image () {
    return this.type === "image";
  },
  gif () {
    return this.type === "gif";
  },
  map () {
    return this.type === "map";
  },
  video () {
    return this.type === "video";
  },
  viz () {
    return this.type === "viz";
  },
  twitter () {
    return this.type === "twitter";
  },
  audio () {
    return this.type === "audio";
  },
  link () {
    return this.type === "link";
  }
};

Template.story_header.onRendered(function() {
  var range, sel, titleDiv;
  // add cursor to title section if empty
  if (!this.data.title) {
    if (!Session.get('read')) {
      titleDiv = $(this)[0].find('.story-title');
      sel = window.getSelection();
      if (sel.rangeCount > 0) {
        sel.removeAllRanges();
      }
      range = document.createRange();
      range.selectNodeContents(titleDiv);
      range.collapse();
      return sel.addRange(range);
    }
  }
});

Template.story_header.helpers({
  title () {
    if (this.title) {
      return this.title;
    } else {
      return Session.get("storyTitle");
    }
  },
  profileUrl (){
    return '/profile/' + (this.authorDisplayUsername || this.authorUsername); // TODO migrate and only use authorDisplayUsername
  },
  author (){
    return Meteor.users.findOne(this.authorId)
  }
});

Template.story_header.events = {
  "click #to-story" () {
    $('#to-story, .attribution').fadeOut();
    goToX(0);
    return goToY(0);
  },
  "click #banner-overlay" () {
    if (!Session.get("pastHeader")) {
      $('#to-story, .attribution').fadeOut();
      goToX(0);
      return goToY(0);
    }
  },
  "keydown"  (e) {
    if (enterPress(e) && !Session.get('read')) { // enter
      e.preventDefault();
      $(':focus').blur(); // TO-DO this should move focus to the first block
      $('#to-story, .attribution').fadeOut();
      goToX(0);
      return goToY(0);
    }
  }
};

Template.story.helpers({
  horizontalExists: horizontalExists,
  pastHeader () {
    return Session.get("pastHeader");
  },

  metaviewOpen () {
    return Session.get("metaview")
  },
  showMinimap () {
    return Session.get("showMinimap") && !hiddenContextMode() && !(embedMode() && Session.get('poppedOutContextId'));
  },
  showContextOverlay (){
    return Session.get('contextOverlayId');
  },
  showStoryBrowser (){
    return !Session.get('addingContext') && (!hiddenContextMode() || hiddenContextShown())
  }
});

Template.story_title.helpers({
  storyTitleDiv (){
    var initialClasses = Session.get('showDraft') ? 'story-title notranslate' : 'story-title';
    if (Session.get('read')) {
      return '<div class="' + initialClasses + '">' + _.escape(this.title) + '</div>';
    } else {
      // this is contenteditable in edit mode
      return '<div class="notranslate ' + initialClasses + '" placeholder="Title" contenteditable="true" dir="auto">' + _.escape(this.title) + '</div>';
    }
  }
});

Template.vertical_section_block.helpers({
  notFirst () {
    return !Session.equals("currentY", 0);
  },
  verticalSelected () {
    return Session.equals("currentY", this.index) && Session.get("pastHeader") || Session.equals("currentY", null) && this.index === 0 && !hiddenContextMode();
  },
  titleDiv () {
    var initialClasses = Session.get('showDraft') ? 'title notranslate' : 'title';
    if (Session.get('read')) {
      return '<div class="' + initialClasses + '" dir="auto">' + _.escape(this.title) + '</div>';
    } else {
      // this is contenteditable in edit mode
      return '<div class="editable ' + initialClasses + '" placeholder="Title" contenteditable="true" dir="auto">' + _.escape(this.title) + '</div>';
    }
  },
  // NOTE: contentDiv is weird because the user edits its content but it's not reactive. be careful. if it's made reactive without updating it's semi-reactive contents accordingly, user will lose content
  contentDiv () {

    var showDraft = Session.get('showDraft');
    var initialClasses = showDraft ? 'content notranslate' : 'content';
    if (Session.get('read')) {
      var content = cleanVerticalSectionContent(this.content);

      var html = '<div class="' + initialClasses + '" dir="auto">' + content + '</div>';

      if(!showDraft && adminMode()){ // show link analytics
        var story = new Story(Session.get('story'));
        var maxAnchorClicks= story.maxAnchorClicks();

        if(!maxAnchorClicks){
          return html;
        }

        var heroContextId = this.contextBlocks[0];

        jqHtml = $(html);
        jqHtml.find('a').each(function(){
          let contextId = $(this).data('contextId');
          let anchorClicks = story.analytics.anchorClicks ? story.analytics.anchorClicks[contextId] || 0 : 0;
          let activityLevel = Math.pow( anchorClicks / maxAnchorClicks , 0.5) * 100;
          $(this).css({'background-color': 'hsl(155, ' + activityLevel + '%, 80%)'});

          if(contextId === heroContextId){
            $(this).addClass('hero');
            $(this).attr('title', 'This is a link to the hero card, so people dont need to click a link to see it.');
          }

        });
        return jqHtml[0].outerHTML;
      } else {
        return html;
      }
    } else {
      // nonReactiveContent preserves browser undo functionality across saves
      // this is contenteditable in edit mode
      return '<div class="editable fold-editable ' + initialClasses + '" placeholder="Type your text here." contenteditable="true" dir="auto">' + cleanVerticalSectionContent(Template.instance().semiReactiveContent.get()) + '</div>';
    }
  },
  showContextButton () {
    if (this.contextBlocks.length && hiddenContextMode()){
      if(Meteor.Device.isPhone() || Session.get('windowWidth') < 400){
        return true
      } else {
        return Session.get('pastHeader')
      }
    }
  }
});

Template.vertical_narrative.helpers({
  verticalSectionsWithIndex () {
    if(!this.verticalSections){ // catch error coming from my_stories for some reason
      return
    }
    return this.verticalSections.map(function(v, i) {
      return _.extend(v, {
        index: i
      });
    });
  }
});

Template.vertical_section_block.events({
  "click" (e, t) {
    var afterGoToY;
    var enclosingAnchor;

    if($(e.target).is('div')){
      // do nothing
    } else if (enclosingAnchor = $(e.target).closest('a')){
      var contextId = $(enclosingAnchor).data('contextId');

      if(!adminMode()){ // this should check for analytics mode
        countAnchorClick(contextId);
      }

      e.preventDefault();
      afterGoToY = function(){
        goToContext(contextId);
      };
      Meteor.setTimeout(() => {
        trackEvent('Click context anchor', _.extend({}, window.trackingInfoFromStory(Session.get('story')), {
          verticalIndex: t.data.index,
          contextId: contextId,
          contextType: $(e.currentTarget).data('contextType'),
          contextSource: $(e.currentTarget).data('contextSource'),
          numberOfContextCardsOnVertical: t.data.contextBlocks.length,
          inReadMode: Session.get('read')
        }));
      });
    }

    goToY(t.data.index, {complete: afterGoToY});

  },
  "click .context-button" (e, t){
    afterGoToY = function(){
      Session.set("hiddenContextShown", true);
    };
    Meteor.setTimeout(() => {
      trackEvent('Click context button', _.extend({}, window.trackingInfoFromStory(Session.get('story')), {
        verticalIndex: t.data.index,
        numberOfContextCardsOnVertical: t.data.contextBlocks.length
      }));
    });

    goToY(t.data.index, {complete: afterGoToY});
  }
});


Template.story.onRendered(function(){

  $(document).on('scroll', throttledScrollUpdate);

  if(Meteor.Device.isPhone() || Meteor.Device.isTablet()){
    this.$('.entire-story').hammer(hammerSwipeOptions).bind('swipeleft',function(){
        if(horizontalExists()){
          if (!hiddenContextMode() || hiddenContextShown()){
            goRightOneCard();
          }
        }
      }
    );

    this.$('.entire-story').hammer(hammerSwipeOptions).bind('swiperight',function(){
        if(horizontalExists()){
          if (!hiddenContextMode() || hiddenContextShown()){
            goLeftOneCard();
          }
        }
      }
    );

  }

  windowSizeDep.changed(); // trigger window resizing things

});

Template.story.onDestroyed(function(){
  $(document).off('scroll', throttledScrollUpdate);

  if(Meteor.Device.isPhone() || Meteor.Device.isTablet()){
    this.$('.entire-story').hammer(hammerSwipeOptions).unbind('swipeleft');

    this.$('.entire-story').hammer(hammerSwipeOptions).unbind('swiperight');
  }
});

var saveMetaviewOrdering = function() {
  var newVerticalSectionIDs = $( ".sortable-rows" ).sortable('toArray', {attribute: 'data-id'});

  var newContextBlocks = [];
  $( ".sortable-blocks" ).each(function(i, e) {
    newContextBlocks.push($(e).sortable('toArray', {attribute: 'data-id'} ))
  });


  var idMap = _.map(newVerticalSectionIDs, function(id, index){
    return {
      verticalId: id,
      contextBlocks: newContextBlocks[index]
    }
  });

  Session.set('saveState', 'saving');

  Meteor.call('reorderStory', Session.get("storyId"), idMap, saveCallback);
};

Template.metaview.onRendered(function() {
  document.body.style.overflow = 'hidden'; // prevent document scroll while in metaview
  this.$(".sortable-rows").sortable({
    stop: saveMetaviewOrdering
  });

  var removingContext;

  this.$(".sortable-blocks").sortable({
    connectWith: ".sortable-blocks",
    remove (e, ui) { // when a context block is removed from one vertical section and placed in another
      removingContext = true;
      var removedContextId = ui.item.data('id');
      removeAnchorTag($('.vertical-narrative-section .content a[data-context-id="' + removedContextId + '"]')); // remove the broken link
      Meteor.setTimeout(() => { // then save the ordering just a moment later to ensure the anchor removal makes it to the server first
        removingContext = null;
        resetXPositionMemory();
        saveMetaviewOrdering();
      }, 200);
    },
    stop (e, ui) {
      if(!removingContext){ // if context is being removed, we handle it above
        resetXPositionMemory(); // prevent XId stuff from getting all crazy
        saveMetaviewOrdering();
      }
      removingContext = null;
    }
  });

  this.$(".sortable-rows, .sortable-blocks").disableSelection();
});

Template.metaview.onDestroyed(function() {
  document.body.style.overflow = 'auto';
});

Template.metaview.events({
  "click .close" (d, t) {
    Session.set("metaview", false);
  },
  "click" (d, t) {
    d.preventDefault();
  },
  // these lines below prevent mouseout and mouseover from getting to other dom elements that will release the scroll lock
  mouseover (d){
    d.preventDefault();
    d.stopPropagation();
  },
  mouseout (d){
    d.preventDefault();
    d.stopPropagation();
  }
})

Template.metaview_context_block.helpers(typeHelpers)

Template.metaview.helpers({
  verticalSectionsWithIndex () {
    return this.verticalSections.map(function(v, i) {
      return _.extend(v, {
        index: i
      });
    });
  },
  horizontalSections () {
    var blocks = this.contextBlocks
       .map(function(id) {
         return ContextBlocks.findOne({ // by finding one at a time, this keeps in broken links. TO-DO maybe should find a better soln that uses $in
           _id: id
         }) || {_id: id}; // fallback to just having id if cannot find
       });
    return blocks;
  },
  textContent (){
    return $($.parseHTML(this.content)).text();
  }
});

Template.minimap.events({
  "click .minimap" (d, t) {
    if (!Session.get('read')){ // only metaview in create for now
      Session.set("metaview", true);
      trackEvent('Click minimap in create mode');
    } else {
      notifyFeature('Zoom-out mode: coming soon!');
      trackEvent('Click minimap in read mode');
    }
  }
});

Template.minimap.helpers({
  horizontalSectionsMap () {
    return Session.get("horizontalSectionsMap");
  },
  selectedX () {
    return Session.equals("currentX", this.horizontalIndex);
  },
  selectedY () {
    return Session.equals("currentY", this.verticalIndex);
  },
  minimapLargeEnough () {
    // Ensure minimap height is greater than 0 and sections are at least 5 pixels tall
    if (Session.get("minimapMaxHeight") <= 0 || (Session.get("minimapMaxHeight") / Session.get("horizontalSectionsMap").length < 5)) {
      return false;
    } else {
      return true;
    }
  },
  responsive () {
    var maxHeight = Session.get("minimapMaxHeight");
    var defaultSectionHeight = 17 + 5;  // Section height + margin-bottom
    return (Session.get("horizontalSectionsMap").length * defaultSectionHeight >= maxHeight)
  },
  sectionHeight () {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.75;  // 75% of available space
  },
  verticalCardWidth () {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.75 * 1.53333;  //  1.53333 aspect ratio
  },
  horizontalCardWidth () {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.75 * 0.7645 * 1.53333;  // Horizontal block is 76.45% of section
  },
  sectionMargin () {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.25;  // 25% of available space (33% of section)
  },
  showActivity (){
    return adminMode();
  },
  activityLevel (){
    var story = new Story(Session.get('story'));
    var activeHeartbeats = (this.activeHeartbeats || 0);
    var maxActiveHeartbeats = story.maxActiveHeartbeats();
    return Math.pow( activeHeartbeats / maxActiveHeartbeats , 0.5) * 100;
  }
});

Template.horizontal_context.events({
  click  () {
    if(Session.equals('currentY', null)){
      goToY(0);
    }
  },
  'click .hidden-context-overlay' (){
    Session.set('hiddenContextShown', false);
  }
});

Template.horizontal_context.onRendered(function(){
  Tracker.autorun(() => {
    if(mobileOrTablet()) {
      if(Session.get('hiddenContextShown')){
        Meteor.defer(()=> {
          this.$('.hidden-context-overlay').hammer(hammerDoubleTapOptions).bind('doubletap', () => {
            Session.set('hiddenContextShown', false);
          });
        })
      } else {
        this.$('.hidden-context-overlay').hammer(hammerDoubleTapOptions).unbind('doubletap');
      }
    }
  })
});

Template.horizontal_context.onDestroyed(function(){
  if(mobileOrTablet()) {
    this.$('.hidden-context-overlay').hammer(hammerDoubleTapOptions).unbind('doubletap');
  }
});



Template.horizontal_context.helpers({
  verticalExists () {
    return Session.get("horizontalSectionsMap").length;
  },
  horizontalSections () {
    var that = this;
    if(!this.verticalSections){ // catch error coming from my_stories for some reason
      return
    }
    return this.verticalSections.map(function(verticalSection, verticalIndex) {
      var sortedContext, unsortedContext;

      if (Session.get('showDraft')) { // In CREATE, these need to be looked up from the db
        sortedContext = _.chain(verticalSection.contextBlocks)
          .map(function(id) {
            return ContextBlocks.findOne({ // by finding one at a time, this keeps in broken links. TO-DO maybe should find a better soln that uses $in
              _id: id
            }) || {_id: id}; // fallback to just having id if cannot find
          })
          .map(function (datum, horizontalIndex) {
            return _.extend(datum || {}, {
              index: horizontalIndex,
              verticalIndex: verticalIndex,
              verticalId: verticalSection._id
            });
          })
          .value();
        //sortedContext = _.sortBy(unsortedContext, function (datum) {
        //  return datum.horizontalIndex;
        //});
        return {
          index: verticalIndex,
          data: sortedContext
        };
      } else { // In READ, these are denormalized on the document
        var data = _.chain(verticalSection.contextBlocks)
          .map(function(id) {
            var cBlock = _.findWhere(that.contextBlocks, {_id: id})
            if (cBlock) {
              return cBlock;
            } else {
              throw new Meteor.Error('context card not found on story ' + that._id + ' .  context card: ' + id);
            }
          })
          .map(window.newTypeSpecificContextBlock)
          .map(function (datum, horizontalIndex) {
            return _.extend(datum || {}, {
              index: horizontalIndex,
              verticalIndex: verticalIndex,
              verticalId: verticalSection._id

            });
          })
          .value();
        return {
          data: data,
          index: verticalIndex
        }
      }
    });
  },
  last () {
    var lastIndex, _ref;
    lastIndex = ((_ref = Session.get("horizontalSectionsMap")[Session.get("currentY")]) != null ? _ref.horizontal.length : void 0) - 1;
    return (this.index === lastIndex) && (lastIndex > 0);
  },
  horizontalShown () {
    return Session.equals("currentY", this.index) || (Session.equals("currentY", null) && this.verticalIndex === 0);
  }
});



editableDescriptionCreatedBoilerplate = function() {
  this.editing = new ReactiveVar(false);
};

//editableDescriptionDestroyedBoilerplate = function(meteorMethod) {
  //return function(){
  //  if(document.body){
  //    document.body.style.overflow = 'auto';
  //  }
  //  console.log(this)


    //var that = this;
    //if (!Session.get('read') && !Session.get('addingContext')) {
    //  var textContent = this.$('textarea[name=content]').val();
    //  Session.set('saveState', 'saving');
    //  Meteor.call(meteorMethod, that._id, textContent, function (err, numDocs) {
    //    saveCallback(err, numDocs);
    //  });
    //}
//  }
//};

var selected = function() {
  var currentYId = Session.get('currentYId');
  return ((this.verticalId === currentYId && this.index === getXByYId(currentYId)) || (this.verticalIndex === 0 && Session.get('currentY') == null && this.index === getXByYId(this.verticalId)) && !Session.get("addingContext"));
};

var poppedOut = function(){
  return _.contains(['audio','video'], this.type) && this._id === Session.get('poppedOutContextId');
};

horizontalBlockHelpers = _.extend({}, typeHelpers, {
  selected: selected,
  poppedOut: poppedOut,
  textContent () {
    var textContent, rows;
    if (this.type === 'text'){
      textContent = this.content || '';
      rows = 10;
      placeholder = '';
    }
    else{
      textContent = this.description || '';
      rows = 2;
      placeholder = 'Add a caption'
    }

    if (Session.get('read')) {
      if (textContent.length){
        return '<div class="text-content" dir="auto">' + _.escape(textContent).replace(/\n/g, "<br>") + '</div>';
      } else {
        return ''
      }
    } else {
      return '<textarea name="content" class="text-content editable" rows="' + rows + '" placeholder="' + placeholder +  '" dir="auto">' + _.escape(textContent) + '</textarea>';
    }
  }
});


var horizontalSectionInDOM = function () {
  // on this row, or this card is the current X for another hidden row
  return Session.equals("currentY", this.verticalIndex) || (Session.equals("currentY", null) && this.verticalIndex === 0 && !Meteor.Device.isPhone() && !window.isSafari) || this._id === Session.get('poppedOutContextId');
};

Template.horizontal_section_block.onCreated(function(){
  this.horizontalSectionInDOM = new ReactiveVar();

  Tracker.autorun(()=>{
    if(horizontalSectionInDOM.call(this.data)){
      this.horizontalSectionInDOM.set(true);
    } else {
      Meteor.setTimeout(()=>{
        var shouldBeInDOM = horizontalSectionInDOM.call(this.data);

        if(!shouldBeInDOM ){
          this.horizontalSectionInDOM.set(false);
        }
      }, 500);
    }
  })
});

Template.horizontal_section_block.onRendered(function(){
  // when cards flip from left to right (or vice-versa), they sometimes go above other cards weirdly. this sends it behind for the duration of the animation
  //var lastIndex, _ref;
  //lastIndex = ((_ref = Session.get("horizontalSectionsMap")[this.data.verticalIndex]) != null ? _ref.horizontal.length : void 0) - 1;
  //var isLast = ((this.data.index === lastIndex) && (lastIndex > 0));

  this.styleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutationRecord) => {
      var oldLeft = mutationRecord.oldValue.match(/left\:\W([\-?\d+]+)/)[1];
      var newLeft = this.firstNode.style.left.match(/([\-?\d+]+)/)[1];

      if ( (oldLeft < 0 && newLeft > 300) || (oldLeft > 300 && newLeft < 0) ){ // if it flips from negative to positive
        $(this.firstNode).addClass('hide-behind');
        Meteor.setTimeout(() => {
          $(this.firstNode).removeClass('hide-behind');
        }, 200); // this number should be as long as the .left-transition in the css
      }
    });
  });

  this.styleObserver.observe(this.firstNode, { attributes : true, attributeFilter : ['style'], attributeOldValue: true })

});

Template.horizontal_section_block.onDestroyed(function(){
  if(this.styleObserver){
    this.styleObserver.disconnect();
  }
});

Template.horizontal_section_block.helpers(horizontalBlockHelpers);

// Magic layout function
Template.horizontal_section_block.helpers({
  left: getHorizontalLeft,
  lastUpdate () {
    Session.get('lastUpdate');
  },
  hide () {
    return !Session.equals("currentY", this.verticalIndex) && !(Session.equals("currentY", null) && this.verticalIndex === 0) && !(this._id === Session.get('poppedOutContextId'));
  },

  hideContainer () {
    return this.type === 'audio' && this._id === Session.get('poppedOutContextId') && !(Session.equals("currentY", this.verticalIndex) || Session.equals("currentY", null) && this.verticalIndex === 0);
  },
  horizontalSectionInDOM () {
    return Template.instance().horizontalSectionInDOM.get();
  },
  inCurrentRow (){
    var currentY = Session.get('currentY');
    return (this.verticalIndex === 0 && currentY == null) || this.verticalIndex === currentY;
  }
});


Template.horizontal_section_block.events({
  'click' (){
    goToX(this.index)
  }
});

editableDescriptionEventsBoilerplate = function(meteorMethod) {
  return {
    "blur .text-content.editable" (d, template) {
      if (!Session.get('read') && !Session.get('addingContext')) {
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, this._id, textContent, saveCallback);
      }
    },
    "mouseenter .text-content.editable" (d, template) {
      document.body.style.overflow = 'hidden';
    },
    "mouseleave .text-content.editable" (d, template) {
      document.body.style.overflow = 'auto';
    },
    "keypress .image-section .text-content.editable" (e, template) { // save on Enter
      if (!Session.get('read') && !Session.get('addingContext') && e.which === 13 ) {
        e.preventDefault();
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, this._id, textContent, saveCallback);
      }
    }
  }
};

Template.display_viz_section.helpers(horizontalBlockHelpers);

Template.display_image_section.onCreated(editableDescriptionCreatedBoilerplate);
Template.display_image_section.onCreated(function(){
  this.showMobileCaption = new ReactiveVar();
  if(mobileOrTablet()){
    this.autorun(() => {
      if(!Session.equals('contextOverlayId', this.data._id)){
        this.showMobileCaption.set(false);
      }
    })
  }
});

Template.display_text_section.events({
  'click'  (e, t) {
    Session.set('contextOverlayId', this._id);
    trackEvent('Expand text card');
  }
});


Template.display_image_section.helpers(horizontalBlockHelpers);
Template.display_image_section.helpers({
  showMobileCaption () {
    return Template.instance().showMobileCaption.get();
  }
});
Template.display_image_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));
Template.display_image_section.events({
  'click'  (e, t) {
    if(mobileOrTablet() && this.description && !Template.instance().showMobileCaption.get()){
      return Template.instance().showMobileCaption.set(true);
    }
    if (Session.get('read') && !($(e.target).is('a'))) {
      Session.set('contextOverlayId', this._id);
      trackEvent('Expand image card');
    }
  }
});

Template.display_audio_section.helpers(horizontalBlockHelpers);

Template.display_audio_section.events({
  'click .audio-iframe-overlay' (){
    if(mostRecentWidget.activated()){
      mostRecentWidget.isPlaying((playing) => {
        if(playing){
          mostRecentWidget.pause();
        }
      })
    }
  }
});

Template.display_video_section.helpers(horizontalBlockHelpers);

Template.display_video_section.onCreated(function(){
  this.randomIFrameId =  Random.id(8);
});

Template.display_video_section.helpers({
  fromVimeo (){
    return this.source === 'vimeo';
  },
  vimeoOnTablet (){
    return Meteor.Device.isTablet() && this.source === 'vimeo';
  },
  randomIFrameId (){
    return Template.instance().randomIFrameId
  },
  apiReadyUrl (){
    if(this.source === 'vimeo'){
      return this.url() + '&player_id=' + Template.instance().randomIFrameId
    } else {
      return this.url()
    }
  }
});
Template.display_video_section.events({
  'click .video-iframe-overlay' (){
    if(mostRecentWidget.activated()){
      mostRecentWidget.isPlaying((playing) => {
        if(playing){
          mostRecentWidget.pause();
        } else {
          mostRecentWidget.isPaused((paused) => {
            if (paused) {
              mostRecentWidget.play();
            }
          });
        }
      })
    }
  },
  "click .dismiss-popout" (e, t) {
    if(poppedOutWidget.activated()){
      poppedOutWidget.pause();
    }
    clearPoppedOutWidget();
    trackEvent('Click dismiss popout button');
  }
});

Template.display_twitter_section.helpers(horizontalBlockHelpers);

Template.display_map_section.helpers(horizontalBlockHelpers);

Template.display_link_section.helpers(horizontalBlockHelpers);
Template.display_link_section.onCreated(function(){
  this.editingTitle = new ReactiveVar();
  this.editingDescription = new ReactiveVar();
  this.editThumbnailPrompt = new ReactiveVar();
  this.editingThumbnail = new ReactiveVar();
  this.uploadingThumbnail = new ReactiveVar();
});
Template.display_link_section.helpers({
  editingTitle (){
    return Template.instance().editingTitle.get()
  },
  editingDescription (){
    return Template.instance().editingDescription.get()
  },
  editThumbnailPrompt (){
    return !Session.get('read');
  },
  uploadingThumbnail (){
    return Template.instance().uploadingThumbnail.get();
  }
});
Template.display_link_section.events({
  'click a'  (e, t) {
    if(!Session.get('read') && !$(e.target).is('input')){
      e.preventDefault();
      return false
    }
    var url = e.currentTarget.href;
    trackEvent('Click external link in link card', {
      label: url,
      url: url,
      targetClassName: e.target.className
    })
  },
  'click div.link-title' (e,t){
    if(!Session.get('read') && !Session.get('addingContext')){
      t.editingTitle.set(true);
      Meteor.setTimeout(function(){
        t.$('.link-title').select();
      })
    }
  },
  'blur textarea.link-title' (e,t){
    if(!Session.get('read') && !Session.get('addingContext')){
      Session.set('saveState', 'saving');
      Meteor.call('editLinkTitle', this._id, t.$('textarea.link-title').val(), (err, result) =>{
        if(result){
          t.editingTitle.set(false);
        }
        saveCallback(err, result)
      });
    }
  },
  'click div.link-description' (e,t){
    if(!Session.get('read') && !Session.get('addingContext')){
      t.editingDescription.set(true);
      Meteor.setTimeout(function(){
        t.$('.link-description').select();
      })
    }
  },
  'blur textarea.link-description' (e,t){
    if(!Session.get('read') && !Session.get('addingContext')){
      Session.set('saveState', 'saving');
      Meteor.call('editLinkDescription', this._id, t.$('textarea.link-description').val(), (err, result) => {
        if(result){
          t.editingDescription.set(false);
        }
        saveCallback(err, result)
      });
    }
  },
  "click input[type=file]" (d, template) {
    return template.editingThumbnail.set(true);
  },
  "change input[type=file]" (e, template){
    var finish = function(){
      template.uploadingThumbnail.set(false);
      return template.editingThumbnail.set(false);
    };

    var file = _.first(e.target.files);
    if (file) {
      if(file.size > CLOUDINARY_FILE_SIZE){
        notifyImageSizeError();
        return finish()
      }
      template.uploadingThumbnail.set(true);
      Cloudinary.upload([file], {}, (err, doc) => {
        if(err){
          var input = template.$('input[type=file]');
          input.val(null);
          input.change();
          saveCallback(err);
          return finish();
        } else {
          var cloudinaryImageInfo = {
            id: doc.public_id,
            fileExtension: doc.format,
            width: doc.width,
            height: doc.height
          };
          Meteor.call('editLinkThumbnail', this._id, cloudinaryImageInfo, (err, result) => {
            saveCallback(err, result);
            return finish()
          });
        }
      })
    } else {
      return finish()
    }
  }
});

Template.display_text_section.onCreated(editableDescriptionCreatedBoilerplate);

//Template.display_text_section.onDestroyed(editableDescriptionDestroyedBoilerplate('editTextSection'));
Template.display_text_section.helpers(horizontalBlockHelpers);
Template.display_text_section.events(editableDescriptionEventsBoilerplate('editTextSection'));


Template.horizontal_section_edit_delete.helpers(horizontalBlockHelpers);

Template.story_browser.helpers({
  showLeftArrow () {
    return !Meteor.Device.isPhone() && (Session.get("currentX") !== 0 || Session.get("wrap")[Session.get('currentYId')]);
  },
  showRightArrow () {
    return !Meteor.Device.isPhone();
  }
});

Template.story_browser.events({
  "click .right" (d) {
    window.goRightOneCard();
    trackEvent('Click right arrow');
  },
  "click .left" (d) {
    window.goLeftOneCard();
    trackEvent('Click left arrow');
  }
});

Template.type_specific_icon.helpers(typeHelpers);


Template.share_buttons.events({
  'click .share-embed' (e, t) {
    notifyFeature('Embedding: coming soon!');
    trackEvent('Click embed button');
  }
});

Template.share_on_facebook.events({
  'click .share-facebook' (e, t) {
    var width  = 575;
    var height = 400;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;
    var url    = "//facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.href);
    var opts   = 'status=1' +
      ',width='  + width  +
      ',height=' + height +
      ',top='    + top    +
      ',left='   + left
    window.open(url, 'facebook', opts);
    Meteor.call('countStoryShare', this._id, 'facebook');
    trackEvent('Share on Facebook');
  }
});

Template.share_on_twitter.events({
  'click .share-twitter' (e, t) {
    var title = $(".story-title").text();
    var width  = 575;
    var height = 400;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;
    var url    = '//twitter.com/intent/tweet?text=Read "' + title + '" on @readFOLD&url=' + encodeURIComponent(location.href);
    var opts   = 'status=1' +
      ',width='  + width  +
      ',height=' + height +
      ',top='    + top    +
      ',left='   + left
    window.open(url, 'twitter', opts);
    Meteor.call('countStoryShare', this._id, 'twitter');
    trackEvent('Share on Twitter');
  }
});


Template.follow_button.helpers({
  additionalClasses () {
    var classes = '';

    if (Template.instance().justFollowed.get()){
      classes += 'just-followed'
    }
    if (Template.instance().justUnfollowed.get()){
      classes += 'just-unfollowed'
    }
    return classes;
  },
  userFollowing (){
    return Meteor.user() && _.contains(Meteor.user().profile.following, Template.instance().data.userId);
  },
  isYou (){
    return Meteor.userId() === Template.instance().data.userId;
  }
});

Template.follow_button.onCreated(function() {
  this.justFollowed = new ReactiveVar();
  this.justUnfollowed = new ReactiveVar();
});
Template.follow_button.events({
  "click .follow"  (e, t) {
    trackEvent('Click follow button');

    if (!Meteor.user()) {
      openSignInOverlay("Please sign in to follow this author.\nIt'll only take a second!");
      return
    }
    t.justFollowed.set(true);
    Meteor.setTimeout(function () {
      t.justFollowed.set(null);
    }, 1500);

    return Meteor.call('followUser', t.data.userId, function (err) {
      if (err) {
        notifyError(err);
        throw(err);
      } else {
        trackEvent('Follow user');
      }

    })

  },
  "click .unfollow"  (e, t) {
    t.justUnfollowed.set(true);
    Meteor.setTimeout(function(){
      t.justUnfollowed.set(null);
    }, 1000);
    return Meteor.call('unfollowUser', t.data.userId, function (err) {
      if (err) {
        notifyError(err);
        throw(err);
      } else {
        trackEvent('Unfollow user');
      }
    });
  }
});


Template.favorite_button.helpers({
  additionalClasses () {
    var classes = '';

    if (Template.instance().justFavorited.get()){
      classes += 'just-favorited'
    }
    if (Template.instance().justUnfavorited.get()){
      classes += 'just-unfavorited'
    }
    return classes;
  }
});

Template.favorite_button.onCreated(function() {
  this.justFavorited = new ReactiveVar();
  this.justUnfavorited = new ReactiveVar();
});
Template.favorite_button.events({
  "click .favorite"  (e, t) {
    trackEvent('Click favorite button');

    if (!Meteor.user()) {
      openSignInOverlay('Thanks for showing your love!\nPlease sign in to favorite this FOLD.');
      return
    }
    t.justFavorited.set(true);
    Meteor.setTimeout(() => {
      t.justFavorited.set(null);
    }, 700);

    return Meteor.call('favoriteStory', this._id, (err) => {
      if (err) {
        notifyError(err);
        throw(err);
      } else {
        trackEvent('Favorite story');
      }

    })

  },
  "click .unfavorite"  (e, t) {
    t.justUnfavorited.set(true);
    Meteor.setTimeout(function(){
      t.justUnfavorited.set(null);
    }, 1000);
    return Meteor.call('unfavoriteStory', this._id, function (err) {
      if (err) {
        notifyError(err);
        throw(err);
      } else {

        trackEvent('Unfavorite story');
      }
    });
  }
});

Template.editors_pick_button.events({
  "click .pick" () {
    return Meteor.call('designateEditorsPick', this._id, function(err) {
      if (err) {
        notifyError(err);
        throw(err);
      }
    });
  },
  "click .unpick" () {
    return Meteor.call('stripEditorsPick', this._id, function(err) {
      if (err) {
        notifyError(err);
        throw(err);
      }
    });
  }
});



Template.remix_bar.helpers({
  showPopoutButton (){
    return _.contains(['audio', 'video'], this.type);
  }
});

Template.remix_bar.events({
  'click .remix-button' (){
    trackEvent('Remix context card click', _.pick(this, [
      "_id",
      "authorId",
      "index",
      "source",
      //"storyId",
      "storyShortId",
      "type",
      "verticalId",
      "verticalIndex"
    ]));
    notifyFeature("Remixing cards: coming soon!");
  },
  'click .popout-button' (){
    trackEvent('Pop out card click', _.pick(this, [
      "_id",
      "authorId",
      "index",
      "source",
      //"storyId",
      "storyShortId",
      "type",
      "verticalId",
      "verticalIndex"
    ]));
    goRightOneCard();
    Session.set('poppedOutContextId', this._id); // in case there is only one card in the row, force it to pop out
    Session.set('poppedOutContextType', this.type);
  }
});

Template.display_twitter_section.events({
  "click .show-image"  (e, template) {
    template.$('.twitter-text-section').toggleClass('transparent');
  },
  "click .image-section"  (e, template) {
    template.$('.twitter-text-section').removeClass('transparent');
  },
  "mouseenter .twitter-section"  (e, template) {
    if (template.data.imgUrl) {
      template.$('.twitter-text-section').addClass('show-corner');
      template.$('.flag').addClass('show-corner');
    }
  },
  "mouseleave .twitter-section"  (e, template) {
    if (template.data.imgUrl) {
      template.$('.twitter-text-section').removeClass('show-corner');
      template.$('.flag').removeClass('show-corner');
    }
  }
});


var ytScriptLoaded;
var vimeoScriptLoaded;

var ytApiReady = new ReactiveVar(false);

Template.story.onCreated(function(){
  if(!ytScriptLoaded){
    $.getScript('https://www.youtube.com/iframe_api', function () {});
    ytScriptLoaded = true;
  }

  if(!vimeoScriptLoaded){
    $.getScript('https://f.vimeocdn.com/js/froogaloop2.min.js', function () {});
    vimeoScriptLoaded = true;
  }

  clearPoppedOutWidget();
  clearMostRecentWidget();
});

onYouTubeIframeAPIReady = function(){
  ytApiReady.set(true);
};

getVideoIFrame = function(contextId){
  return document.querySelector(".video-section[data-context-id='" + contextId + "'] iframe");
};


createWidget = function(){
  return {
    activated: function () {
      return this.activeSource ? true : false;
    },
    play(){
      switch (this.activeSource) {
        case 'youtube':
          this._youTubeWidget.playVideo();
          break;
        case 'vimeo':
          this._vimeoWidget.api('play');
          break;
        case 'soundcloud':
          this._soundcloudWidget.play();
          break;
        default:
          throw new Meteor.Error('popped out widget has no active source')
      }
    },
    pause(){
      switch (this.activeSource) {
        case 'youtube':
          this._youTubeWidget.pauseVideo();
          break;
        case 'vimeo':
          this._vimeoWidget.api('pause');
          break;
        case 'soundcloud':
          this._soundcloudWidget.pause();
          break;
        default:
          throw new Meteor.Error('popped out widget has no active source')
      }
    },
    isPlaying(cb){
      switch (this.activeSource) {
        case 'youtube':
          if(this._youTubeWidget && this._youTubeWidget.getPlayerState){
            var playing = _.contains([1,3], this._youTubeWidget.getPlayerState());
            return cb(playing);
          } else {
            console.log('yt widget not set up yet')
            return cb(false)
          }
        case 'vimeo':
          return this._vimeoWidget.api('paused', function(paused){
            return cb(!paused)
          });
        case 'soundcloud':
          return this._soundcloudWidget.isPaused(function(paused){
            return cb(!paused)
          });
        default:
          throw new Meteor.Error('popped out widget has no active source')
      }
    },
    isPaused(cb){
      switch (this.activeSource) {
        case 'youtube':
          var paused = this._youTubeWidget.getPlayerState() === 2;
          return cb(paused);
        case 'vimeo':
          return this._vimeoWidget.api('paused', cb);
        case 'soundcloud':
          return this._soundcloudWidget.isPaused(cb);
        default:
          throw new Meteor.Error('popped out widget has no active source')
      }
    },
    getMediaInfo(cb){
      switch (this.activeSource) {
        case 'soundcloud':
          return this._soundcloudWidget.getCurrentSound(cb);
      }
    },
    getPosition(cb){
      switch (this.activeSource) {
        case 'soundcloud':
          return this._soundcloudWidget.getPosition(cb);
      }
    },
    bind(){
      switch (this.activeSource) {
        case 'soundcloud':
          return this._soundcloudWidget.bind.apply(this._soundcloudWidget, arguments);
      }
    },
    unbind(){
      switch (this.activeSource) {
        case 'soundcloud':
          return this._soundcloudWidget.unbind.apply(this._soundcloudWidget, arguments);
      }
    },
    hasOwnPlayer(){
      switch (this.activeSource) {
        case 'soundcloud':
          return true;
        default:
          return false
      }
    },
    seekTo(millis){
      switch (this.activeSource) {
        case 'soundcloud':
          return this._soundcloudWidget.seekTo(millis);
        default:
          return false
      }
    }
  }
};

window.poppedOutWidget = createWidget();
window.mostRecentWidget = createWidget();

var makeYouTubeWidget = function(iframe, cb){
  if(ytApiReady.get()){
    cb(new YT.Player(iframe));
  } else {
    Tracker.autorun((c) =>{
      if(ytApiReady.get()){
        cb(new YT.Player(iframe));
        c.stop();
      }
    });
  }
}

window.setPoppedOutWidget = function (id){
  //var section =  document.querySelector(".audio-section[data-context-id='" + contextId + "']");

  var source = $(".display-context-section[data-context-id='" + id + "']").data('contextSource');

  poppedOutWidget.id = id;

  if (id === mostRecentWidget.id){ // if this is also the most recent card (probably)
    poppedOutWidget = mostRecentWidget; // the apis are already set up. just assign it
    return
  }

  poppedOutWidget = createWidget();


  Session.set('poppedOutContextType', (source === 'soundcloud') ? 'audio' : 'video');


  switch(source){
    case 'soundcloud':
      poppedOutWidget.activeSource = source;
      poppedOutWidget._soundcloudWidget = SC.Widget(getAudioIFrame(id));
      break;
    case 'youtube':
      makeYouTubeWidget(getVideoIFrame(id), (widget) => {
        poppedOutWidget.activeSource = source;
        poppedOutWidget._youTubeWidget = widget;
      });
      break;
    case 'vimeo':
      $f(getVideoIFrame(id)).addEvent('ready', function (id){
        poppedOutWidget.activeSource = source;
        poppedOutWidget._vimeoWidget = $f(id);
      });
      break;
  }
}

window.popInPoppedOutWidget = function(){
  mostRecentWidget = poppedOutWidget;
  clearPoppedOutWidget();
};

window.clearPoppedOutWidget = function(){
  poppedOutWidget = createWidget();
  Session.set('poppedOutContextId', null);
  Session.set('poppedOutContextType', null);
};

window.popOutMostRecentWidget = function(){
  if(poppedOutWidget.activated()){
    poppedOutWidget.pause();
  }
  poppedOutWidget = mostRecentWidget;
  Session.set('poppedOutContextId', mostRecentWidget.id);
  Session.set('poppedOutContextType', (mostRecentWidget.activeSource === 'soundcloud') ? 'audio' : 'video');
}

window.setMostRecentWidget = function (id){
  var source = $(".display-context-section[data-context-id='" + id + "']").data('contextSource');

  if (id === poppedOutWidget.id){ // if this is also the popped out card
    mostRecentWidget = poppedOutWidget; // the apis are already set up. just assign it
    mostRecentWidget.activeSource = source; // it make have been deactivated
    return
  }

  mostRecentWidget = createWidget();

  mostRecentWidget.id = id;

  if(source === 'soundfdsfsdfcloud'){
    mostRecentWidget.activeSource = source;
  } else {
    Meteor.setTimeout(() => {

      mostRecentWidget.activeSource = source;

      switch(source){
        case 'youtube':
          makeYouTubeWidget(getVideoIFrame(id), (widget) => {
            mostRecentWidget._youTubeWidget = widget;
          });
          break;
        case 'vimeo':
          $f(getVideoIFrame(id)).addEvent('ready', function (id){
            mostRecentWidget._vimeoWidget = $f(id);
          });
          break;
        case 'soundcloud':
          mostRecentWidget._soundcloudWidget = SC.Widget(getAudioIFrame(id));
          break;
      }
    }, 150); // hack to make sure video is in DOM when assign it.
  }

};

window.clearMostRecentWidget = function(){
  mostRecentWidget = createWidget();
};

getAudioIFrame = function(contextId){
  return document.querySelector(".audio-section[data-context-id='" + contextId + "'] iframe");
};

var widgetSetup = function(){
  this.autorun(() => {
    var currentXId = Session.get('currentXId');

    Tracker.nonreactive(() => {
      var previousXId = Session.get('previousXId');

      var isCurrent = this.data._id === currentXId;
      var isPoppedOut = this.data._id === Session.get('poppedOutContextId');
      var isMostRecent = this.data._id === mostRecentWidget.id;
      var isPrevious = this.data._id === previousXId;

      if(isCurrent){
        if (isPoppedOut){ // if this card was popped out
          if(!hiddenContextMode() || hiddenContextShown()){
            popInPoppedOutWidget(); // pop it back in
            return
          }
        } else {
          setMostRecentWidget(currentXId); // it's now the most recent card
        }
      } else {
        if((isPrevious || !previousXId) && !isPoppedOut && isMostRecent && mostRecentWidget.activated()){ // if this is the current widget
          mostRecentWidget.isPlaying(function(playing){
            if (playing){ // and it's playing
              popOutMostRecentWidget();
            }
          })
        }
      }
    });
  });
};

var widgetBreakdown= function(){
  if(mostRecentWidget.id === this.data.id){
    window.clearMostRecentWidget();
  }
};

var activeDisplayHelpers = {
  showActiveDisplay (){
    return Template.instance().activeDisplay.get();
  }
};

var activeDisplayWorker = function(){
  this.activeDisplay = new ReactiveVar();
  Tracker.autorun(()=>{
    var inActiveColumn = this.data.index === getXByYId(this.data.verticalId) && (!hiddenContextMode() || hiddenContextShown());

    if(inActiveColumn){
      this.activeDisplay.set(true);
    } else {
      Meteor.setTimeout(()=>{
        var isPoppedOut = poppedOut.call(this.data);
        var nowInActiveColumn = this.data.index === getXByYId(this.data.verticalId) && (!hiddenContextMode() || hiddenContextShown());

        if(!isPoppedOut && !nowInActiveColumn){
          this.activeDisplay.set(false);
        }
      }, 500);
    }
  })
};

Template.display_audio_section.onCreated(activeDisplayWorker);
Template.display_video_section.onCreated(activeDisplayWorker);

Template.display_audio_section.onRendered(widgetSetup);
Template.display_audio_section.onDestroyed(widgetBreakdown);

if(!Meteor.Device.isPhone()){
  Template.display_video_section.onRendered(widgetSetup);
  Template.display_video_section.onDestroyed(widgetBreakdown);
}

Template.display_audio_section.helpers(activeDisplayHelpers);
Template.display_video_section.helpers(activeDisplayHelpers);

clearPoppedOutWidget();

window.poppedOutPlayerInfo = new ReactiveDict;

var updatePlayProgress = function (e) {
  poppedOutPlayerInfo.set('currentPosition', e.currentPosition);
  poppedOutPlayerInfo.set('relativePosition', e.relativePosition);
};


Tracker.autorun(function(){
  var poppedOutContextId;
  if(poppedOutContextId = Session.get('poppedOutContextId')) {
    if(poppedOutWidget.id !== poppedOutContextId){
      setPoppedOutWidget(poppedOutContextId);
    }

    if(poppedOutWidget.hasOwnPlayer()){
      var updateBasicPlayerInfo = function(){
        poppedOutWidget.getMediaInfo(function (currentSound) {
          poppedOutPlayerInfo.set('title', currentSound.title);
          poppedOutPlayerInfo.set('duration', currentSound.duration);
          poppedOutWidget.isPlaying(function(isPlaying){
            poppedOutPlayerInfo.set('status', isPlaying ? 'playing' : 'paused');
          });
          poppedOutWidget.getPosition(function(position){
            poppedOutPlayerInfo.set('currentPosition', position);
            poppedOutPlayerInfo.set('relativePosition', position / currentSound.duration);
          });
        });
      };
    }

    trackEvent('Context popped out', { nonInteraction: 1 }); // we can't be sure the user initiated // TODO, be more specific about audio or video perhaps

    if(poppedOutWidget.hasOwnPlayer()) {
      // this only works for audio for now, but only audio has its own player
      updateBasicPlayerInfo();

      poppedOutWidget.bind(SC.Widget.Events.READY, updateBasicPlayerInfo);

      poppedOutWidget.bind(SC.Widget.Events.PLAY, function (e) {
        poppedOutPlayerInfo.set('status', 'playing');
        trackEvent('Popped out audio playing', { nonInteraction: 1 }); // we can't be sure the user initiated
      });

      poppedOutWidget.bind(SC.Widget.Events.PAUSE, function (e) {
        poppedOutPlayerInfo.set('status', 'paused');
        trackEvent('Popped out audio pausing', { nonInteraction: 1 }); // we can't be sure the user initiated
      });

      poppedOutWidget.bind(SC.Widget.Events.FINISH, function (e) {
        poppedOutPlayerInfo.set('status', 'paused');
        poppedOutPlayerInfo.set('currentPosition', poppedOutPlayerInfo.get('duration'));
        poppedOutPlayerInfo.set('relativePosition', 1);
        trackEvent('Popped out audio finished', { nonInteraction: 1 });
      });

      poppedOutWidget.bind(SC.Widget.Events.PLAY_PROGRESS, _.throttle(updatePlayProgress, 200))
    }
  } else {
    if (poppedOutWidget.hasOwnPlayer()){
      poppedOutWidget.unbind(SC.Widget.Events.READY);
      poppedOutWidget.unbind(SC.Widget.Events.PLAY);
      poppedOutWidget.unbind(SC.Widget.Events.PAUSE);
      poppedOutWidget.unbind(SC.Widget.Events.FINISH);
      poppedOutWidget.unbind(SC.Widget.Events.PLAY_PROGRESS);
    }
  }
});

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}


Template.audio_popout.helpers({
  title (){
    return poppedOutPlayerInfo.get('title');
  },
  totalTime (){
    return millisToMinutesAndSeconds(poppedOutPlayerInfo.get('duration'));
  },
  currentTime (){
    var currentPosition;
    if(currentPosition = poppedOutPlayerInfo.get('currentPosition')){
      return millisToMinutesAndSeconds(currentPosition);
    } else {
      return "0:00"
    }
  },
  showPauseButton (){
    return poppedOutPlayerInfo.get('status') === 'playing';
  }
});

var updateAudioPosition = function(e, t){
  var millis = Math.min(e.currentTarget.value / 1000, 0.99) * poppedOutPlayerInfo.get('duration'); // min prevents scrub to end weirdness
  poppedOutWidget.seekTo(millis);
  poppedOutWidget.isPlaying(function(isPlaying){
    if(!isPlaying){
      poppedOutWidget.play();
    }
  });
}

Template.audio_popout.events({
  'click .play' (){
    poppedOutWidget.play();
  },
  'click .pause' (){
    poppedOutWidget.pause();
  },
  'change .progress': updateAudioPosition,
  'input .progress' (e,t) {
    if(Meteor.Device.isPhone()){
      poppedOutWidget.pause();
    } else {
      updateAudioPosition(e,t);
    }
  },
  "click .dismiss-popout" (e, t) {
    if(poppedOutWidget.activated()){
      poppedOutWidget.pause();
    }
    clearPoppedOutWidget();
    trackEvent('Click dismiss popout button');
  }
});

Template.audio_popout.onRendered(function(){
  this.autorun(() => {
    var relativePosition = poppedOutPlayerInfo.get('relativePosition');
    if(typeof relativePosition === 'number'){
      this.$('input.progress').val(relativePosition * 1000);
    }
  });
});





Template.create_story.events({
  'click' (){
    if (Meteor.user()){
      var accessPriority = Meteor.user().accessPriority;
      if (accessPriority && accessPriority <= window.createAccessLevel){

        var shortId = Random.id(8);
        var verticalSectionId = Random.id(9);

        Meteor.call('createStory',shortId, verticalSectionId, function(err, pathObject){
          if (err) {
            notifyError(err);
            throw(err);
          }
          trackEvent('User clicked create and created story');

        })
      } else {
        notifyInfo("Due to high demand, we had to turn off 'create new story' functionality for a moment. Stay tuned for updates!");
      }
    } else {
      Session.set('signingIn', "You're almost there!\nPlease sign in to make a story.")
      trackEvent('User clicked create and needs to sign in');
    }
  }
});


Template.read.onCreated(function(){

  // analytics autorun
  this.autorun(function(){
    if (!Session.equals("currentY", null)){
      var y = Session.get("currentY");
      var storyLength = Session.get("story").verticalSections.length;
      trackEvent('View vertical narrative section', {
        label: y,
        verticalNarrativeIndex: y,
        storyLength: storyLength,
        verticalNarrativeFraction: (y + 1) / storyLength,
        storyId: Session.get("storyId")
      })
    }
  });



  this.autorun(() => {
    if(adminMode()){
      this.subscribe('adminOtherUserPub', this.data.authorId);
    } else {
      this.subscribe('minimalUsersPub', [this.data.authorId]);
    }
  });
});


var activityAnalyticsKeys = ['activeHeartbeats', 'anchorClicks', 'contextInteractions'];

var analyticsCount = {
  'activeHeartbeats': {},
  'anchorClicks':{},
  'contextInteractions': {}
};
var analyticsCountSent = {
  'activeHeartbeats': {},
  'anchorClicks':{},
  'contextInteractions': {}
};

subtractSentAnalyticsCount = function(){
  _.each(activityAnalyticsKeys, function(topLevelKey){
    _.each(_.keys(analyticsCountSent[topLevelKey]), function(k){
      analyticsCount[topLevelKey][k] = analyticsCount[topLevelKey][k] - analyticsCountSent[topLevelKey][k];
      if(!analyticsCount[topLevelKey][k]){
        delete analyticsCount[topLevelKey][k]
      }
    });
  });

  analyticsCountSent = {
    'activeHeartbeats': {},
    'anchorClicks':{},
    'contextInteractions': {}
  }; // this makes the function safe to run multiple times
};

var sendAnalyticsInterval = 30000;


analyticsCountSender = function(doOnce){
  if(_.chain(analyticsCount).values().all(_.isEmpty).value()){
    console.log('nothing to send')
    if(!doOnce){
      Meteor.setTimeout(analyticsCountSender, sendAnalyticsInterval);
    }
    return
  }
  analyticsCountSent = _.clone(analyticsCount);
  console.log('sending:')
  console.log(analyticsCountSent)
  Meteor.call('countStoryAnalytics', Session.get('storyId'), analyticsCountSent, function(err){
    if(err){
      console.warn('Failed to send analytics');
    } else {
      subtractSentAnalyticsCount();
    }
    if(!doOnce){
      Meteor.setTimeout(analyticsCountSender, sendAnalyticsInterval);
    }
  });
};

Meteor.startup(function(){
  Meteor.setTimeout(analyticsCountSender, sendAnalyticsInterval);
  $(window).bind('beforeunload', function(){
    subtractSentAnalyticsCount(); // in case there is already a count pending don't double-do it
    analyticsCountSender(true);
  })
});

window.userInactiveCount = 0;
var inactiveThreshold = 15;

$(window).bind('mousemove mouseup touchstart touchend touchmove keyup scroll resize', function(){
  userInactiveCount = 0;
});

window.addActiveHeartbeat = function(key){
  analyticsCount.activeHeartbeats[key] = (analyticsCount.activeHeartbeats[key] || 0) + 1;
};

window.countAnchorClick = function(key){
  analyticsCount.anchorClicks[key] = (analyticsCount.anchorClicks[key] || 0) + 1;
  console.log(analyticsCount.anchorClicks[key])
};

window.countContextInteraction = function(key){
  analyticsCount.contextInteractions[key] = (analyticsCount.contextInteractions[key] || 0) + 1;
};

Template.read.onRendered(function(){

  if(sandwichMode()){
    updateCurrentY();
  } else {
    $(window).scrollTop(Session.get('scrollTop'));
  }


  this.heartbeatInterval = Meteor.setInterval(function(){
    var currentYId = Session.get('currentYId');
    var currentXId = Session.get('currentXId');
    var poppedOutContextId = Session.get('poppedOutContextId');

    var poppedOutPlayerActive = poppedOutContextId && poppedOutPlayerInfo.get('status') === 'playing';
    var userActive = !document.hidden && userInactiveCount < inactiveThreshold;

    userInactiveCount += 1;

    if(poppedOutPlayerActive) {
      addActiveHeartbeat(poppedOutContextId);
    }

    if(userActive){
      if(currentYId){
        addActiveHeartbeat(currentYId);

        if(currentXId){ // can only truly have active context if have active narrative. currentXId may have a value when viewing header
          addActiveHeartbeat(currentXId);
        }
      } else {
        if (!Session.get('pastHeader')){
          addActiveHeartbeat('header');
        } else if (Session.get("currentY")) { // if no currentYId, but there is currentY, then it's at the footer
          addActiveHeartbeat('footer');
        }
      }
    }

    if (userActive || poppedOutPlayerActive){
      addActiveHeartbeat('story');
    }

  }, 1000);
});

Template.read.onDestroyed(function(){
  $(window).scrollTop(Session.get('scrollTop'));
  Meteor.clearInterval(this.heartbeatInterval);

  // send all existing heartbeats when leave a story
  subtractSentAnalyticsCount(); // in case there is already a count pending don't double-do it
  analyticsCountSender(true);

  unfreezePageScroll();
});

Template.read.helpers({
  showMobileEmbedPlaceholder () {
    return Meteor.Device.isPhone() && embedMode();
  }
});


Template.context_overlay.helpers({
  overlaidContext (){
    var id = Session.get('contextOverlayId');
    if(Session.get('showDraft')) {
      return ContextBlocks.findOne(id);
    } else {
      return newTypeSpecificContextBlock(_.findWhere(this.contextBlocks, {_id: id}));
    }
  },
  contextLoaded (){
    return Template.instance().contextLoaded.get();
  },
  textContent (){
    return _.escape(this.content).replace(/\n/g, "<br>")
  }
});

Template.context_overlay.onCreated(function(){
  this.contextLoaded = new ReactiveVar();
});

Template.context_overlay.onRendered(function(){
  this.contextLoaded.set(false);
  $('img, video').load(() => {
    this.contextLoaded.set(true);
  });
  freezePageScroll();
});

Template.context_overlay.onRendered(function(){
  if(mobileOrTablet()) {
    this.$('.context-overlay').hammer(hammerDoubleTapOptions).bind('doubletap', () => {
      Session.set('contextOverlayId', null);
    });
  }
});

Template.context_overlay.onDestroyed(function(){
  if(mobileOrTablet()) {
    this.$('.context-overlay').hammer(hammerDoubleTapOptions).unbind('doubletap');
  }
});

Template.context_overlay.onDestroyed(function(){
  if(!hiddenContextMode() && !hiddenContextShown()){
    unfreezePageScroll();
  }
});

Template.context_overlay.events({
  'click'  () {
    Session.set('contextOverlayId', null);
  },
  'scroll'  (e) {
    e.preventDefault();
    e.stopPropagation();
    return false
  }
});

Template.loading_page.onRendered(function(){
  $(window).scrollTop(0);
});
