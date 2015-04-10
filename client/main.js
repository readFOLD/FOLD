var getCardWidth, horizontalBlockHelpers, throttledResize, typeHelpers, updatecurrentY,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

UI.registerHelper('selectedIf', function(val) {
  return val ? 'selected' : '';
});

getCardWidth = function(windowWidth) {
  var cardWidth;
  if (windowWidth <= window.constants.minPageWidth) {
    return cardWidth = 400;
  } else if ((windowWidth > window.constants.minPageWidth) && (windowWidth <= 1304)) {
    return cardWidth = (windowWidth - (16 * 3) - (88 * 2)) / 2;
  } else {
    return cardWidth = 520;
  }
};

Session.set("separation", 10);

var windowSizeDep = new Tracker.Dependency();

Tracker.autorun(function(){
  windowSizeDep.depend();

  Session.set("windowHeight", $(window).height());

  Session.set("windowWidth", window.outerWidth);

  Session.set("cardWidth", getCardWidth(window.outerWidth));

  Session.set("verticalLeft", getVerticalLeft(window.outerWidth));
});

var windowResize = function() {
  windowSizeDep.changed();
};

throttledResize = _.throttle(windowResize, 20);

$(window).resize(throttledResize);

updatecurrentY = function() {
  var actualY, h, i, maxScroll, readMode, scrollTop, stickyBody, stickyTitle, vertTop, _i, _len, _ref;
  scrollTop = $(document).scrollTop();
  Session.set("scrollTop", scrollTop);
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
    vertTop = 427 + scrollTop - stickyTitle;
    $("div.horizontal-context").addClass("fixed");
    $("div.vertical-narrative").css({
      top: vertTop
    });
    if (scrollTop >= maxScroll) {
      $("div.vertical-narrative").css({
        top: 557
      });
    }
  } else {
    $("div.vertical-narrative").css({
      top: 427
    });
    $("div.horizontal-context").removeClass("fixed");
  }
  if (scrollTop >= maxScroll) {
    $("div.title-overlay, div#banner-overlay").addClass("fixed");
    $("div.logo").addClass("visible");
    Session.set("pastHeader", true);
  } else {
    $("div.title-overlay, div#banner-overlay").removeClass("fixed");
    $("div.logo").removeClass("visible");
    return Session.set("pastHeader", false);

  }
  if (scrollTop >= readMode) {
    var selectOffset = - 40;
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
  Session.setDefault("currentX", void 0);
  throttledUpdate = _.throttle(updatecurrentY, 20);
  return $(document).scroll(throttledUpdate);
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
  headerImageAttribution: function() {
    return this.headerImageAttribution;
  },
  headerImageUrl: function() {
    return '//' + Meteor.settings["public"].AWS_BUCKET + '.s3.amazonaws.com/header-images/' + this.headerImage;
  },
  "files": function(){
    return S3.collection.find();
  }
});

Template.story_header.events = {
  "mouseover #banner-overlay, mouseover #to-header": function() {
    if (Session.get('pastHeader')) {
      return $("#to-header").addClass('shown');
    }
  },
  "mouseout #banner-overlay": function() {
    if (Session.get('pastHeader')) {
      return $("#to-header").removeClass('shown');
    }
  },
  "click #to-story": function() {
    $('#to-story, .attribution').fadeOut();
    goToX(0);
    return goToY(0);
  },
  "click #banner-overlay": function() {
    var path;
    if (Session.get("pastHeader")) {
      $("#to-header").removeClass("shown");
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
  },
  "click #to-header": function() {
    var path;
    $("#to-header").removeClass("shown");
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
  verticalLeft: function () {
    return Session.get("verticalLeft");
  },
  metaviewOpen: function() {
    return Session.get("metaview")
  },
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
      return '<div class="content">' + cleanVerticalSectionContent(this.content) + '</div>';
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
  "click a": function(e) {
    var contextId;
    e.preventDefault();
    contextId = $(e.target).data('contextId');
    return goToContext(contextId);
  }
});

Template.metaview.onRendered(function() {
  $("body").css({ overflow: 'hidden' });

  var that = this;  
  this.$(".sortable-rows, .sortable-blocks").sortable({
    stop: function() {
      var newVerticalSectionIDs = $( ".sortable-rows" ).sortable('toArray', {attribute: 'data-id'})

      var newContextBlocks = [];
      $( ".sortable-blocks" ).each(function(i, e) { 
        newContextBlocks.push($(e).sortable('toArray', {attribute: 'data-id'} ))
      });

      var originalVerticalSections = that.data.verticalSections;

      var newVerticalSections = []
      _.map(newVerticalSectionIDs, function(id, i) {
        var newVerticalSection = _.findWhere(originalVerticalSections, {_id: id});
        newVerticalSection.contextBlocks = newContextBlocks[i];
        newVerticalSections.push(newVerticalSection);
      });
      Meteor.call('saveStory', {_id: Session.get("storyId")}, {$set: {'draftStory.verticalSections': newVerticalSections}})
    }
  });

  this.$(".sortable-rows, .sortable-blocks").disableSelection();
});

Template.metaview.events({
  "click .close": function(d, t) {
    Session.set("metaview", false);
    $("body").css({ overflow: 'auto' })
  },
  "click": function(d, t) {
    d.preventDefault();
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
  }
})

Template.minimap.events({
  "click .minimap": function(d, t) {
    Session.set("metaview", true);
  }
})

Template.minimap.helpers({
  horizontalSectionsMap: function() {
    return Session.get("horizontalSectionsMap");
  },
  selectedX: function() {
    return Session.equals("currentX", this.horizontalIndex);
  },
  selectedY: function() {
    return Session.equals("currentY", this.verticalIndex);
  }
});

Template.horizontal_context.helpers({
  verticalExists: function() {
    return Session.get("horizontalSectionsMap").length;
  },
  horizontalSections: function() {
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
      } else { // In READ, these are denormalized right on the document
        var data = verticalSection.contextBlocks.map(function (datum, horizontalIndex) {
          return _.extend({}, datum, {
            index: horizontalIndex,
            verticalIndex: verticalIndex,
            verticalId: verticalSection._id
          });
        }).map(window.newTypeSpecificContextBlock);
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
      return '<div class="text-content" dir="auto">' + _.escape(textContent).replace(/\n/g, "<br>") + '</div>';
    } else {
      return '<textarea name="content" class="text-content editable" rows="' + rows + '" placeholder="' + placeholder +  '" dir="auto">' + _.escape(textContent) + '</textarea>';
    }
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
    "blur .text-content": function(d, template) {
      var that = this;
      if (!Session.get('read') && !Session.get('addingContext')) {
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, that._id, textContent, function (err, numDocs) {
          saveCallback(err, numDocs);
        });
      }
    },
    "keypress .image-section .text-content": function(e, template) {
      var that = this;
      if (!Session.get('read') && !Session.get('addingContext') && e.which === 13 ) {
        console.log(4)

        e.preventDefault();
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, that._id, textContent, function (err, numDocs) {
          saveCallback(err, numDocs);
        });
      }
    }
  }
};

Template.display_viz_section.helpers(horizontalBlockHelpers);

Template.display_image_section.onCreated(editableDescriptionCreatedBoilerplate);
Template.display_image_section.helpers(horizontalBlockHelpers);
Template.display_image_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_audio_section.helpers(horizontalBlockHelpers);

Template.display_video_section.helpers(horizontalBlockHelpers);

Template.display_twitter_section.helpers(horizontalBlockHelpers);

Template.display_map_section.helpers(horizontalBlockHelpers);

Template.display_link_section.helpers(horizontalBlockHelpers);

Template.display_text_section.onCreated(editableDescriptionCreatedBoilerplate);
Template.display_text_section.helpers(horizontalBlockHelpers);
Template.display_text_section.events(editableDescriptionEventsBoilerplate('editTextSection'));


Template.horizontal_section_edit_delete.helpers(horizontalBlockHelpers);

Template.story_browser.helpers({
  showLeftArrow: function() {
    return Session.get("currentX") !== 0 || Session.get("wrap")[Session.get('currentYId')];
  }
});

Template.story_browser.events({
  "click .right svg": function(d) {
    var currentX, horizontalSection, newX, path;
    horizontalSection = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal;
    currentX = Session.get("currentX");
    currentY = Session.get("currentY");
    currentYId = Session.get("currentYId");
    if (currentX === (horizontalSection.length - 1)) { // end of our rope
      newX = 0;
      wrap = Session.get("wrap");
      wrap[currentYId] = true;
      Session.set("wrap", wrap);
    } else {
      newX = currentX + 1;
    }
    goToX(newX);
    path = window.location.pathname.split("/");
    return path[4] = Session.get("currentX");
  },
  "click .left svg": function(d) {
    var currentX, horizontalSection, newX, path;
    horizontalSection = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal;
    currentX = Session.get("currentX");
    newX = currentX ? currentX - 1 : horizontalSection.length - 1;
    goToX(newX);
    path = window.location.pathname.split("/");
    return path[4] = Session.get("currentX");
  }
});

Template.type_specific_icon.helpers(typeHelpers);

Template.favorite_button.helpers({
  userFavorited: function() {
    return Meteor.user() && (Meteor.user().profile.favorites.indexOf(this._id) >= 0);
  }
});

Template.favorite_button.events({
  "click .favorite": function() {
    return Meteor.call('favoriteStory', this._id, function(err) {
      if (err) {
        throw(err);
        return alert(err);
      }
    });
  },
  "click .unfavorite": function() {
    return Meteor.call('unfavoriteStory', this._id, function(err) {
      if (err) {
        throw(err);
        return alert(err);
      }
    });
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
})

Template.create_story.events({
  'click': function(){
    if (Meteor.user()){
      Meteor.call('createStory', function(err, pathObject){
        if (err) {
          throw(err);
          return alert(err);
        }
        Router.go('/create/' + pathObject.userPathSegment + '/' + pathObject.storyPathSegment)
      })
    } else {
     Session.set('signingIn', true)
    }
  }
});

// ui setup moved from onRun
Template.about.onCreated(function(){
  $('html, body').scrollTop(0);
});

Template.terms.onCreated(function(){
  $('html, body').scrollTop(0);
});

Template.home.onCreated(function(){
  $('html, body').scrollTop(0);
});

Template.signup.onCreated(function(){
  $('html, body').scrollTop(0);
});

Template.login.onCreated(function(){
  $('html, body').scrollTop(0);
});

Template.read.onCreated(function(){
  Session.set("wrap", {});
  Session.set("currentXByYId", {});
  Session.set("currentY", null);
  $('html, body').scrollTop(0);
});

Template.create.onCreated(function(){
  Session.set("wrap", {});
  Session.set("currentXByYId", {});
  Session.set("currentY", null);
  Session.set("read", false);
  Session.set("newStory", false);
  Session.set("showDraft", true);
  $('html, body').scrollTop(0);

});
