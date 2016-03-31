window.enclosingAnchorTag = null;
window.selectedNode = null;

var saveUpdatedSelection = function () {
  $(window.selectedNode).closest('.content').blur();
};

window.removeAnchorTag = function(tag){
  parentDiv = $(tag).closest('.content');
  $(tag).contents().unwrap();
  parentDiv.blur();
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
      var selectionLength = window.getSelection().toString().length;

      if (selectionType !== 'None'){//(selectionType === 'Range' || selectionType === 'Caret' ) {
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

        // only do if selection is inside a fold-editable block
        if($(parentNode).hasClass('fold-editable') || $(parentNode).parents('.fold-editable').length) {
          while (parentNode.tagName !== undefined && parentNode.tagName.toLowerCase() !== 'div') {
            tagName = parentNode.tagName.toLowerCase();
            selectedTags.push(tagName);

            if (selectionType !== 'Range' && tagName === 'a') { // we want type === 'Caret', but firefox doesn't do that, so just avoid range
              window.enclosingAnchorTag = parentNode;
              break;
            }
            parentNode = parentNode.parentNode;
          }

          Session.set('selectedTags', selectedTags);

          // TO-DO actually get this from selection
          if (e) {
            if (selectionType === 'Range' || selectionLength) { // need to check selection length for firefox
              showFoldEditor();
              boundary = range.getBoundingClientRect();
              boundaryMiddle = (boundary.left + boundary.right) / 2;
              $('#fold-editor').css('left', boundaryMiddle - 205/2 + $(window).scrollLeft());
              return $('#fold-editor').css('top', boundary.top - 70 + $(window).scrollTop());
            } else if (window.enclosingAnchorTag) {
              showFoldLinkRemover();
              var offset = $(window.selectedNode).offset();
              var posY = offset.top;
              var posX = offset.left + $(window.selectedNode).width();
              $('#fold-link-remover').css('left', posX - 8);
              return $('#fold-link-remover').css('top', posY - 35);
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

Template.create.onCreated(function() {
  this.publishing = new ReactiveVar();
  this.headerImageLoading = new ReactiveVar();

  this.autorun(() => {
    if (adminMode) {
      this.subscribe('adminOtherUserPub', this.data.authorId); // for admins to see author info when read draft
    }
  })
});

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
    switch(Session.get('saveState')) {
      case 'saving':
        Session.set('saving', true);
        break;
      case 'failed':
        notifyError('Saving failed. Please refresh and try again.');
        alert('Saving failed. Please refresh and try again.');
        break;
      case 'saved':
        Session.set('saving', false);
        break;
    }
  });

  this.autorun(function(){
    if (Session.get('read') || Session.get('currentYId')){
      return window.hideFoldAll();
    }
  });





  this.autorun(function() { // Hide add card menu when scroll
    var y = Session.get('currentY'); // so reacts to changes in currentY
    if(y !== Session.get('previousY')){
      Session.set("addingContext", null);
    }
    Session.set('previousY', y)
  });

  this.autorun(function() { // update UI when start and stop adding/editing context
    var currentContextBlocks, currentY, horizontalContextDiv, story, _ref;
    if (Session.get('currentYId')) {
      horizontalContextDiv = $(".horizontal-context");
      horizontalContextDiv.removeClass('editing');
      if (Session.get("addingContext")) { // editing individual cards isn't currently a thing // || (_ref = Session.get("editingContext"), __indexOf.call(currentContextBlocks, _ref) >= 0)) {
        Session.set("showMinimap", false);
        return horizontalContextDiv.addClass('editing');
      } else {
        Session.set("showMinimap", true);
        if (document.body){
          if(!Session.get('read') && !Session.get('metaview')){
            document.body.style.overflow = 'auto'; // return scroll to document in case it lost it
            removePlaceholderLinks();
          }
        }
      }
    }
  });

  if (!(Session.equals("currentY", void 0) && Session.equals("currentX", void 0))) {
    $('.attribution, #to-story').fadeOut(1);
    goToY(Session.get("currentY"));
    goToX(Session.get("currentX"));
  }

  $(window).scrollTop(Session.get('scrollTop'));
  window.updateCurrentY(); // needs to be manually triggered for better hot code reload behavior (perhaps due to throttle)

});

Template.fold_editor.helpers({
  boldActive () {
    return _.intersection(['b', 'strong'], Session.get('selectedTags')).length;
  },
  italicActive () {
    return _.intersection(['i', 'em'], Session.get('selectedTags')).length;
  },
  underlineActive () {
    return _.intersection(['u'], Session.get('selectedTags')).length;
  },
  anchorActive () {
    return _.intersection(['a'], Session.get('selectedTags')).length || Session.get('contextAnchorMenuOpen') || Session.get('anchorMenuOpen');
  }
});

Template.fold_editor.events({
  'mouseup'  () {
    window.updateUIBasedOnSelection()
  },
  'mouseup .bold-button' (e) {
    e.preventDefault();
    document.execCommand('bold', false, null);
    saveUpdatedSelection();
  },
  'mouseup .italic-button' (e) {
    e.preventDefault();
    document.execCommand('italic', false, null);
    saveUpdatedSelection();
  },
  'mouseup .underline-button' (e) {
    e.preventDefault();
    document.execCommand('underline', false, null);
    saveUpdatedSelection();
  },
  'mouseup .anchor-button' (e) {
    e.preventDefault();
    return toggleAnchorMenu();
  }
});

Template.context_anchor_menu_contents.events({
  'mouseenter .context-anchor-menu-contents' () {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave .context-anchor-menu-contents' (){
    document.body.style.overflow='auto';
  }
});

Template.context_anchor_go_back.events({
  'mouseup' (e) {
    e.preventDefault();
    hideContextAnchorMenu();
    return showAnchorMenu();
  }
});

Template.anchor_menu.events({
  'mouseup .link-to-card' (e) {
    e.preventDefault();
    hideAnchorMenu();
    return showContextAnchorMenu();
  },
  'mouseup .link-out-of-story' (e) {
    return e.preventDefault();
  }
});

Template.fold_link_remover.events({
  'mouseup button' (e) {
    e.preventDefault();
    removeAnchorTag(window.enclosingAnchorTag);
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



window.saveCallback =  function(err, success, cb) {
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


var saveVerticalSectionContent = function(e, template) {
  Session.set('saveState', 'saving');

  Meteor.call('updateVerticalSectionContent',
    Session.get('storyId'),
    template.data.index,
    cleanVerticalSectionContent($.trim(template.$('div.content').html())),
    saveCallback);
  return true;
};

var throttledSaveVerticalSectionContent = _.throttle(saveVerticalSectionContent, 4000, {trailing: false});

Template.vertical_section_block.events({
  'blur [contenteditable]': window.updateUIBasedOnSelection,
  'keyup [contenteditable]': window.updateUIBasedOnSelection,
  'blur .title[contenteditable]'  (e, template){
    Session.set('saveState', 'saving');

    Meteor.call('updateVerticalSectionTitle', Session.get('storyId'), template.data.index, $.trim(template.$('div.title').text()), saveCallback);
    return true;
  },
  'keydown .title[contenteditable]'  (e, template){
    if (e.keyCode === 13){ // enter
      e.preventDefault();
      template.$('.content').focus();
    }
    return true;
  },
  'blur .content[contenteditable]' : saveVerticalSectionContent,
  'keyup .content[contenteditable]' : throttledSaveVerticalSectionContent,
  'paste .fold-editable' (e, t) {
    var clipboardData, html;
    e.preventDefault();
    clipboardData = (e.originalEvent || e).clipboardData;
    if (!clipboardData){return}
    html = clipboardData.getData('text/html') || clipboardData.getData('text/plain');

    var cleanedHtml = window.cleanVerticalSectionContent(html);

    jqHtml = $('<div>' + cleanedHtml + '</div>');
    jqHtml.find('a').each(function(){
      let contextId = $(this).data('contextId');

      if(!_.contains(t.data.contextBlocks, contextId)){ // if this link isn't to a context card in this row
        $(this).contents().unwrap();
      }
    });
    var htmlToPaste = jqHtml.html();

    document.execCommand('insertHTML', false, htmlToPaste);
    trackEvent('Paste into fold-editable area');
  },
  'drop' (e){
    e.preventDefault();
    trackEvent('Drop (attempt) into fold-editable area');
    return false;
  },
  'paste .title.editable': window.plainTextPaste,   // only allow plaintext in title
  'mouseenter .narrative-babyburger-and-menu' (e, template){
    template.babyburgerOpen.set(true);
  },
  'mouseleave .narrative-babyburger-and-menu' (e, template){
    template.babyburgerOpen.set(false);
  }
});

window.refreshContentDep = new Tracker.Dependency();

Template.vertical_section_block.onCreated(function() {
  this.semiReactiveContent = new ReactiveVar(); // used in edit mode so that browser undo functionality doesn't break when autosave
  this.babyburgerOpen = new ReactiveVar(false);
  this.autorun(() => {
    window.refreshContentDep.depend();
    this.semiReactiveContent.set(this.data.content)
  });
});

Template.vertical_section_block.onRendered(function () {
  this.autorun(() => {
    if (!hiddenContextMode()) {
      Session.get('read') // make reactive to switching between preview and edit
      var currentXId = Session.get('currentXId');
      var pastHeader = Session.get("pastHeader");
      if (Session.equals("currentYId", this.data._id) && pastHeader) { // if block is selected
        if (currentXId) { // if there is a current context card
          Meteor.setTimeout(() => {
            this.$('a[data-context-id="' + currentXId + '"]').addClass('active');
            this.$('a[data-context-id!="' + currentXId + '"]').removeClass('active');
          }, 0)
        }
      } else {
        Meteor.setTimeout(() => {
          this.$('a').removeClass('active');
        }, 0)
      }
    } else {
      this.$('a').removeClass('active');
    }
  });
});

Template.vertical_section_block.helpers({
  babyburgerOpen (){
    return Template.instance().babyburgerOpen.get();
  }
});

var resizeStoryTitleFont = function(){
  var titleDiv = $('.story-title');
  var fontSize = 24;
  titleDiv.css({'font-size': (fontSize + 'px')});

  while((titleDiv.width() < titleDiv[0].scrollWidth) && fontSize > 12){
    fontSize -= 1;
    titleDiv.css({'font-size': (fontSize + 'px')});
  }
};

var resetStoryTitleFont = function(){
  var titleDiv = $('.story-title');
  var fontSize = 24;
  titleDiv.css({'font-size': (fontSize + 'px')});
};

Template.story_title.onRendered(function(){
  if(Session.get('read') && !window.hiddenContextMode()){
    Meteor.setTimeout(resizeStoryTitleFont, 100);
  } else {
    resetStoryTitleFont();
  }
  this.autorun(()=> {
    if(Session.get('read') && !window.hiddenContextMode()){
      windowSizeDep.depend();
      resizeStoryTitleFont();
    } else {
      resetStoryTitleFont();
    }
  })
});

Template.story_title.events({
  'paste [contenteditable]': window.plainTextPaste,
  'drop' (e){
    e.preventDefault();
    return false;
  },
  'blur .story-title[contenteditable]' (e,template) {
    storyId = Session.get('storyId');
    storyTitle = $.trim(template.$('div.story-title').text());

    Session.set('saveState', 'saving');
    return Meteor.call('updateStoryTitle', storyId, storyTitle, saveCallback)
  }
});

Template.create.helpers({
  publishing () {
    return Template.instance().publishing.get();
  },
  headerImageLoading () {
    return Template.instance().headerImageLoading.get();
  }
});

Template.create.events({
  'mouseup': window.updateUIBasedOnSelection, // this is here so that it fires when mouse goes off to the side of vertical section
  "click .publish-story"  (e, template) {
    var accessPriority = Meteor.user().accessPriority;
    if (!accessPriority || accessPriority > window.publishAccessLevel) {
      notifyInfo("Due to high demand, we had to turn off publish functionality for a moment. Stay tuned for updates!");
    } else {
      template.publishing.set(true);
      trackEvent('Click publish button');
    }
  },
  "click .cancel-publish"  (e, template) {
    template.publishing.set(false);
    trackEvent('Click cancel publish button');
  },
  "click .confirm-publish"  (e, template) {
    var title = template.$('input[name=confirm-title]').val();
    var keywords = _.compact(template.$('input[name=keywords]').val().split(','));
    var narrativeRightsReserved = template.$('input[name=reserve-rights]').is(':checked');
    return Meteor.call('publishStory', this._id, title, keywords, narrativeRightsReserved, (err, numDocs) => {
      template.publishing.set(false);
      if (err) {
        setTimeout(() => {
          throw(err);
        });
      }
      if (err || !numDocs) {
        notifyError('Publication failed');
      } else {
        Router.go('/profile/' + Meteor.user().username);
        notifySuccess('You story has been published!');
        trackEvent('Publish story', window.trackingInfoFromStory(Stories.findOne(this._id))); // TODO add info about author
      }
    });
  },
  "change input.header-upload" (e, template){
    var file = _.first(e.target.files);
    if (file) {
      if (file.size > CLOUDINARY_FILE_SIZE) {
        return notifyImageSizeError();
      }
      template.headerImageLoading.set(true);
      Session.set('saveState', 'saving');
      console.log('bbbbb')
      Cloudinary.upload([file], {}, (err, doc) => {
        console.log('lalalalal')
        if (err) {
          template.headerImageLoading.set(false);
          return saveCallback(err)
        }
        return Meteor.call('updateHeaderImage', this._id, doc.public_id, doc.format, (err, success) => {
          template.headerImageLoading.set(false);
          saveCallback(err, success)
        });
      });
      trackEvent('Change upload header on header');
    }
  }
});

Template.add_vertical.events({
  "click" () {
    var indexToInsert, storyId, verticalSections;
    storyId = Session.get('storyId');
    verticalSections = Session.get('story').verticalSections;
    indexToInsert = this.index != null ? this.index : verticalSections.length;

    return Meteor.call('insertVerticalSection', storyId, indexToInsert, Random.id(9), function(err, numDocs) {
      if (err) {
        notifyError(err);
        throw(err);
      }
      if (numDocs) {
        trackEvent('Add vertical section', {
          label: indexToInsert,
          verticalSectionIndex: indexToInsert
        });
      } else {
        notifyError('Inserting section failed');
      }
    });
  }
});

Template.vertical_edit_menu.helpers({
  canMoveUp  () {
    return this.index;
  },
  canMoveDown  () {
    return this.index < Session.get('story').verticalSections.length - 1;
  }
});
Template.vertical_edit_menu.events({
  "click .add-title" () {
    var storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    Meteor.call('addTitle', storyId, index, saveCallback);
    trackEvent('Click add section title');
  },
  "click .remove-title" () {
    var storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    Meteor.call('removeTitle', storyId, index, saveCallback);
    trackEvent('Click remove section title');
  },
  "click .move-card-up" () {
    var storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    Meteor.call('moveVerticalSectionUpOne', storyId, index, saveCallback);
    trackEvent('Click move card up');

  },
  "click .move-card-down" () {
    var storyId = Session.get('storyId');
    var index = this.index;

    Session.set('saveState', 'saving');
    Meteor.call('moveVerticalSectionDownOne', storyId, index, saveCallback);
    trackEvent('Click move card down');
  },
  "click .delete-card" () {
    if(confirm("Permanently delete this card and all associated context cards?")) {
      var storyId = Session.get('storyId');
      var index = this.index;

      Session.set('saveState', 'saving');
      Meteor.call('deleteVerticalSection', storyId, index, saveCallback);
      trackEvent('Click delete card');
    }
  }
});

Template.add_horizontal.helpers({
  left () {
    return getVerticalLeft() + Session.get("cardWidth") + Session.get("separation");
  }
});

var showNewHorizontalUI = function() {
  slideCurrentYIntoPlace();
  Session.set("addingContext", Session.get('currentYId'));
  return Session.set("editingContext", null);
};

window.hideNewHorizontalUI = function() {
  slideCurrentYIntoPlace();
  return Session.set("addingContext", null);
};

var defaultContextType = 'video';

var toggleHorizontalUI = function(forceBool) {

  if (!Session.get("addingContext")) {
    Session.set('newHorizontalDataType', defaultContextType);
    showNewHorizontalUI()
  } else {
    hideNewHorizontalUI()
  }
};


Template.add_horizontal.events({
  "click" (d) {
    toggleHorizontalUI();
    trackEvent('Click toggle horizontal editor');
  }
});

Template.create_horizontal_section_block.onCreated(function() {
  Session.setDefault('newHorizontalDataType', defaultContextType);
});

Template.create_horizontal_section_block.helpers({
  type () {
    return Session.get('newHorizontalDataType');
  },
  text () {
    return Session.get('newHorizontalDataType') === "text";
  },
  image () {
    return Session.get('newHorizontalDataType') === "image";
  },
  gif () {
    return Session.get('newHorizontalDataType') === "gif";
  },
  map () {
    return Session.get('newHorizontalDataType') === "map";
  },
  video () {
    return Session.get('newHorizontalDataType') === "video";
  },
  twitter () {
    return Session.get('newHorizontalDataType') === "twitter";
  },
  viz () {
    return Session.get('newHorizontalDataType') === "viz";
  },
  audio () {
    return Session.get('newHorizontalDataType') === "audio";
  },
  link () {
    return Session.get('newHorizontalDataType') === "link";
  },
  remix () {
    return Session.get('newHorizontalDataType') === "remix";
  }
});

Template.create_horizontal_section_block.helpers({
  left () {
    var addBlockWidth = 75;
    return addBlockWidth + getVerticalLeft() + Session.get("cardWidth") + 2 * Session.get("separation");
  },
  actionCardPrivileges (){
    var user = Meteor.user();
    return (user && user.privileges && user.privileges.actionCard)
  }
});

Template.create_horizontal_section_block.events({
  'click .text-button' (d, t) {
    return Session.set('newHorizontalDataType', 'text');
  },
  'click .map-button' (d, t) {
    return Session.set('newHorizontalDataType', 'map');
  },
  'click .video-button' (d, t) {
    return Session.set('newHorizontalDataType', 'video');
  },
  'click .image-button' (d, t) {
    return Session.set('newHorizontalDataType', 'image');
  },
  'click .gif-button' (d, t) {
    return Session.set('newHorizontalDataType', 'gif');
  },
  'click .twitter-button' (d, t) {
    return Session.set('newHorizontalDataType', 'twitter');
  },
  'click .viz-button' (d, t) {
    return Session.set('newHorizontalDataType', 'viz');
  },
  'click .audio-button' (d, t) {
    return Session.set('newHorizontalDataType', 'audio');
  },
  'click .link-button' (d, t) {
    return Session.set('newHorizontalDataType', 'link');
  },
  'click .remix-button' (d, t) {
    return Session.set('newHorizontalDataType', 'remix');
  },
  'click .add-action-button' (d, t) {
    addContext({type: 'action'});
    hideNewHorizontalUI();
  },
  'mouseenter .horizontal-narrative-section' () {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave .horizontal-narrative-section' (){
    document.body.style.overflow='auto';
  }
});

Template.horizontal_context.helpers({
  lastUpdate () {
    Session.get('lastUpdate');
  }
});

window.findPlaceholderLink = function(verticalSectionIndex){
  return $('.vertical-narrative-section[data-vertical-index="' + verticalSectionIndex + '"]').find('a.placeholder');
};

var removePlaceholderLinks = function(){
  return $('.vertical-narrative-section').find('a.placeholder').contents().unwrap();
};

Template.context_anchor_new_card_option.events = {
  "mousedown" (e) {
    e.preventDefault();
    hideFoldEditor();
    removePlaceholderLinks();
    var placeholderHrefToken = '#LinkToNextCard';

    document.execCommand('createLink', false, placeholderHrefToken);
    var placeholderAnchorElement = $('a[href="' + placeholderHrefToken +'"]'); // find temporary anchor
    placeholderAnchorElement.attr('href', 'javascript:void(0);'); // get rid of temporary href

    placeholderAnchorElement.addClass('placeholder');

    showNewHorizontalUI();
    trackEvent('Click add new card inside fold editor');
  }
};

Template.context_anchor_option.events = {
  "mousedown"  (e) {
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
    temporaryAnchorElement.attr('data-context-source', this.source);
    temporaryAnchorElement.attr('data-anchor-id', Random.id(8));

    temporaryAnchorElement.addClass('active'); // add active class because we go to this context and if we're already there it won't get the class

    //temporaryAnchorElement.data({contextId: contextId});
    saveUpdatedSelection();
    goToContext(contextId);
    trackEvent('Click add link to context option inside fold editor');
    return false;
  }
};

window.addContext = function(contextBlock) {
  var storyId = Session.get("storyId");
  var verticalIndex = Session.get("currentY");
  Session.set('query', null); // clear query so it doesn't seem like you're editing this card next time open the new card menu
  Session.set('saveState', 'saving');

  Meteor.call('addContextToStory', storyId, Session.get("storyShortId"), contextBlock, verticalIndex, function(err, contextId){
    if (contextId){
      saveNarrativeSectionContent(verticalIndex);
    }
    saveCallback(err, contextId);
  });
};

Template.horizontal_section_edit_delete.helpers({
  canMoveLeft  () {
    return this.index;
  },
  canMoveRight  () {
    return this.index < Session.get('story').verticalSections[this.verticalIndex].contextBlocks.length - 1;
  }
});
Template.horizontal_section_block.events({
  "click .delete" (d) {
    trackEvent('Click delete horizontal');
    if(confirm("Permanently delete this card?")){
      var currentY = Session.get("currentY");
      Session.set('saveState', 'saving');
      id = this._id;
      removeAnchorTag($('.vertical-narrative-section[data-vertical-index="'+ currentY +'"] .content a[data-context-id="' + id + '"]'));
      Meteor.call('removeContextFromStory', Session.get("storyId"), id, currentY, saveCallback);
      trackEvent('Confirm delete horizontal');
    }
  },
  "click .edit" (e, t) {
    Session.set('editingContext', this._id);
    Session.set('addingContext', false);
    trackEvent('Click edit horizontal');
  }
});

Template.create_options.events({
  "click .toggle-preview" () {
    if (Session.get('read')) {
      window.refreshContentDep.changed();
      Session.set('read', false);
      trackEvent('Click toggle preview off');
    } else {
      Session.set('read', true);
      trackEvent('Click toggle preview on');
    }
  }
});

Template.link_twitter.events({
  "click button" () {
    Meteor.linkWithTwitter({
      requestPermissions: ['user']
    }, function (err) {
      if (err) {
        notifyError("Twitter login failed");
        throw(err);
      } else if (!Meteor.user().profile.bio){
        Meteor.call('setBioFromTwitter')
      }
    });
    trackEvent('Click Link Twitter');
  }
});

Template.publish_overlay.onRendered(function(){
  this.$('#story-tags-input').tagsInput({
    minInputWidth: '80px',
    width: '100%',
    height: '83px'
  });
});

Template.publish_overlay.helpers({
  'keywordsString' (){
    return (this.keywords || []).toString();
  }
});

Template.publish_overlay.events({
  'click .header-upload' (e, t) {
    Meteor.setTimeout(function(){
      $('body,html').animate({
        scrollTop: 0
        }, 500, 'easeInExpo')}
      , 1500)
    trackEvent('Click upload header inside publish dialog');
  }
});
