var getCardWidth, horizontalBlockHelpers, throttledResize, typeHelpers;


UI.registerHelper('selectedIf', function(val) {
  return val ? 'selected' : '';
});


getCardWidth = function(windowWidth) {
  if (Meteor.Device.isPhone()){
    return Session.get("windowWidth") - 2* getVerticalLeft();
  } else if (windowWidth <= window.constants.minPageWidth) {
    return 400;
  } else {
    return Math.min(520, (windowWidth - (16 * 3) - (88 * 2)) / 2);
  }
};

Session.set("separation", 20);

var windowSizeDep = new Tracker.Dependency();

Meteor.startup(function(){
  Tracker.autorun(function(){
    windowSizeDep.depend();

    var windowWidth = $(window).width();

    // Safari changes window size in a weird way that jquery doesn't register correctly when scroll up vs down
    Session.set("windowHeight", Meteor.Device.isPhone() && !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ? window.innerHeight : $(window).height());

    Session.set("minimapMaxHeight", Session.get("windowHeight") - 592);

    Session.set("windowWidth", windowWidth);

    var cardWidth = getCardWidth(windowWidth);

    Session.set("cardWidth", cardWidth);

    Session.set("verticalLeft", Session.get('mobileContextView') ? getVerticalLeft(windowWidth) - cardWidth : getVerticalLeft(windowWidth));

    if (Meteor.Device.isPhone()) {
      document.body.style.overflowX = "hidden";
      $('body').css('max-width', windowWidth);
      Session.set("mobileMargin", getVerticalLeft(windowWidth));
    }
  });

  Tracker.autorun(function(){
    if (Session.get('mobileContextView')){
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto"; // TODO is this helping?
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
    if(Router.current()){
      return Router.current().route.getName();
    }
  });
});


window.hammerSwipeOptions = {
  pointers:	1,
  threshold: 8,
  velocity:	0.25 // 0.65
};


var scrollPauseArmed = false;
var scrollPauseLength = 700;

window.updateCurrentY = function() {
  var actualY, h, i, readMode, scrollTop, stickyTitle, vertTop, _i, _len, _ref;
  scrollTop = $(document).scrollTop();
  Session.set("scrollTop", scrollTop);

  readMode = window.constants.readModeOffset - 1;

  stickyTitle = 120;
  $("div#banner-overlay").css({
    opacity: Math.min(1.0, scrollTop / readMode)
  });
  $(".horizontal-context").css({
    opacity: 0.5 + Math.min(1.0, scrollTop / readMode) / 2
  });
  if (scrollTop >= readMode){
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

  if (scrollTop >= readMode) {
    $("div.title-overlay, div#banner-overlay").addClass("fixed");
    Session.set("pastHeader", true);
    $("div.horizontal-context").addClass("fixed");

    if(scrollPauseArmed){
      document.body.style.overflowY = 'hidden';
      $(document).scrollTop(readMode);
      Meteor.setTimeout(function () {
        document.body.style.overflowY = 'auto';
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


  if (scrollTop >= readMode) {
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
  if(!story){
    return
  }
  var verticalSection = story.verticalSections[currentY];
  if(!verticalSection){
    return
  }
  var currentX = getXByYId(verticalSection._id);
  if(typeof currentX === 'number'){
    var currentContextBlockId = verticalSection.contextBlocks[currentX];
    if (currentContextBlockId) {
      return Session.set('currentXId', currentContextBlockId);
    }
  }
  return Session.set('currentXId', null);
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
    cheat: function() {
      $('body').addClass('konami');
    }
  });
  $( window ).konami({
    code : [70, 79, 76, 68, 65, 68, 77, 73, 78],
    cheat: function() {
      Session.set('adminMode', true);
    }
  });

});



typeHelpers = {
  text: function() {
    return this.type === "text";
  },
  image: function() {
    return this.type === "image";
  },
  gif: function() {
    return this.type === "gif";
  },
  map: function() {
    return this.type === "map";
  },
  video: function() {
    return this.type === "video";
  },
  viz: function() {
    return this.type === "viz";
  },
  twitter: function() {
    return this.type === "twitter";
  },
  audio: function() {
    return this.type === "audio";
  },
  link: function() {
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
  title: function() {
    if (this.title) {
      return this.title;
    } else {
      return Session.get("storyTitle");
    }
  },
  profileUrl: function(){
    return '/profile/' + (this.authorDisplayUsername || this.authorUsername); // TODO migrate and only use authorDisplayUsername
  },
  author: function(){
    return Meteor.users.findOne(this.authorId)
  }
});

Template.story_header.events = {
  "click #to-story": function() {
    $('#to-story, .attribution').fadeOut();
    goToX(0);
    return goToY(0);
  },
  "click #banner-overlay": function() {
    if (!Session.get("pastHeader")) {
      $('#to-story, .attribution').fadeOut();
      goToX(0);
      return goToY(0);
    }
  },
  "keydown": function (e) {
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
  pastHeader: function() {
    return Session.get("pastHeader");
  },

  metaviewOpen: function() {
    return Session.get("metaview")
  },
  showMinimap: function() {
    return Session.get("showMinimap") && (!Meteor.Device.isPhone());
  },
  showMobileMinimap: function() {
    return Session.get("showMinimap") && (Meteor.Device.isPhone());
  },
  showContextOverlay: function(){
    return Session.get('contextOverlayId');
  }
});

Template.story_title.helpers({
  storyTitleDiv: function(){
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
  notFirst: function() {
    return !Session.equals("currentY", 0);
  },
  verticalSelected: function() {
    return Session.equals("currentY", this.index) && Session.get("pastHeader") || Session.equals("currentY", null) && this.index === 0;
  },
  validTitle: function() {
    return this.title === !"title";
  },
  titleDiv: function() {
    var initialClasses = Session.get('showDraft') ? 'title notranslate' : 'title';
    if (Session.get('read')) {
      return '<div class="' + initialClasses + '" dir="auto">' + _.escape(this.title) + '</div>';
    } else {
      // this is contenteditable in edit mode
      return '<div class="editable ' + initialClasses + '" placeholder="Title" contenteditable="true" dir="auto">' + _.escape(this.title) + '</div>';
    }
  },
  // NOTE: contentDiv is weird because the user edits its content but it's not reactive. be careful. if it's made reactive without updating it's semi-reactive contents accordingly, user will lose content
  contentDiv: function() {
    var initialClasses = Session.get('showDraft') ? 'content notranslate' : 'content';
    if (Session.get('read')) {
      return '<div class="' + initialClasses + '" dir="auto">' + cleanVerticalSectionContent(this.content) + '</div>';
    } else {
      // nonReactiveContent preserves browser undo functionality across saves
      // this is contenteditable in edit mode
      return '<div class="editable fold-editable ' + initialClasses + '" placeholder="Type your text here." contenteditable="true" dir="auto">' + cleanVerticalSectionContent(Template.instance().semiReactiveContent.get()) + '</div>';
    }
  }
});

Template.vertical_narrative.helpers({
  verticalSectionsWithIndex: function() {
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
  "click": function(e, t) {
    var afterGoToY;
    var enclosingAnchor;
    var that = this;

    if($(e.target).is('div')){
      // do nothing
    } else if (enclosingAnchor = $(e.target).closest('a')){
      var contextId = $(enclosingAnchor).data('contextId');

      e.preventDefault();
      afterGoToY = function(){
        goToContext(contextId);
      };
      Meteor.setTimeout(function(){
        trackEvent('Click context anchor', _.extend({}, window.trackingInfoFromStory(Session.get('story')), {
          verticalIndex: that.index,
          contextId: contextId,
          contextType: $(e.currentTarget).data('contextType'),
          contextSource: $(e.currentTarget).data('contextSource'),
          numberOfContextCardsOnVertical: that.contextBlocks.length,
          inReadMode: Session.get('read')
        }));
      });
    }

    goToY(t.data.index, {complete: afterGoToY});

  }
});

Template.story.onCreated(function(){
  $(document).on('scroll', throttledScrollUpdate);
});

Template.story.onDestroyed(function(){
  $(document).off('scroll', throttledScrollUpdate);
});


Template.story.onRendered(function(){
  // TODO destroy bindings later?
  if(Meteor.Device.isPhone() || Meteor.Device.isTablet()){
    this.$('.entire-story').hammer(hammerSwipeOptions).bind('swipeleft',function(){
        if(horizontalExists()){
          if (Meteor.Device.isTablet() || Session.get('mobileContextView')){
            goRightOneCard();
          } else {
            Session.set('mobileContextView', true);
          }
        }
      }
    );

    this.$('.entire-story').hammer(hammerSwipeOptions).bind('swiperight',function(){
        if(Meteor.Device.isTablet()){
          if(horizontalExists()){
            goLeftOneCard();
          }
        } else {
          Session.set('mobileContextView', false);
        }
      }
    );
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


  //var originalVerticalSections = that.data.verticalSections;

  //var newVerticalSections = []
  //_.map(newVerticalSectionIDs, function(id, i) {
  //  var newVerticalSection = _.findWhere(originalVerticalSections, {_id: id});
  //  newVerticalSection.contextBlocks = newContextBlocks[i];
  //  newVerticalSections.push(newVerticalSection);
  //});
  //Meteor.call('saveStory', {_id: Session.get("storyId")}, {$set: {'draftStory.verticalSections': newVerticalSections}})
};

Template.metaview.onRendered(function() {
  document.body.style.overflow = 'hidden'; // prevent document scroll while in metaview
  var that = this;
  this.$(".sortable-rows").sortable({
    stop: saveMetaviewOrdering
  });
  this.$(".sortable-blocks").sortable({
    connectWith: ".sortable-blocks",
    stop: function() {
      resetXPositionMemory(); // prevent XId stuff from getting all crazy
      saveMetaviewOrdering();
    }
  });

  this.$(".sortable-rows, .sortable-blocks").disableSelection();
});

Template.metaview.onDestroyed(function() {
  document.body.style.overflow = 'auto';
});

Template.metaview.events({
  "click .close": function(d, t) {
    Session.set("metaview", false);
  },
  "click": function(d, t) {
    d.preventDefault();
  },
  // these lines below prevent mouseout and mouseover from getting to other dom elements that will release the scroll lock
  mouseover: function(d){
    d.preventDefault();
    d.stopPropagation();
  },
  mouseout: function(d){
    d.preventDefault();
    d.stopPropagation();
  }
})

Template.metaview_context_block.helpers(typeHelpers)

Template.metaview.helpers({
  verticalSectionsWithIndex: function() {
    return this.verticalSections.map(function(v, i) {
      return _.extend(v, {
        index: i
      });
    });
  },
  horizontalSections: function() {
    var blocks = this.contextBlocks
       .map(function(id) {
         return ContextBlocks.findOne({ // by finding one at a time, this keeps in broken links. TO-DO maybe should find a better soln that uses $in
           _id: id
         }) || {_id: id}; // fallback to just having id if cannot find
       });
    return blocks;
  },
  textContent: function(){
    return $($.parseHTML(this.content)).text();
  }
});

Template.minimap.events({
  "click .minimap": function(d, t) {
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
  horizontalSectionsMap: function() {
    return Session.get("horizontalSectionsMap");
  },
  selectedX: function() {
    return Session.equals("currentX", this.horizontalIndex);
  },
  selectedY: function() {
    return Session.equals("currentY", this.verticalIndex);
  },
  minimapLargeEnough: function() {
    // Ensure minimap height is greater than 0 and sections are at least 5 pixels tall
    if (Session.get("minimapMaxHeight") <= 0 || (Session.get("minimapMaxHeight") / Session.get("horizontalSectionsMap").length < 5)) {
      return false;
    } else {
      return true;
    }
  },
  responsive: function() {
    var maxHeight = Session.get("minimapMaxHeight");
    var defaultSectionHeight = 17 + 5;  // Section height + margin-bottom
    return (Session.get("horizontalSectionsMap").length * defaultSectionHeight >= maxHeight)
  },
  sectionHeight: function() {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.75;  // 75% of available space
  },
  verticalCardWidth: function() {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.75 * 1.53333;  //  1.53333 aspect ratio
  },
  horizontalCardWidth: function() {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.75 * 0.7645 * 1.53333;  // Horizontal block is 76.45% of section
  },
  sectionMargin: function() {
    var maxHeight = Session.get("minimapMaxHeight");
    return (maxHeight / Session.get("horizontalSectionsMap").length) * 0.25;  // 25% of available space (33% of section)
  },
  showActivity: function(){
    return adminMode();
  },
  activityLevel: function(){
    var story = new Story(Session.get('story'));
    var activeHeartbeats = (this.activeHeartbeats || 0);
    var maxActiveHeartbeats = story.maxActiveHeartbeats();
    return Math.pow( activeHeartbeats / maxActiveHeartbeats , 0.5) * 100;
  }
});

Template.mobile_minimap.helpers({
  verticalSelectedArray: function() {
    var currentYId = Session.get('currentYId')
    return _.map(this.verticalSections, function(v){
      return {selected: currentYId === v._id};
    });
  },
  horizontalSelectedArray: function() {
    var currentXId = Session.get('currentXId');
    var currentY = Session.get('currentY');
    var mobileContextView = Session.get('mobileContextView');
    if (this.verticalSections[currentY]){
      return _.map(this.verticalSections[currentY].contextBlocks, function(cId){
        return {selected: mobileContextView && (currentXId === cId)};
      });
    } else {
      return [];
    }
  },
  horizontalWidth: function(){
    return Session.get('windowWidth') - Session.get('mobileMargin');
  },
  verticalHeight: function(){
    return Session.get('windowHeight') - Session.get('mobileMargin');
  }
});

Template.horizontal_context.events({
  click: function () {
    if(Session.equals('currentY', null)){
      goToY(0);
    }
  }
});
Template.horizontal_context.helpers({
  verticalExists: function() {
    return Session.get("horizontalSectionsMap").length;
  },
  horizontalSections: function() {
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
  last: function() {
    var lastIndex, _ref;
    lastIndex = ((_ref = Session.get("horizontalSectionsMap")[Session.get("currentY")]) != null ? _ref.horizontal.length : void 0) - 1;
    return (this.index === lastIndex) && (lastIndex > 0);
  },
  horizontalSectionInDOM: function() {
    // on this row, or this card is the current X for another hidden row
    return Session.equals("currentY", this.verticalIndex) || (Session.equals("currentY", null) && this.verticalIndex === 0 && !Meteor.Device.isPhone() && !window.isSafari) || this._id === Session.get('poppedOutContextId') || this.type === 'audio';
  },
  horizontalShown: function() {
    return Session.equals("currentY", this.index) || (Session.equals("currentY", null) && this.verticalIndex === 0 && !Meteor.Device.isPhone());
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

horizontalBlockHelpers = _.extend({}, typeHelpers, {
  selected: function() {
    // return Session.equals("currentX", this.index) && !Session.get("addingContext");
    //    return this.index === getXByYId(this.verticalId) && !Session.get("addingContext") || this._id === Session.get('poppedOutContextId');
    //console.log(this.verticalIndex === 0 && Session.get('currentY') == null && this.index === getXByYId(this.verticalId))
    return (this.index === getXByYId(Session.get('currentYId')) || (this.verticalIndex === 0 && Session.get('currentY') == null && this.index === getXByYId(this.verticalId)) && !Session.get("addingContext"))
      || this._id === Session.get('poppedOutContextId');
  },
  poppedOut: function(){
    return this.type === 'audio' && this._id === Session.get('poppedOutContextId');
  },
  textContent: function() {
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

// TODO get swipes on context cards to work
//Template.horizontal_section_block.onRendered(function(){
//  //
//  if(Meteor.Device.isPhone()) {
//    this.$('.horizontal-narrative-section').first().hammer(hammerSwipeOptions).bind('swipeleft',function(){
//        window.goRightOneCard();
//      }
//    );
//
//    this.$('.horizontal-narrative-section').first().hammer(hammerSwipeOptions).bind('swiperight',function(){
//        window.goLeftOneCard();
//      }
//    );
//  }
//});

Template.horizontal_section_block.events({
  'click .mobile-context-back-button': function(e, t){
    Session.set('mobileContextView', false);
    trackEvent('Click mobile back button');
  }
});

Template.horizontal_section_block.helpers(horizontalBlockHelpers);

// Magic layout function
Template.horizontal_section_block.helpers({
  left: getHorizontalLeft,
  lastUpdate: function() {
    Session.get('lastUpdate');
  },
  hide: function() {
    return !Session.equals("currentY", this.verticalIndex) && !(Session.equals("currentY", null) && this.verticalIndex === 0) && !(this._id === Session.get('poppedOutContextId'));
  },

  hideContainer: function() {
    return this.type === 'audio' && this._id === Session.get('poppedOutContextId') && !(Session.equals("currentY", this.verticalIndex) || Session.equals("currentY", null) && this.verticalIndex === 0);
  }
});

editableDescriptionEventsBoilerplate = function(meteorMethod) {
  return { 
    "blur .text-content.editable": function(d, template) {
      var that = this;
      if (!Session.get('read') && !Session.get('addingContext')) {
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, that._id, textContent, saveCallback);
      }
    },
    "mouseenter .text-content.editable": function(d, template) {
      document.body.style.overflow = 'hidden';
    },
    "mouseleave .text-content.editable": function(d, template) {
      document.body.style.overflow = 'auto';
    },
    "keypress .image-section .text-content.editable": function(e, template) { // save on Enter
      var that = this;
      if (!Session.get('read') && !Session.get('addingContext') && e.which === 13 ) {
        e.preventDefault();
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, that._id, textContent, saveCallback);
      }
    }
  }
};

Template.display_viz_section.helpers(horizontalBlockHelpers);

Template.display_image_section.onCreated(editableDescriptionCreatedBoilerplate);
//Template.display_image_section.onCreated(editableDescriptionDestroyedBoilerplate('editHorizontalBlockDescription'));
Template.display_image_section.helpers(horizontalBlockHelpers);
Template.display_image_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));
Template.display_image_section.events({
    'click': function (e, t) {
      if (Session.get('read') && !($(e.target).is('a')) && !Meteor.Device.isPhone()){
        Session.set('contextOverlayId', this._id);
        trackEvent('Expand image card');
      }
    }
  }
);

Template.display_audio_section.helpers(horizontalBlockHelpers);

Template.display_video_section.helpers(horizontalBlockHelpers);

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
  editingTitle: function(){
    return Template.instance().editingTitle.get()
  },
  editingDescription: function(){
    return Template.instance().editingDescription.get()
  },
  editThumbnailPrompt: function(){
    return !Session.get('read');
  },
  uploadingThumbnail: function(){
    return Template.instance().uploadingThumbnail.get();
  }
});
Template.display_link_section.events({
  'click a': function (e, t) {
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
  'click div.link-title': function(e,t){
    if(!Session.get('read') && !Session.get('addingContext')){
      t.editingTitle.set(true);
      Meteor.setTimeout(function(){
        t.$('.link-title').select();
      })
    }
  },
  'blur textarea.link-title': function(e,t){
    var that = this;
    if(!Session.get('read') && !Session.get('addingContext')){
      Session.set('saveState', 'saving');
      Meteor.call('editLinkTitle', that._id, t.$('textarea.link-title').val(), function(err, result){
        if(result){
          t.editingTitle.set(false);
        }
        saveCallback(err, result)
      });
    }
  },
  'click div.link-description': function(e,t){
    if(!Session.get('read') && !Session.get('addingContext')){
      t.editingDescription.set(true);
      Meteor.setTimeout(function(){
        t.$('.link-description').select();
      })
    }
  },
  'blur textarea.link-description': function(e,t){
    var that = this;
    if(!Session.get('read') && !Session.get('addingContext')){
      Session.set('saveState', 'saving');
      Meteor.call('editLinkDescription', that._id, t.$('textarea.link-description').val(), function(err, result){
        if(result){
          t.editingDescription.set(false);
        }
        saveCallback(err, result)
      });
    }
  },
  "click input[type=file]": function(d, template) {
    return template.editingThumbnail.set(true);
  },
  "change input[type=file]": function(e, template){
    var that = this;
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
      Cloudinary.upload([file], {}, function(err, doc) {
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
          Meteor.call('editLinkThumbnail', that._id, cloudinaryImageInfo, function(err, result){
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
  showLeftArrow: function() {
    return !Meteor.Device.isPhone() && (Session.get("currentX") !== 0 || Session.get("wrap")[Session.get('currentYId')]);
  },
  showRightArrow: function() {
    return !Meteor.Device.isPhone();
  }
});

Template.story_browser.events({
  "click .right": function(d) {
    window.goRightOneCard();
    trackEvent('Click right arrow');
  },
  "click .left": function(d) {
    window.goLeftOneCard();
    trackEvent('Click left arrow');
  }
});

Template.type_specific_icon.helpers(typeHelpers);


Template.share_buttons.events({
  'click .share-facebook': function(e, t) {
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
  },
  'click .share-twitter': function(e, t) {
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
  },
  'click .share-embed': function(e, t) {
    notifyFeature('Embedding: coming soon!');
    trackEvent('Click embed button');
  }
});


Template.follow_button.helpers({
  additionalClasses: function() {
    var classes = '';

    if (Template.instance().justFollowed.get()){
      classes += 'just-followed'
    }
    if (Template.instance().justUnfollowed.get()){
      classes += 'just-unfollowed'
    }
    return classes;
  },
  userFollowing: function(){
    return Meteor.user() && _.contains(Meteor.user().profile.following, Template.instance().data.userId);
  },
  isYou: function(){
    return Meteor.userId() === Template.instance().data.userId;
  }
});

Template.follow_button.onCreated(function() {
  this.justFollowed = new ReactiveVar();
  this.justUnfollowed = new ReactiveVar();
});
Template.follow_button.events({
  "click .follow": function (e, t) {
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
  "click .unfollow": function (e, t) {
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
  additionalClasses: function() {
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
  "click .favorite": function (e, t) {
    trackEvent('Click favorite button');

    if (!Meteor.user()) {
      openSignInOverlay('Thanks for showing your love!\nPlease sign in to favorite this FOLD.');
      return
    }
    var that = this;
    t.justFavorited.set(true);
    Meteor.setTimeout(function () {
      t.justFavorited.set(null);
    }, 700);

    return Meteor.call('favoriteStory', that._id, function (err) {
      if (err) {
        notifyError(err);
        throw(err);
      } else {
        trackEvent('Favorite story');
      }

    })

  },
  "click .unfavorite": function (e, t) {
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
  "click .pick": function() {
    return Meteor.call('designateEditorsPick', this._id, function(err) {
      if (err) {
        notifyError(err);
        throw(err);
      }
    });
  },
  "click .unpick": function() {
    return Meteor.call('stripEditorsPick', this._id, function(err) {
      if (err) {
        notifyError(err);
        throw(err);
      }
    });
  }
});



Template.remix_bar.helpers({
  showPopoutButton: function(){
    return this.type === 'audio';
  }
});

Template.remix_bar.events({
  'click .remix-button': function(){
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
  'click .popout-button': function(){
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
  }
});

Template.display_twitter_section.events({
  "click .show-image" : function(e, template) {
    template.$('.twitter-text-section').toggleClass('transparent');
  },
  "click .image-section" : function(e, template) {
    template.$('.twitter-text-section').removeClass('transparent');
  },
  "mouseenter .twitter-section" : function(e, template) {
    if (template.data.imgUrl) {
      template.$('.twitter-text-section').addClass('show-corner');
      template.$('.flag').addClass('show-corner');
    }
  },
  "mouseleave .twitter-section" : function(e, template) {
    if (template.data.imgUrl) {
      template.$('.twitter-text-section').removeClass('show-corner');
      template.$('.flag').removeClass('show-corner');
    }
  }
});


window.poppedOutAudioCardWidget = null;

window.mostRecentAudioCardWidget = null;
window.mostRecentAudioCardId = null;

getAudioIFrame = function(contextId){
  return document.querySelector(".audio-section[data-context-id='" + contextId + "'] iframe");
};

Tracker.autorun(function() {
  var currentXId = Session.get('currentXId');
  var mobileContextView = Session.get('mobileContextView');

  Tracker.nonreactive(function(){
    if (currentXId === Session.get('poppedOutContextId')){ // if new card is popped out audio
      if(!Meteor.Device.isPhone() || mobileContextView){
        Session.set('poppedOutContextId', null);  // new card was previously popped out, so pop it back in
      }
    } else if(mostRecentAudioCardWidget){ // otherwise there is a most recent audio card
      var associatedAudioCardId = mostRecentAudioCardId;
      mostRecentAudioCardWidget.isPaused(function(paused){
        if (!paused){ // and it's playing
          Session.set('poppedOutContextId', associatedAudioCardId);  // pop it out
        }
      })
    }
    var audioIFrame;
    if (currentXId && (audioIFrame = getAudioIFrame(currentXId))){ // also, if the new card is an audio card
      window.mostRecentAudioCardWidget = SC.Widget(audioIFrame); // it's now the most recent audio card
      window.mostRecentAudioCardId = currentXId;
    } else {
      window.mostRecentAudioCardWidget = null;
      window.mostRecentAudioCardId = null;
    }
  })
});

Session.set('poppedOutContextId', null);

window.poppedOutPlayerInfo = new ReactiveDict;

var updatePlayProgress = function (e) {
  poppedOutPlayerInfo.set('currentPosition', e.currentPosition);
  poppedOutPlayerInfo.set('relativePosition', e.relativePosition);
};

Tracker.autorun(function(){
  var poppedOutContextId;
  if(poppedOutContextId = Session.get('poppedOutContextId')) {
    poppedOutAudioCardWidget = SC.Widget(getAudioIFrame(poppedOutContextId));
    var updateBasicPlayerInfo = function(){
      poppedOutAudioCardWidget.getCurrentSound(function (currentSound) {
        poppedOutPlayerInfo.set('title', currentSound.title);
        poppedOutPlayerInfo.set('duration', currentSound.duration);
        poppedOutAudioCardWidget.isPaused(function(isPaused){
          poppedOutPlayerInfo.set('status', isPaused ? 'paused' : 'playing');
        });
        poppedOutAudioCardWidget.getPosition(function(position){
          poppedOutPlayerInfo.set('currentPosition', position);
          poppedOutPlayerInfo.set('relativePosition', position / currentSound.duration);
        });
      });
    };

    trackEvent('Audio popped out', { nonInteraction: 1 }); // we can't be sure the user initiated

    updateBasicPlayerInfo();

    poppedOutAudioCardWidget.bind(SC.Widget.Events.READY, updateBasicPlayerInfo);

    poppedOutAudioCardWidget.bind(SC.Widget.Events.PLAY, function (e) {
      poppedOutPlayerInfo.set('status', 'playing');
      trackEvent('Popped out audio playing', { nonInteraction: 1 }); // we can't be sure the user initiated
    });

    poppedOutAudioCardWidget.bind(SC.Widget.Events.PAUSE, function (e) {
      poppedOutPlayerInfo.set('status', 'paused');
      trackEvent('Popped out audio pausing', { nonInteraction: 1 }); // we can't be sure the user initiated
    });

    poppedOutAudioCardWidget.bind(SC.Widget.Events.FINISH, function (e) {
      poppedOutPlayerInfo.set('status', 'paused');
      poppedOutPlayerInfo.set('currentPosition', poppedOutPlayerInfo.get('duration'));
      poppedOutPlayerInfo.set('relativePosition', 1);
      trackEvent('Popped out audio finished', { nonInteraction: 1 });
    });

    poppedOutAudioCardWidget.bind(SC.Widget.Events.PLAY_PROGRESS, _.throttle(updatePlayProgress, 200))
  } else {
    if (poppedOutAudioCardWidget){
      poppedOutAudioCardWidget.unbind(SC.Widget.Events.READY);
      poppedOutAudioCardWidget.unbind(SC.Widget.Events.PLAY);
      poppedOutAudioCardWidget.unbind(SC.Widget.Events.PAUSE);
      poppedOutAudioCardWidget.unbind(SC.Widget.Events.FINISH);
      poppedOutAudioCardWidget.unbind(SC.Widget.Events.PLAY_PROGRESS);
    }
  }
});

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}


Template.audio_popout.helpers({
  title: function(){
    return poppedOutPlayerInfo.get('title');
  },
  totalTime: function(){
    return millisToMinutesAndSeconds(poppedOutPlayerInfo.get('duration'));
  },
  currentTime: function(){
    var currentPosition;
    if(currentPosition = poppedOutPlayerInfo.get('currentPosition')){
      return millisToMinutesAndSeconds(currentPosition);
    } else {
      return "0:00"
    }
  },
  showPauseButton: function(){
    return poppedOutPlayerInfo.get('status') === 'playing';
  }
});

var updateAudioPosition = function(e, t){
  var millis = Math.min(e.currentTarget.value / 1000, 0.99) * poppedOutPlayerInfo.get('duration'); // min prevents scrub to end weirdness
  poppedOutAudioCardWidget.seekTo(millis);
  poppedOutAudioCardWidget.isPaused(function(isPaused){
    if(isPaused){
      poppedOutAudioCardWidget.play();
    }
  });
}

Template.audio_popout.events({
  'click .play': function(){
    poppedOutAudioCardWidget.play();
  },
  'click .pause': function(){
    poppedOutAudioCardWidget.pause();
  },
  'change .progress': updateAudioPosition,
  'input .progress': function(e,t) {
    if(Meteor.Device.isPhone()){
      poppedOutAudioCardWidget.pause();
    } else {
      updateAudioPosition(e,t);
    }
  },
  "click .dismiss-popout": function(e, t) {
    Session.set('poppedOutContextId', null);
    poppedOutAudioCardWidget.pause();
    trackEvent('Click dismiss popout button');
  }
});

Template.audio_popout.onRendered(function(){
  var that = this;
  this.autorun(function(){
    var relativePosition = poppedOutPlayerInfo.get('relativePosition');
    if(typeof relativePosition === 'number'){
      that.$('input.progress').val(relativePosition * 1000);
    }
  });
});





Template.create_story.events({
  'click': function(){
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


  var that = this;

  this.autorun(function () {
    if(adminMode()){
      that.subscribe('adminOtherUserPub', that.data.authorId);
    } else {
      that.subscribe('minimalUsersPub', [that.data.authorId]);
    }
  });
});

var activeHeartbeatCount = {};
var activeHeartbeatCountSent = {};
incrementActiveHeartbeatCount = function(id){
  activeHearbeatCount[id] = (activeHearbeatCount[id] || 0) + 1;
};

subtractSentActiveHeartbeatCount = function(){
  _.each(_.keys(activeHeartbeatCountSent), function(k){
    activeHeartbeatCount[k] = activeHeartbeatCount[k] - activeHeartbeatCountSent[k];
    if(!activeHeartbeatCount[k]){
      delete activeHeartbeatCount[k]
    }
  });
  activeHeartbeatCountSent = {}; // this makes the function safe to run multiple times
};

var sendHeartbeatsInterval = 30000;


activeHeartbeatCountSender = function(doOnce){
  if(_.isEmpty(activeHeartbeatCount)){
    console.log('nothing to send')
    return
  }
  activeHeartbeatCountSent = _.clone(activeHeartbeatCount);
  console.log('sending:')
  console.log(activeHeartbeatCountSent)
  Meteor.call('countStoryActiveHeartbeats', Session.get('storyId'), activeHeartbeatCountSent, function(err){
    if(err){
      console.warn('Failed to send heartbeats');
    } else {
      subtractSentActiveHeartbeatCount();
    }
    if(!doOnce){
      Meteor.setTimeout(activeHeartbeatCountSender, sendHeartbeatsInterval);
    }
  });
};

Meteor.startup(function(){
  Meteor.setTimeout(activeHeartbeatCountSender, sendHeartbeatsInterval);
  $(window).bind('beforeunload', function(){
    subtractSentActiveHeartbeatCount(); // in case there is already a count pending don't double-do it
    activeHeartbeatCountSender(true);
  })
});

window.userInactiveCount = 0;
var inactiveThreshold = 15;

$(window).bind('mousemove mouseup touchstart touchend touchmove keyup scroll resize', function(){
  userInactiveCount = 0;
});

var addActiveHeartbeat = function(key){
  activeHeartbeatCount[key] = (activeHeartbeatCount[key] || 0) + 1;
};

Template.read.onRendered(function(){
  $(window).scrollTop(Session.get('scrollTop'));
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
  subtractSentActiveHeartbeatCount(); // in case there is already a count pending don't double-do it
  activeHeartbeatCountSender(true);
});


Template.context_overlay.helpers({
  overlaidContext: function(){
    var id = Session.get('contextOverlayId');
    if(Session.get('showDraft')) {
      return ContextBlocks.findOne(id);
    } else {
      return newTypeSpecificContextBlock(_.findWhere(this.contextBlocks, {_id: id}));
    }
  },
  contextLoaded: function(){
    return Template.instance().contextLoaded.get();
  }
})

Template.context_overlay.onCreated(function(){
  this.contextLoaded = new ReactiveVar();
  document.body.style.overflow = 'hidden';
});

Template.context_overlay.onRendered(function(){
  var that = this;
  this.contextLoaded.set(false);
  $('img, video').load(function(){
    that.contextLoaded.set(true);
  });
});

Template.context_overlay.onDestroyed(function(){
  document.body.style.overflow = 'auto';
});

Template.context_overlay.events({
  'click': function () {
    Session.set('contextOverlayId', null);
  },
  'scroll': function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false
  }
});

Template.loading_page.onRendered(function(){
  $(window).scrollTop(0);
});
