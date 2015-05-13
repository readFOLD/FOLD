var getCardWidth, horizontalBlockHelpers, throttledResize, typeHelpers, updatecurrentY,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

Session.set("separation", 10);

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
});


window.hammerSwipeOptions = {
  pointers:	1,
  threshold: 8,
  velocity:	0.35 // 0.65
};


window.updateCurrentY = function() {
  var actualY, h, i, maxScroll, readMode, scrollTop, stickyBody, stickyTitle, vertTop, _i, _len, _ref;
  scrollTop = $(document).scrollTop();
  Session.set("scrollTop", scrollTop);
  $("div.logo").addClass("visible");

  if (scrollTop >= (200 - 32)) {
    Session.set("sticky", true);
  } else {
    Session.set("sticky", false);
  }
  stickyBody = 90;
  stickyTitle = 120;
  maxScroll = 230;
  readMode = 250;
  $("div#banner-overlay").css({
    opacity: Math.min(1.0, scrollTop / maxScroll)
  });
  $("article.content").css({
    opacity: 0.5 + Math.min(1.0, scrollTop / maxScroll) / 2
  });
  if (scrollTop >= stickyTitle) {
    $("div.title-author").css({
      "margin-top": "0px"
    });
    $("div.title-author").addClass("fixed");
  } else {
    $("div.title-author").css({
      "margin-top": "125px"
    });
    $("div.title-author").removeClass("fixed");
  }
  if (scrollTop >= stickyBody) {
    $("div.horizontal-context").addClass("fixed");
    $("div.vertical-narrative").addClass("fixed");
    $("div.vertical-narrative").removeClass("free-scroll");

    if (scrollTop >= maxScroll) {
      $("div.vertical-narrative").removeClass("fixed");
      $("div.vertical-narrative").addClass("free-scroll");

    }
  } else {
    $("div.horizontal-context").removeClass("fixed");
    $("div.vertical-narrative").removeClass("fixed");
    $("div.vertical-narrative").removeClass("free-scroll");
  }
  if (scrollTop >= maxScroll) {
    $("div.title-overlay, div#banner-overlay").addClass("fixed");
    $("div.logo").addClass("visible");
    Session.set("pastHeader", true);
  } else {
    $("div.title-overlay, div#banner-overlay").removeClass("fixed");
    Session.set("pastHeader", false);
    if (scrollTop > 25){
      $("div.logo").removeClass("visible");
    }

  }
  if (scrollTop >= readMode) {
    var selectOffset = - 90;
    _ref = _.map(window.getVerticalHeights(), function(height){ return height + selectOffset});
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

Tracker.autorun(function(){
  if(!Session.get('pastHeader')){
    Session.set('currentY', null);
    Session.set('currentX', null);
  }
});

Tracker.autorun(function(){
  var currentYId = Session.get("currentYId");
  if (currentYId){
    Session.set("currentX", Session.get("currentXByYId")[currentYId] || 0);
  }
});

Meteor.startup(function() {
  var throttledUpdate;
  Session.setDefault("filterOpen", false);
  Session.setDefault("filter", "curated");
  Session.setDefault("category", "all");
  Session.setDefault("pastY", []);
  Session.setDefault("pastX", []);
  Session.setDefault("currentY", void 0);
  Session.setDefault("previousY", void 0);
  Session.setDefault("currentX", void 0);
  throttledUpdate = _.throttle(window.updateCurrentY, 20);
  return $(document).scroll(throttledUpdate);
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
  horizontalExists: function() {
    var currentY, _ref;
    currentY = Session.get('currentY');
    return ((_ref = Session.get('horizontalSectionsMap')[currentY]) != null ? _ref.horizontal.length : void 0) > 1;
  },
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
    if (Session.get('read')) {
      return '<div class="story-title">' + _.escape(this.title) + '</div>';
    } else {
      // this is contenteditable in edit mode
      return '<div class="story-title" placeholder="Title" contenteditable="true" dir="auto">' + _.escape(this.title) + '</div>';
    }
  }
});

Template.vertical_section_block.helpers({
  notFirst: function() {
    return !Session.equals("currentY", 0);
  },
  verticalSelected: function() {
    return Session.equals("currentY", this.index) && Session.get("pastHeader");
  },
  validTitle: function() {
    return this.title === !"title";
  },
  titleDiv: function() {
    if (Session.get('read')) {
      return '<div class="title" dir="auto">' + _.escape(this.title) + '</div>';
    } else {
      // this is contenteditable in edit mode
      return '<div class="title editable" placeholder="Title" contenteditable="true" dir="auto">' + _.escape(this.title) + '</div>';
    }
  },
  // NOTE: contentDiv is weird because the user edits its content but it's not reactive. be careful. if it's made reactive without updating it's semi-reactive contents accordingly, user will lose content
  contentDiv: function() {
    if (Session.get('read')) {
      return '<div class="content" dir="auto">' + cleanVerticalSectionContent(this.content) + '</div>';
    } else {
      // nonReactiveContent preserves browser undo functionality across saves
      // this is contenteditable in edit mode
      return '<div class="content editable fold-editable" placeholder="Type your text here." contenteditable="true" dir="auto">' + cleanVerticalSectionContent(Template.instance().semiReactiveContent.get()) + '</div>';
    }
  }
});

Template.vertical_narrative.helpers({
  verticalSectionsWithIndex: function() {
    return this.verticalSections.map(function(v, i) {
      return _.extend(v, {
        index: i
      });
    });
  }
});

Template.vertical_section_block.events({
  "click": function(d, t) {
    goToY(t.data.index);
  },
  "click a": function(e, t) {
    var contextId;
    e.preventDefault();
    if (Session.equals("currentY", t.data.index)){
      contextId = $(e.currentTarget).data('contextId');
      goToContext(contextId);
    }
    analytics.track('Click context anchor', _.extend({}, window.trackingInfoFromStory(Session.get('story')), {
      verticalIndex: this.index,
      contextType: $(e.currentTarget).data('contextType'),
      contextSource: $(e.currentTarget).data('contextSource'),
      numberOfContextCardsOnVertical: this.contextBlocks.length,
      inReadMode: Session.get('read')
    }));
  }
});

Template.story.onRendered(function(){
  // TODO destroy bindings later?
  if(Meteor.Device.isPhone()){
    this.$('.vertical-narrative').hammer(hammerSwipeOptions).bind('swipeleft',function(){
        // TODO only if selected
        Session.set('mobileContextView', true);
      }
    );
  }
});

Template.metaview.onRendered(function() {
  document.body.style.overflow = 'hidden'; // prevent document scroll while in metaview
  var that = this;  
  this.$(".sortable-rows, .sortable-blocks").sortable({
    stop: function() {
      var newVerticalSectionIDs = $( ".sortable-rows" ).sortable('toArray', {attribute: 'data-id'})

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

      Meteor.call('reorderStory', Session.get("storyId"), idMap, saveCallback)


      //var originalVerticalSections = that.data.verticalSections;

      //var newVerticalSections = []
      //_.map(newVerticalSectionIDs, function(id, i) {
      //  var newVerticalSection = _.findWhere(originalVerticalSections, {_id: id});
      //  newVerticalSection.contextBlocks = newContextBlocks[i];
      //  newVerticalSections.push(newVerticalSection);
      //});
      //Meteor.call('saveStory', {_id: Session.get("storyId")}, {$set: {'draftStory.verticalSections': newVerticalSections}})
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
    if (this.verticalSections[currentY]){
      return _.map(this.verticalSections[currentY].contextBlocks, function(cId){
        return {selected: currentXId === cId};
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

Template.horizontal_context.helpers({
  verticalExists: function() {
    return Session.get("horizontalSectionsMap").length;
  },
  horizontalSections: function() {
    var that = this;
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
  horizontalShown: function() {
    return Session.equals("currentY", this.index);
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
    return Session.equals("currentX", this.index) && !Session.get("addingContext");
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
  "click .right svg": function(d) {
    window.goRightOneCard();
    analytics.track('Click right arrow');
  },
  "click .left svg": function(d) {
    window.goLeftOneCard()
    analytics.track('Click left arrow');
  }
});

Template.type_specific_icon.helpers(typeHelpers);

Template.share_button.onCreated(function() {
  this.tooltipShown = new ReactiveVar(false);
})

Template.share_button.events({
  'click': function(e, t) {
    t.tooltipShown.set(!t.tooltipShown.get());
  },
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
  }
});

Template.share_button.helpers({
  "tooltipShown": function() {
    return Template.instance().tooltipShown.get();
  }
})

Template.favorite_button.helpers({
  userFavorited: function() {
    return Meteor.user() && _.contains(Meteor.user().profile.favorites, this._id);
  }
});

Template.favorite_button.events({
  "click .favorite": function() {
    if(!Meteor.user()){
      return notifyInfo('Please sign up or log in to favorite stories');
    }
    return Meteor.call('favoriteStory', this._id, function(err) {
      if (err) {
        notifyError(err);
        throw(err);
      } else {
        analytics.track('Favorite story');
      }

    });
  },
  "click .unfavorite": function() {
    return Meteor.call('unfavoriteStory', this._id, function(err) {
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


Tracker.autorun(function(){
  var story = Session.get('story');
  var currentY = Session.get("currentY");
  if (story && (currentY != null)) {
    Session.set('currentVerticalSection', story.verticalSections[currentY]);
  } else {
    Session.set('currentVerticalSection', null);
  }
});

Tracker.autorun(function() {
  var verticalSection = Session.get('currentVerticalSection');
  if (verticalSection) {
    return Session.set('currentYId', verticalSection._id);
  } else {
    return Session.set('currentYId', null);
  }
});

Tracker.autorun(function() {
  var verticalSection = Session.get('currentVerticalSection');
  var currentX = Session.get('currentX');
  if (verticalSection) {
    var currentContextBlockId = verticalSection.contextBlocks[currentX];
    if (currentContextBlockId) {
      return Session.set('currentXId', currentContextBlockId);
    }
  }
  return Session.set('currentXId', null);
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
      Session.set('signingIn', true)
      analytics.track('User clicked create and needs to sign in');
    }
  }
});


var storyViewed = '';
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
  if (storyViewed !== id){
    storyViewed = id;
    Meteor.call('countStoryView', id);
    analytics.track('View story', trackingInfoFromStory(this.data));
  }
});


Template.read.onRendered(function(){
  $(window).scrollTop(Session.get('scrollTop'));
});
