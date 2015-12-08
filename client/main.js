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
    if (Session.get('signingIn') && !justReloaded){
      setSigningInFrom();
      analytics.track('Opened sign-in overlay', {nonInteraction: 1});
    }
    justReloaded = false;
  })
});


window.hammerSwipeOptions = {
  pointers:	1,
  threshold: 8,
  velocity:	0.25 // 0.65
};


var scrollPauseArmed = false;

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
      }, 500);
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

window.trackingInfoFromStory = function(story){
  return _.chain(story)
    .pick([
      '_id',
      'authorDisplayUsername',
      'authorId',
      'authorName',
      'authorUsername',
      'createdAt',
      'editorsPick',
      'editorsPickAt',
      'firstPublishedAt',
      'headerImageFormat',
      'keywords',
      'narrativeRightsReserved',
      'publishedAt',
      'savedAt',
      'shortId',
      'title'])
    .extend(story.published ? {
      'numberOfContextBlocks': story.contextBlockIds.length,
      'numberOfVerticalSections': story.verticalSections.length,
      'favorites': story.favoritedTotal,
      'numberofKeywords': story.keywords.length,
      'titleLength': story.title.length
    } : {})
    .extend(story.countContextTypes ? story.countContextTypes() : {}) // TODO Fix
    .value();
};

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
    var path;
    if (Session.get("pastHeader")) {
      $("html, body").animate({
        scrollTop: 0
      }, function() {
        return $('#to-story, .attribution').fadeIn();
      });
      Session.set("currentX", void 0);
      Session.set("currentY", void 0);
      path = window.location.pathname.split("/");
      path.pop();
      return path.pop();
    } else {
      $('#to-story, .attribution').fadeOut();
      goToX(0);
      return goToY(0);
    }
  },
  "keydown": function (e) {
    if (e.which == 13) { // enter
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
        analytics.track('Click context anchor', _.extend({}, window.trackingInfoFromStory(Session.get('story')), {
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
      analytics.track('Click minimap in create mode');
    } else {
      notifyFeature('Zoom-out mode: coming soon!');
      analytics.track('Click minimap in read mode');
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
  },
  mobileMargin: function(){
    return Session.get('mobileMargin');
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
    analytics.track('Click mobile back button');
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

Template.display_audio_section.helpers(horizontalBlockHelpers);

Template.display_video_section.helpers(horizontalBlockHelpers);

Template.display_twitter_section.helpers(horizontalBlockHelpers);

Template.display_map_section.helpers(horizontalBlockHelpers);

Template.display_link_section.helpers(horizontalBlockHelpers);
Template.display_link_section.events({
  'click a': function (e, t) {
    var url = e.currentTarget.href;
    analytics.track('Click external link in link card', {
      label: url,
      url: url,
      targetClassName: e.target.className
    })
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
    analytics.track('Click right arrow');
  },
  "click .left": function(d) {
    window.goLeftOneCard();
    analytics.track('Click left arrow');
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
    analytics.track('Share on Facebook');
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
    analytics.track('Share on Twitter');
  },
  'click .share-embed': function(e, t) {
    notifyFeature('Embedding: coming soon!');
    analytics.track('Click embed button');
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
    analytics.track('Click favorite button');

    if (!Meteor.user()) {
      Session.set('signingIn', 'Thanks for showing your love!\nPlease sign in to favorite this FOLD.');
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
        analytics.track('Favorite story');
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

        analytics.track('Unfavorite story');
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
    analytics.track('Remix context card click', _.pick(this, [
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
    analytics.track('Pop out card click', _.pick(this, [
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

  Tracker.nonreactive(function(){
    if (currentXId === Session.get('poppedOutContextId')){ // new card was previously popped out, so pop it back in
      Session.set('poppedOutContextId', null);
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
  poppedOutPlayerInfo.set('currentPosition', e.currentPosition)
  poppedOutPlayerInfo.set('relativePosition', e.relativePosition)
};

Tracker.autorun(function(){
  var poppedOutContextId;
  if(poppedOutContextId = Session.get('poppedOutContextId')) {
    poppedOutAudioCardWidget = SC.Widget(getAudioIFrame(poppedOutContextId));
    poppedOutAudioCardWidget.bind(SC.Widget.Events.READY, function () {

      poppedOutAudioCardWidget.getCurrentSound(function (currentSound) {
        poppedOutPlayerInfo.set('title', currentSound.title);
        poppedOutPlayerInfo.set('duration', currentSound.duration);
        poppedOutAudioCardWidget.isPaused(function(isPaused){
          poppedOutPlayerInfo.set('status', isPaused ? 'paused' : 'playing');
        });
      });
    });

    poppedOutAudioCardWidget.bind(SC.Widget.Events.PLAY, function (e) {
      poppedOutPlayerInfo.set('status', 'playing');
    });

    poppedOutAudioCardWidget.bind(SC.Widget.Events.PAUSE, function (e) {
      poppedOutPlayerInfo.set('status', 'paused');
    });

    poppedOutAudioCardWidget.bind(SC.Widget.Events.FINISH, function (e) {
      poppedOutPlayerInfo.set('status', 'paused');
      poppedOutPlayerInfo.set('currentPosition', poppedOutPlayerInfo.get('duration'));
      poppedOutPlayerInfo.set('relativePosition', 1);
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

Template.audio_popout.events({
  'click .play': function(){
    poppedOutAudioCardWidget.play();
  },
  'click .pause': function(){
    poppedOutAudioCardWidget.pause();
  },
  'input .progress, change .progress': function(e, t){
    var millis = Math.min(e.currentTarget.value / 1000, 0.99) * poppedOutPlayerInfo.get('duration'); // min prevents scrub to end weirdness
    poppedOutAudioCardWidget.seekTo(millis);
    poppedOutAudioCardWidget.isPaused(function(isPaused){
      if(isPaused){
        poppedOutAudioCardWidget.play();
      }
    });
  },
  "click .dismiss-popout": function(e, t) {
    Session.set('poppedOutContextId', null);
    poppedOutAudioCardWidget.pause();
    analytics.track('Click dismiss popout button');
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
          analytics.track('User clicked create and created story');

        })
      } else {
        notifyInfo("Due to high demand, we had to turn off 'create new story' functionality for a moment. Stay tuned for updates!");
      }
    } else {
      Session.set('signingIn', "You're almost there!\nPlease sign in to make a story.")
      analytics.track('User clicked create and needs to sign in');
    }
  }
});


Template.read.onCreated(function(){

  // analytics autorun
  this.autorun(function(){
    if (!Session.equals("currentY", null)){
      var y = Session.get("currentY");
      var storyLength = Session.get("story").verticalSections.length;
      analytics.track('View vertical narrative section', {
        label: y,
        verticalNarrativeIndex: y,
        storyLength: storyLength,
        verticalNarrativeFraction: (y + 1) / storyLength,
        storyId: Session.get("storyId")
      })
    }
  });

  var id = this.data._id;
  if (Session.get('storyViewed') !== id){
    Session.set('storyViewed', id);
    Meteor.call('countStoryView', id);
    analytics.track('View story', _.extend({}, trackingInfoFromStory(this.data), { nonInteraction: 1 }));
  }

  var that = this;

  this.autorun(function () {
    if(adminMode()){
      that.subscribe('adminOtherUserPub', that.data.authorId);
    } else {
      that.subscribe('minimalUsersPub', [that.data.authorId]);
    }
  });
});


Template.read.onRendered(function(){
  $(window).scrollTop(Session.get('scrollTop'));
});
