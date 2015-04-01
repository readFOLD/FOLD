var createBlockEvents, createBlockHelpers, renderTemplate, showNewHorizontalUI, toggleHorizontalUI,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.enclosingAnchorTag = null;
window.selectedNode = null;

var saveUpdatedSelection = function () {
  $(window.selectedNode).closest('.content').blur();
};

var saveNarrativeSectionContent = function (verticalIndex) {
  $('.vertical-narrative-section[data-vertical-index="' + verticalIndex + '"]').find('.content').blur();
};

window.updateUIBasedOnSelection = function(e){
  var selection = window.getSelection();

  // Based off of code from https://github.com/daviferreira/medium-editor
  return setTimeout((function(_this) {
    return function() {
      var boundary, boundaryMiddle, pageYOffset, range;

      window.enclosingAnchorTag = null;
      window.selectedNode = null;

      var selectionType = window.getSelection().type;
      if(selectionType === 'Range' || selectionType === 'Caret' ) {
        range = selection.getRangeAt(0);

        // Get containing tag
        if (rangeSelectsSingleNode(range)) {
          selectedParentElement = range.startContainer.childNodes[range.startOffset];
        } else if (range.startContainer.nodeType === 3) {
          selectedParentElement = range.startContainer.parentNode;
        } else {
          selectedParentElement = range.startContainer;
        }
        var parentNode = selectedParentElement;
        window.selectedNode = selectedParentElement;
        var selectedTags = [];
        var tagName;

        // only do if selection is inside a narrative block
        if($(parentNode).parents('.vertical-narrative-section').length) {
          while (parentNode.tagName !== undefined && parentNode.tagName.toLowerCase() !== 'div') {
            tagName = parentNode.tagName.toLowerCase();
            selectedTags.push(tagName);

            if (selectionType === 'Caret' && tagName === 'a') {
              window.enclosingAnchorTag = parentNode;
              break;
            }
            parentNode = parentNode.parentNode;
          }

          Session.set('selectedTags', selectedTags);

          // TO-DO actually get this from selection
          if (e) {
            boundary = range.getBoundingClientRect();
            boundaryMiddle = (boundary.left + boundary.right) / 2;
            pageYOffset = $(e.target).offset().top;
            if (selectionType === 'Range') {
              showFoldEditor();
              $('#fold-editor').css('left', e.pageX - 100);
              return $('#fold-editor').css('top', e.pageY - 70);
            } else if (window.enclosingAnchorTag) {
              showFoldLinkRemover();
              $('#fold-link-remover').css('left', e.pageX - 25);
              return $('#fold-link-remover').css('top', e.pageY - 45);
            } else {
              return hideFoldAll();
            }

          }
        } else {
          return hideFoldAll();
        }
      } else {
        return hideFoldAll();
      }
    };
  })(this));
};

window.plainTextPaste = function(e) {
  var clipboardData = (e.originalEvent || e).clipboardData;
  e.preventDefault();
  return document.execCommand('insertText', false, clipboardData.getData('text/plain'));
};

Template.create.onRendered(function() {
  window.showAnchorMenu = function() {
    Session.set("anchorMenuOpen", true);
    return $(".anchor-menu").show();
  };
  window.hideAnchorMenu = function() {
    Session.set("anchorMenuOpen", false);
    return $(".anchor-menu").hide();
  };
  window.toggleAnchorMenu = function() {
    var anchorMenu, contextAnchorMenu, shiftAmt;
    anchorMenu = $(".anchor-menu");
    contextAnchorMenu = $(".context-anchor-menu");
    shiftAmt = 120;
    if (anchorMenu.is(':visible') || contextAnchorMenu.is(':visible')) {
      $('#fold-editor').css('top', parseInt($('#fold-editor').css('top')) + shiftAmt);
      window.hideAnchorMenu();
      return window.hideContextAnchorMenu();
    } else {
      $('#fold-editor').css('top', parseInt($('#fold-editor').css('top')) - shiftAmt);
      return window.showAnchorMenu();
    }
  };
  window.showContextAnchorMenu = function() {
    var contextAnchorForm;
    contextAnchorForm = $(".context-anchor-menu");
    contextAnchorForm.show();
    Session.set("contextAnchorMenuOpen", true);
    return contextAnchorForm.insertAfter('#fold-editor-button-group');
  };
  window.hideContextAnchorMenu = function() {
    Session.set("contextAnchorMenuOpen", false);
    return $(".context-anchor-menu").hide();
  };
  window.showFoldEditor = function() {
    $('#fold-editor').show();
    hideFoldLinkRemover();
  };
  window.hideFoldEditor = function() {
    $('#fold-editor').hide();
    hideContextAnchorMenu();
    return hideAnchorMenu();
  };

  window.showFoldLinkRemover = function() {
    $('#fold-link-remover').show();
    hideFoldEditor();
  };
  window.hideFoldLinkRemover = function() {
    $('#fold-link-remover').hide();
  };

  window.hideFoldAll = function() {
    hideFoldEditor();
    hideFoldLinkRemover();
  };
  this.autorun(function(){
    if (Session.get('read') || Session.get('currentYId')){
      return window.hideFoldAll();
    }
  });
  if (!(Session.equals("currentY", void 0) && Session.equals("currentX", void 0))) {
    $('.attribution, #to-story').fadeOut(1);
    goToY(Session.get("currentY"));
    return goToX(Session.get("currentX"));
  }
});

Template.fold_editor.helpers({
  boldActive: function() {
    return _.intersection(['b', 'strong'], Session.get('selectedTags')).length;
  },
  italicActive: function() {
    return _.intersection(['i', 'em'], Session.get('selectedTags')).length;
  },
  underlineActive: function() {
    return _.intersection(['u'], Session.get('selectedTags')).length;
  },
  anchorActive: function() {
    return _.intersection(['a'], Session.get('selectedTags')).length || Session.get('contextAnchorMenuOpen') || Session.get('anchorMenuOpen');
  }
});

Template.fold_editor.events({
  'mouseup': function () {
    window.updateUIBasedOnSelection()
  },
  'mouseup .bold-button': function(e) {
    e.preventDefault();
    document.execCommand('bold', false, null);
    saveUpdatedSelection();
  },
  'mouseup .italic-button': function(e) {
    e.preventDefault();
    document.execCommand('italic', false, null);
    saveUpdatedSelection();
  },
  'mouseup .underline-button': function(e) {
    e.preventDefault();
    document.execCommand('underline', false, null);
    saveUpdatedSelection();
  },
  'mouseup .anchor-button': function(e) {
    e.preventDefault();
    return toggleAnchorMenu();
  }
});

Template.context_anchor_go_back.events({
  'mouseup': function(e) {
    e.preventDefault();
    hideContextAnchorMenu();
    return showAnchorMenu();
  }
});

Template.anchor_menu.events({
  'mouseup .link-to-card': function(e) {
    e.preventDefault();
    hideAnchorMenu();
    return showContextAnchorMenu();
  },
  'mouseup .link-out-of-story': function(e) {
    return e.preventDefault();
  }
});

Template.fold_link_remover.events({
  'mouseup button': function(e) {
    e.preventDefault();
    parentDiv = ($(window.enclosingAnchorTag).closest('.content'));
    $(window.enclosingAnchorTag).contents().unwrap();
    parentDiv.blur();
    hideFoldAll();
  }
});



// http://stackoverflow.com/questions/15867542/range-object-get-selection-parent-node-chrome-vs-firefox
var rangeSelectsSingleNode = function (range) {
  var startNode = range.startContainer;
  return startNode === range.endContainer &&
    startNode.hasChildNodes() &&
    range.endOffset === range.startOffset + 1;
};

Tracker.autorun(function(){
  switch(Session.get('saveState')) {
    case 'saving':
      Session.set('saving', true);
      break;
    case 'failed':
      alert('Saving failed. Please refresh and try again.');
      break;
    case 'saved':
      Session.set('saving', false);
      break;
  }
});

var saveCallback =  function(err, success, cb) {
  var saveUIUpdateDelay = 300;
  setTimeout(function(){
    if (err) {
      return Session.set('saveState', 'failed');
    }
    if (!success) {
      return Session.set('saveState', 'failed');
    }
    Session.set('saveState', 'saved');
  }, saveUIUpdateDelay);
  if(cb){
    cb(err, success);
  }
  if (err){
    throw(err);
  }
};

var autoSaveVerticalSectionField = function(template, field, datatype){
  storyId = Session.get('storyId');

  if (datatype === 'html') {
    value = $.trim(template.$('div.' + field).html());
  } else {
    value = $.trim(template.$('div.' + field).text());
  }
  index = template.data.index;

  setField = 'draftStory.verticalSections.' + index + '.' + field
  setObject = { $set:{} };
  setObject['$set'][setField] = value;

  Session.set('saveState', 'saving');

  return Meteor.call('saveStory', {
    _id: storyId
  }, setObject, {removeEmptyStrings: false}, saveCallback)
};

Template.vertical_section_block.events({
  'mouseup [contenteditable]': window.updateUIBasedOnSelection,
  'blur [contenteditable]': window.updateUIBasedOnSelection,
  'blur .title[contenteditable]' : function(e, template){
    autoSaveVerticalSectionField(template, 'title');
    return true;
  },
  'keydown .title[contenteditable]' : function(e, template){
    if (e.keyCode === 13){ // enter
      e.preventDefault();
      template.$('.content').focus()
    }
    return true;
  },
  'blur .content[contenteditable]' : function(e, template){
    autoSaveVerticalSectionField(template, 'content', 'html');
    return true;
  },
  // clean up pasting into vertical section content
  // TODO do this in save as well
  'paste .fold-editable': function(e) {
    var clipboardData, html;
    e.preventDefault();
    clipboardData = (e.originalEvent || e).clipboardData;
    if (!clipboardData){return}
    html = clipboardData.getData('text/html') || clipboardData.getData('text/plain');

    return document.execCommand('insertHTML', false, window.cleanVerticalSectionContent(html));
  },
  'drop': function(e){
    e.preventDefault();
    return false;
  },
  'paste .title.editable': window.plainTextPaste,   // only allow plaintext in title
  'mouseover .narrative-babyburger-and-menu': function(e, template){
    template.babyburgerOpen.set(true);
  },
  'mouseout .narrative-babyburger-and-menu': function(e, template){
    template.babyburgerOpen.set(false);
  }
});

window.refreshContentDep = new Tracker.Dependency();

Template.vertical_section_block.onCreated(function() {
  this.semiReactiveContent = new ReactiveVar(); // used in edit mode so that browser undo functionality doesn't break when autosave
  this.babyburgerOpen = new ReactiveVar(false);
  var that = this;
  this.autorun(function() {
    window.refreshContentDep.depend();
    that.semiReactiveContent.set(that.data.content)
  });
});

Template.vertical_section_block.helpers({
  babyburgerOpen: function(){
    return Template.instance().babyburgerOpen.get();
  }
});

Template.story_title.events({
  'paste [contenteditable]': window.plainTextPaste,
  'drop': function(e){
    e.preventDefault();
    return false;
  },
  'blur .story-title[contenteditable]': function(e,template) {
    storyId = Session.get('storyId');
    storyTitle = $.trim(template.$('div.story-title').text());

    Session.set('saveState', 'saving');
    return Meteor.call('updateStoryTitle', storyId, storyTitle, saveCallback)
  }
});

Template.create.helpers({
  narrativeView: function() {
    return Session.get("narrativeView");
  },
  category: function() {
    return Session.get("storyCategory");
  }
});

Template.add_vertical.events({
  "click": function() {
    var indexToInsert, storyId, verticalSections;
    storyId = Session.get('storyId');
    verticalSections = Session.get('story').verticalSections;
    indexToInsert = this.index != null ? this.index : verticalSections.length;

    return Meteor.call('insertVerticalSection', storyId, indexToInsert, function(err, numDocs) {
      if (err) {
        throw(err);
        return alert(err);
      }
      if (numDocs) {
        return goToY(indexToInsert);
      } else {
        return alert('No docs updated');
      }
    });
  }
});

Template.vertical_edit_menu.helpers({
  canMoveUp: function () {
    return this.index;
  },
  canMoveDown: function () {
    return this.index < Session.get('story').verticalSections.length - 1;
  }
});
Template.vertical_edit_menu.events({
  "click .add-title": function() {
    var storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    return Meteor.call('addTitle', storyId, index, function(err, numDocs) {
      saveCallback(err, numDocs);
    });
  },
  "click .remove-title": function() {
    var storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    return Meteor.call('removeTitle', storyId, index, function(err, numDocs) {
      saveCallback(err, numDocs);
    });
  },
  "click .move-card-up": function() {
    var indexToInsert, storyId, verticalSections;
    storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    return Meteor.call('moveVerticalSectionUpOne', storyId, index, function(err, numDocs) {
      if (numDocs) {
        goToY(index - 1);
      }
      saveCallback(err, numDocs);
    });
  },
  "click .move-card-down": function() {
    var indexToInsert, storyId, verticalSections;
    storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    return Meteor.call('moveVerticalSectionDownOne', storyId, index, function(err, numDocs) {
      if (numDocs) {
        goToY(index + 1);
      }
      saveCallback(err, numDocs);
    });
  },
  "click .delete-card": function() {
    if(confirm("Permanently delete this card and all associated context cards?")) {
      var indexToInsert, storyId, verticalSections;
      storyId = Session.get('storyId');
      var index = this.index;

      Session.set('saveState', 'saving');
      return Meteor.call('deleteVerticalSection', storyId, index, saveCallback);
    }
  }
});

Template.add_horizontal.helpers({
  left: function() {
    var cardWidth, halfWidth, width;
    width = Session.get("windowWidth");
    if (width < 1024) {
      width = 1024;
    }
    halfWidth = width / 2;
    cardWidth = Session.get("cardWidth");
    return halfWidth + (Session.get("separation")) / 2;
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
    var currentContextBlock = verticalSection.contextBlocks[currentX];
    if (currentContextBlock) {
      if (Session.get('showDraft')){
        return Session.set('currentXId', currentContextBlock);
      } else {
        return Session.set('currentXId', currentContextBlock._id);
      }
    }
  }
  return Session.set('currentXId', null);
});

Tracker.autorun(function() {
  if (currentXId = Session.get('currentXId')){
    $('a[data-context-id="' + currentXId + '"]').addClass('active');
    $('a[data-context-id!="' + currentXId + '"]').removeClass('active');
  }
});

Tracker.autorun(function() { // update UI when start and stop adding/editing context
  var currentContextBlocks, currentY, horizontalContextDiv, story, _ref;
  var verticalSection = Session.get('currentVerticalSection');
  if (verticalSection) {
    currentContextBlocks = verticalSection.contextBlocks;
    horizontalContextDiv = $(".horizontal-context");
    horizontalContextDiv.removeClass('editing');
    if (Session.get("addingContext") || (_ref = Session.get("editingContext"), __indexOf.call(currentContextBlocks, _ref) >= 0)) {
      return horizontalContextDiv.addClass('editing');
    } else {
      if (document.body){
        document.body.style.overflow = 'auto'; // return scroll to document in case it lost it
        removePlaceholderLinks();
      }
    }
  }
});


// Hide add card menu when scroll
// TO-DO probably remove all the currentY stuff, since we're not tracking that in any real way
Tracker.autorun(function() {
  Session.get('currentY'); // so reacts to changes in currentY
  Session.set("addingContext", null);
});

var scrollToRelativePosition = function(offset) {
  $('body,html').animate({
    scrollTop: $('.vertical-narrative-section.selected').position().top + offset
  }, 200, 'easeInCubic');
};

var showNewHorizontalUI = function() {
  scrollToRelativePosition(350 + 29);
  Session.set("addingContext", Session.get('currentYId'));
  return Session.set("editingContext", null);
};

var hideNewHorizontalUI = function() {
  scrollToRelativePosition(350 + 29 - 140);
  return Session.set("addingContext", null);
};

var toggleHorizontalUI = function(forceBool) {

  if (!Session.get("addingContext")) {
    showNewHorizontalUI()
  } else {
    hideNewHorizontalUI()
  }
};

Template.add_horizontal.events({
  "click": function(d) {
    return toggleHorizontalUI();
  }
});

Template.create_horizontal_section_block.onCreated(function() {
  return this.type = new ReactiveVar('video');
});

Template.create_horizontal_section_block.onCreated(function() {
  return this.type = new ReactiveVar('link');
});

Template.create_horizontal_section_block.helpers({
  type: function() {
    return Template.instance().type.get();
  },
  text: function() {
    return Template.instance().type.get() === "text";
  },
  image: function() {
    return Template.instance().type.get() === "image";
  },
  gif: function() {
    return Template.instance().type.get() === "gif";
  },
  map: function() {
    return Template.instance().type.get() === "map";
  },
  video: function() {
    return Template.instance().type.get() === "video";
  },
  twitter: function() {
    return Template.instance().type.get() === "twitter";
  },
  viz: function() {
    return Template.instance().type.get() === "viz";
  },
  audio: function() {
    return Template.instance().type.get() === "audio";
  },
  link: function() {
    return Template.instance().type.get() === "link";
  },
  remix: function() {
    return Template.instance().type.get() === "remix";
  }
});

Template.create_horizontal_section_block.helpers({
  left: function() {
    var cardWidth, halfWidth, width;
    width = Session.get("windowWidth");
    if (width < 1024) {
      width = 1024;
    }
    halfWidth = width / 2;
    cardWidth = Session.get("cardWidth");
    return 75 + halfWidth + (Session.get("separation")) * 1.5;
  }
});

Template.create_horizontal_section_block.events({
  'click .text-button': function(d, t) {
    return t.type.set('text');
  },
  'click .map-button': function(d, t) {
    return t.type.set('map');
  },
  'click .video-button': function(d, t) {
    return t.type.set('video');
  },
  'click .image-button': function(d, t) {
    return t.type.set('image');
  },
  'click .gif-button': function(d, t) {
    return t.type.set('gif');
  },
  'click .twitter-button': function(d, t) {
    return t.type.set('twitter');
  },
  'click .viz-button': function(d, t) {
    return t.type.set('viz');
  },
  'click .audio-button': function(d, t) {
    return t.type.set('audio');
  },
  'click .link-button': function(d, t) {
    return t.type.set('link');
  },
  'click .remix-button': function(d, t) {
    return t.type.set('remix');
  }
});

renderTemplate = function(d, templateName, context) {
  var parentSection, srcE;
  srcE = d.srcElement ? d.srcElement : d.target;
  parentSection = $(srcE).closest('section');
  parentSection.empty();
  if (context) {
    return UI.insert(UI.renderWithData(templateName, context), parentSection.get(0));
  } else {
    return UI.insert(UI.render(templateName), parentSection.get(0));
  }
};

Template.horizontal_context.helpers({
  lastUpdate: function() {
    Session.get('lastUpdate');
  }
});

var findPlaceholderLink = function(verticalSectionIndex){
  return $('.vertical-narrative-section[data-vertical-index="' + verticalSectionIndex + '"]').find('a.placeholder');
};

var removePlaceholderLinks = function(){
  return $('.vertical-narrative-section').find('a.placeholder').contents().unwrap();
};

Template.context_anchor_new_card_option.events = {
  "mousedown": function(e) {
    e.preventDefault();
    hideFoldEditor();
    removePlaceholderLinks();
    var placeholderHrefToken = '#LinkToNextCard';

    document.execCommand('createLink', false, placeholderHrefToken);
    var placeholderAnchorElement = $('a[href="' + placeholderHrefToken +'"]'); // find temporary anchor
    placeholderAnchorElement.attr('href', 'javascript:void(0);'); // get rid of temporary href

    placeholderAnchorElement.addClass('placeholder');

    return showNewHorizontalUI();
  }
};

Template.context_anchor_option.events = {
  "mousedown": function (e) {
    var contextId, link;
    e.preventDefault();
    hideFoldEditor();
    contextId = this._id;

    // need to create temporary link because want to take advantage of createLink browser functionality
    // but the link really gets interacted with via the 'data-context-id' attribute
    var temporaryHrefToken = '#OhSuChToken';
    document.execCommand('createLink', false, temporaryHrefToken);
    var temporaryAnchorElement = $('a[href="' + temporaryHrefToken +'"]'); // find temporary anchor
    temporaryAnchorElement.attr('href', 'javascript:void(0);'); // get rid of temporary href
    temporaryAnchorElement.attr('data-context-id', contextId); // set data attributes correctly
    temporaryAnchorElement.attr('data-context-type', this.type);

    temporaryAnchorElement.addClass('active'); // add active class because we go to this context and if we're already there it won't get the class

    //temporaryAnchorElement.data({contextId: contextId});
    saveUpdatedSelection();
    goToContext(contextId);
    return false;
  }
};

window.addContext = function(contextBlock) {
  var storyId = Session.get("storyId");
  var verticalIndex = Session.get("currentY");
  Session.set('query', null); // clear query so it doesn't seem like you're editing this card next time open the new card menu
  Session.set('saveState', 'saving');

  Meteor.call('addContextToStory', storyId, contextBlock, verticalIndex, function(err, contextId){
    if(contextId){
      hideNewHorizontalUI();
      var placeholderAnchorElement = findPlaceholderLink(verticalIndex);
      if (placeholderAnchorElement) {
        placeholderAnchorElement.attr('data-context-id', contextId); // set data attributes correctly
        placeholderAnchorElement.attr('data-context-type', contextBlock.type);
        placeholderAnchorElement.removeClass('placeholder'); // add active class because we go to this context and if we're already there it won't get the class
        saveNarrativeSectionContent(verticalIndex);
      }
      goToContext(contextId);
    }
    saveCallback(err, contextId);
  });
};

window.removeContextFromStory = function(storyId, contextId, verticalSectionIndex, cb) {
  var pushObject, pushSelectorString;
  pushSelectorString = 'draftStory.verticalSections.' + verticalSectionIndex + '.contextBlocks';
  pullObject = {};
  pullObject[pushSelectorString] = contextId;
  return Meteor.call('saveStory', {
    _id: storyId
  }, {
    $pull: pullObject
  }, function(err, numDocs) {
    if (numDocs) {
      Session.set("addingContext", null);
      Session.set("editingContext", null);
    }
    saveCallback(err, numDocs, cb);
  });
};

Template.horizontal_section_edit_delete.helpers({
  canMoveLeft: function () {
    return this.index;
  },
  canMoveRight: function () {
    return this.index < Session.get('story').verticalSections[this.verticalIndex].contextBlocks.length - 1;
  }
});
Template.horizontal_section_block.events({
  "click .delete": function(d) {
    if(confirm("Permanently delete this card?")){
      Session.set('saveState', 'saving');
      id = this._id;
      window.removeContextFromStory(Session.get("storyId"), id, Session.get("currentY"), function(err){
        if(err){
          return saveCallback(err);
        }
        ContextBlocks.remove(id, saveCallback);
      });
    }
  },
  "click .move-card-left": function() {
    var that = this;

    Session.set('saveState', 'saving');
    return Meteor.call('moveHorizontalContextLeftOne', Session.get('storyId'), this.verticalIndex, this.index, function(err, numDocs) {
      if (numDocs) {
        goToContext(that._id);
      }
      saveCallback(err, numDocs);
    });
  },
  "click .move-card-right": function() {
    var that = this;

    Session.set('saveState', 'saving');
    return Meteor.call('moveHorizontalContextRightOne', Session.get('storyId'), this.verticalIndex, this.index, function(err, numDocs) {
      if (numDocs) {
        goToContext(that._id);
      }
      saveCallback(err, numDocs);
    });
  },
  "click .edit": function(e, t) {
    Session.set('editingContext', this._id);
    return Session.set('addingContext', false);
  }
});

Template.create_options.events({
  "click .publish-story": function() {
    return alert("Publish will be available soon! You'll be able to use it to submit your story to be featured on our site when we launch in early April.");
  },
  "click .toggle-preview": function() {
    if (Session.get('read')) {
      window.refreshContentDep.changed();
      Session.set('read', false);
    } else {
      Session.set('read', true);
    }
  },
  "change input.file-upload": function(){
    var storyId = Session.get('storyId');
    var files = $("input.file-upload")[0].files
    S3.upload({
      files: files,
      path: "header-images"
    }, function(e, r) {
      var filename = r.file.name;
      Session.set('saveState', 'saving');
      return Meteor.call('updateHeaderImage', storyId, filename, saveCallback);
    });
  },
});

Template.link_twitter.events({
  "click button": function() {
    Meteor.linkWithTwitter({
      requestPermissions: ['user']
    }, function (err) {
      if (err) {
        alert("Twitter login failed");
        throw(err);
      }
    });
  }
});
