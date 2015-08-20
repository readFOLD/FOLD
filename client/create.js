window.enclosingAnchorTag = null;
window.selectedNode = null;

var saveUpdatedSelection = function () {
  $(window.selectedNode).closest('.content').blur();
};

var removeAnchorTag = function(tag){
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

Template.context_anchor_menu_contents.events({
  'mouseenter .context-anchor-menu-contents': function() {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave .context-anchor-menu-contents': function(){
    document.body.style.overflow='auto';
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
//
//Template.vertical_section_block.events({
//  'blur [contenteditable]': window.updateUIBasedOnSelection,
//  'keyup [contenteditable]': window.updateUIBasedOnSelection,
//  'blur .title[contenteditable]' : function(e, template){
//    Session.set('saveState', 'saving');
//
//    Meteor.call('updateVerticalSectionTitle', Session.get('storyId'), template.data.index, $.trim(template.$('div.title').text()), saveCallback);
//    return true;
//  },
//  'keydown .title[contenteditable]' : function(e, template){
//    if (e.keyCode === 13){ // enter
//      e.preventDefault();
//      template.$('.content').focus();
//    }
//    return true;
//  },
//  'blur .content[contenteditable]' : saveVerticalSectionContent,
//  'keyup .content[contenteditable]' : throttledSaveVerticalSectionContent,
//  'paste .fold-editable': function(e) {
//    var clipboardData, html;
//    e.preventDefault();
//    clipboardData = (e.originalEvent || e).clipboardData;
//    if (!clipboardData){return}
//    html = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
//
//    document.execCommand('insertHTML', false, window.cleanVerticalSectionContent(html));
//    analytics.track('Paste into fold-editable area');
//  },
//  'drop': function(e){
//    e.preventDefault();
//    analytics.track('Drop (attempt) into fold-editable area');
//    return false;
//  },
//  'paste .title.editable': window.plainTextPaste,   // only allow plaintext in title
//  'mouseenter .narrative-babyburger-and-menu': function(e, template){
//    template.babyburgerOpen.set(true);
//  },
//  'mouseleave .narrative-babyburger-and-menu': function(e, template){
//    template.babyburgerOpen.set(false);
//  }
//});

window.refreshContentDep = new Tracker.Dependency();
//
//Template.vertical_section_block.onCreated(function() {
//  this.semiReactiveContent = new ReactiveVar(); // used in edit mode so that browser undo functionality doesn't break when autosave
//  this.babyburgerOpen = new ReactiveVar(false);
//  var that = this;
//  this.autorun(function() {
//    window.refreshContentDep.depend();
//    that.semiReactiveContent.set(that.data.content)
//  });
//});
//
//Template.vertical_section_block.onRendered(function() {
//  var that = this;
//  if (!Meteor.Device.isPhone()){ // highlight active context card link except on mobile
//    this.autorun(function() {
//      Session.get('read') // make reactive to switching between preview and edit
//      var currentXId = Session.get('currentXId');
//      var pastHeader = Session.get("pastHeader");
//      if(Session.equals("currentYId", that.data._id) && pastHeader){ // if block is selected
//        if (currentXId){ // if there is a current context card
//          Meteor.setTimeout(function(){
//            that.$('a[data-context-id="' + currentXId + '"]').addClass('active');
//            that.$('a[data-context-id!="' + currentXId + '"]').removeClass('active');
//          }, 0)
//        }
//      } else {
//        Meteor.setTimeout(function(){
//          that.$('a').removeClass('active');
//        }, 0)
//      }
//    });
//  }
//});

//Template.vertical_section_block.helpers({
//  babyburgerOpen: function(){
//    return Template.instance().babyburgerOpen.get();
//  }
//});
//



var scrollToRelativePosition = function(offset) {
  var selectedNarrative = $('.vertical-narrative-section.selected');
  if (selectedNarrative){
    $('body,html').animate({
      scrollTop: $('.vertical-narrative-section.selected').position().top + offset
    }, 200, 'easeInCubic');
  }
};

var showNewHorizontalUI = function() {
  scrollToRelativePosition(350 + 29);
  Session.set("addingContext", Session.get('currentYId'));
  return Session.set("editingContext", null);
};

window.hideNewHorizontalUI = function() {
  scrollToRelativePosition(350 + 29 - 93);
  return Session.set("addingContext", null);
};


Template.stream_search.events({
  'mouseenter .horizontal-narrative-section': function() {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave .horizontal-narrative-section': function(){
    document.body.style.overflow='auto';
  }
});


contextHelpers = ({
  type: function() {
    return Session.get('mediaDataType');
  },
  stream: function() {
    return Session.get('mediaDataType') === "stream";
  },
  text: function() {
    return Session.get('mediaDataType') === "text";
  },
  image: function() {
    return Session.get('mediaDataType') === "image";
  },
  news: function() {
    return Session.get('mediaDataType') === "news";
  },
  map: function() {
    return Session.get('mediaDataType') === "map";
  },
  video: function() {
    return Session.get('mediaDataType') === "video";
  },
  twitter: function() {
    return Session.get('mediaDataType') === "twitter";
  },
  audio: function() {
    return Session.get('mediaDataType') === "audio";
  },
  link: function() {
    return Session.get('mediaDataType') === "link";
  },
  chat: function() {
    return Session.get('mediaDataType') === "chat";
  }
});

Template.add_context.helpers({
  listMode: function(){
    return emptyContextBlockOfCurrentMediaDataType().searchList;
  },
  searchListTemplate: function(){
    return emptyContextBlockOfCurrentMediaDataType().searchListTemplate;
  },
  searchSoloTemplate: function(){
    return emptyContextBlockOfCurrentMediaDataType().searchSoloTemplate;
  }
});

Template.content_icons.helpers(contextHelpers);
Template.content_icons.helpers({
  show_stream_icon: function () {
    return Session.get("curateMode");
  },
  show_text_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("text");
  },
  show_image_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("image");
  },
  show_news_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("news");
  },
  show_map_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("map");
  },
  show_video_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("video");
  },
  show_twitter_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("twitter");
  },
  show_audio_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("audio");
  },
  show_link_icon: function () {
    return this.showAll || Session.get("curateMode") || this.hasContextOfType("link");
  },
  show_chat_icon: function () {
    return true;
  },
  disableAllButStream: function (){
    return _.contains(['find_stream'], this.creationStep);
  }
});


Template.content_icons.events({
  'click .stream-button': function(d, t) {
    return Session.set('mediaDataType', 'stream');
  },
  'click .text-button': function(d, t) {
    Session.set('mediaDataType', 'text');
  },
  'click .map-button': function(d, t) {
    Session.set('mediaDataType', 'map');
  },
  'click .video-button': function(d, t) {
    Session.set('mediaDataType', 'video');
  },
  'click .image-button': function(d, t) {
    Session.set('mediaDataType', 'image');
  },
  'click .news-button': function(d, t) {
    Session.set('mediaDataType', 'news');
  },
  'click .twitter-button': function(d, t) {
    Session.set('mediaDataType', 'twitter');
  },
  'click .audio-button': function(d, t) {
    Session.set('mediaDataType', 'audio');
  },
  'click .link-button': function(d, t) {
    Session.set('mediaDataType', 'link');
  },
  'click .chat-button': function(d, t) {
    notifyFeature("Chat: coming soon!");
    return Session.set('mediaDataType', 'chat');
  }
});

Template.add_context.events({
  'mouseenter .search-results-container': function() {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave .search-results-container': function(){
    document.body.style.overflow='auto';
  }
});

window.findPlaceholderLink = function(verticalSectionIndex){
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

    showNewHorizontalUI();
    analytics.track('Click add new card inside fold editor');
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
    temporaryAnchorElement.attr('data-context-source', this.source);

    temporaryAnchorElement.addClass('active'); // add active class because we go to this context and if we're already there it won't get the class

    //temporaryAnchorElement.data({contextId: contextId});
    saveUpdatedSelection();
    goToContext(contextId);
    analytics.track('Click add link to context option inside fold editor');
    return false;
  }
};

window.addStream = function(stream) {
  Session.set('query', null); // clear query so it doesn't seem like you're editing this card next time open the new card menu
  Session.set('saveState', 'saving');

  Meteor.call('addStreamToStream', Session.get("streamShortId"), stream, function(err, streamId){
    saveCallback(err, streamId);
  });
};

window.addContext = function(contextBlock) {
  Session.set('query', null); // clear query so it doesn't seem like you're editing this card next time open the new card menu
  Session.set('saveState', 'saving');

  Meteor.setTimeout(function(){
    $('.context-section textarea').focus();
  });


  contextBlock._id = Random.id(9);

  Meteor.call('addContextToStream', Session.get("streamShortId"), contextBlock, function(err, contextId){
    saveCallback(err, contextId);
  });
};

//Template.horizontal_section_block.events({
//  "click .delete": function(d) {
//    analytics.track('Click delete horizontal');
//    if(confirm("Permanently delete this card?")){
//      var currentY = Session.get("currentY");
//      Session.set('saveState', 'saving');
//      id = this._id;
//      removeAnchorTag($('.vertical-narrative-section[data-vertical-index="'+ currentY +'"] .content a[data-context-id="' + id + '"]'));
//      Meteor.call('removeContextFromStory', Session.get("storyId"), id, currentY, saveCallback);
//      analytics.track('Confirm delete horizontal');
//    }
//  },
//  "click .edit": function(e, t) {
//    Session.set('editingContext', this._id);
//    Session.set('addingContext', false);
//    analytics.track('Click edit horizontal');
//  }
//});

Template.link_twitter.events({
  "click button": function() {
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
    analytics.track('Click Link Twitter');
  }
});
//
//Template.publish_overlay.onRendered(function(){
//  this.$('#story-tags-input').tagsInput({
//    minInputWidth: '80px',
//    width: '100%',
//    height: '83px'
//  });
//});
//
//Template.publish_overlay.helpers({
//  'keywordsString': function(){
//    return (this.keywords || []).toString();
//  }
//});
