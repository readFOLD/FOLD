var addContextToStory, autoFormContextAddedHooks, createBlockEvents, createBlockHelpers, hideNewHorizontalUI, renderTemplate, showNewHorizontalUI, toggleHorizontalUI,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.updateUIBasedOnSelection = function(e){
  var selection = window.getSelection();

  // Based off of code from https://github.com/daviferreira/medium-editor
  return setTimeout((function(_this) {
    return function() {
      var boundary, boundaryMiddle, pageYOffset, range;
      if (window.getSelection().type === 'Range') {
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
        var selectedTags = [];

        while (parentNode.tagName !== undefined && parentNode.tagName.toLowerCase() !== 'div') {
          selectedTags.push(parentNode.tagName.toLowerCase());

          parentNode = parentNode.parentNode;
        }
        Session.set('selectedTags', selectedTags);

        // TODO actually get this from selection
        if(e) {
          boundary = range.getBoundingClientRect();
          boundaryMiddle = (boundary.left + boundary.right) / 2;
          pageYOffset = $(e.target).offset().top;
          $('#fold-editor').show();
          $('#fold-editor').css('left', e.pageX - 100);
          return $('#fold-editor').css('top', e.pageY - 70);
        }
      } else {
        return hideFoldEditor();
      }
    };
  })(this));
};

window.plainTextPaste = function(e) {
  var clipboardData = (e.originalEvent || e).clipboardData;
  e.preventDefault();
  return document.execCommand('insertText', false, clipboardData.getData('text/plain'));
};

Template.create.rendered = function() {
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
  window.hideFoldEditor = function() {
    $('#fold-editor').hide();
    hideContextAnchorMenu();
    return hideAnchorMenu();
  };
  if (!(Session.equals("currentY", void 0) && Session.equals("currentX", void 0))) {
    $('.attribution, #to-story').fadeOut(1);
    goToY(Session.get("currentY"));
    return goToX(Session.get("currentX"));
  }
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
    return window.document.execCommand('bold', false, null);
  },
  'mouseup .italic-button': function(e) {
    e.preventDefault();
    return window.document.execCommand('italic', false, null);
  },
  'mouseup .underline-button': function(e) {
    e.preventDefault();
    return window.document.execCommand('underline', false, null);
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
  }, setObject, {removeEmptyStrings: false}, function(err, numDocs) {
    if (err) {
      Session.set('saveState', 'failed');
    }
    if (!numDocs) {
      return alert('No docs updated');
      Session.set('saveState', 'failed');
    }
    Session.set('saveState', 'saved');
  });
};

Template.vertical_section_block.events({
  'mouseup .fold-editable': window.updateUIBasedOnSelection,
  'blur': window.updateUIBasedOnSelection,
  'blur .title' : function(e, template){
    autoSaveVerticalSectionField(template, 'title');
    return true;
  },
  'blur .content' : function(e, template){
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
    console.log('clean the html')

    return document.execCommand('insertHTML', false, window.cleanVerticalSectionContent(html));
  },
  'paste .title.editable': window.plainTextPaste   // only allow plaintext in title
});

window.refreshContentDep = new Tracker.Dependency();

Template.vertical_section_block.created = function() {
  this.semiReactiveContent = new ReactiveVar(); // used in edit mode so that browser undo functionality doesn't break when autosave
  var that = this;
  this.autorun(function() {
    window.refreshContentDep.depend();
    that.semiReactiveContent.set(that.data.content)
  });
};

Template.story_title.events({
  'paste [contenteditable]': window.plainTextPaste,
  'blur .story-title[contenteditable]': function(e,template) {
    storyId = Session.get('storyId');
    storyTitle = $.trim(template.$('div.story-title').text());

    return Meteor.call('updateStoryTitle', storyId, storyTitle, function (err, numDocs) {
      if (err) {
        return alert(err);
      }
      if (!numDocs) {
        return alert('No docs updated');
      }
    });
  }
});

Template.background_image.helpers({
  backgroundImage: function() {
    if (this.backgroundImage) {
      return this.backgroundImage;
    } else {
      return Session.get("backgroundImage");
    }
  }
});

Template.background_image.events({
  "click div.save-background-image": function() {
    return Session.set("backgroundImage", $('input.background-image-input').val());
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
    console.log(indexToInsert);
    // TODO - Once Meteor upgrades to use Mongo 2.6
    // This should use the $position operator and work directly there
    // Also, can probably get rid of the blackbox: true on verticalSections in the schema!
    verticalSections.splice(indexToInsert, 0, {
      _id: Random.id(8),
      contextBlocks: [],
      title: "",
      content: ""
    });

    return Meteor.call('saveStory', {
      _id: storyId
    }, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
    }, {removeEmptyStrings: false}, function(err, numDocs) {
      if (err) {
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

Template.add_horizontal.helpers({
  left: function() {
    var cardWidth, halfWidth, width;
    width = Session.get("width");
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

Tracker.autorun(function() {
  var currentContextBlocks, currentY, horizontalContextDiv, story, _ref;
  var verticalSection = Session.get('currentVerticalSection');
  if (verticalSection) {
    currentContextBlocks = verticalSection.contextBlocks;
    horizontalContextDiv = $(".horizontal-context");
    horizontalContextDiv.removeClass('editing');
    if (Session.get("addingContextToCurrentY") || (_ref = Session.get("editingContext"), __indexOf.call(currentContextBlocks, _ref) >= 0)) {
      return horizontalContextDiv.addClass('editing');
    } else {
      return horizontalContextDiv.removeClass('editing');
    }
  }
});

Tracker.autorun(function(){
  var currentSection = $('.vertical-narrative-section.selected')

  var scrollToRelativePosition = function(offset) {
    if(currentSection.length) {
      $('body,html').animate({
        scrollTop: currentSection.position().top + offset
      }, 200, 'easeInCubic');
    }
  };

  if (Session.get("addingContext")){
    if(currentSection.length){
      scrollToRelativePosition(350 + 29)
    }
  }
  else {
    if (currentSection.length) {
      scrollToRelativePosition(350 + 29 - 140)
    }
  }
});

Tracker.autorun(function() {
  var currentYId;
  currentYId = Session.get('currentYId');
  return Session.set("addingContextToCurrentY", (currentYId != null) && Session.get("addingContext") === Session.get('currentYId') && !Session.get('read'));
});

// Hide add card menu when scroll
// TO-DO probably remove all the currentY stuff, since we're not tracking that in any real way
Tracker.autorun(function() {
  Session.get('currentY'); // so reacts to changes in currentY
  Session.set("addingContext", null);
});

showNewHorizontalUI = function() {
  Session.set("addingContext", Session.get('currentYId'));
  return Session.set("editingContext", null);
};

hideNewHorizontalUI = function() {
  return Session.set("addingContext", null);
};

toggleHorizontalUI = function() {
  if (Session.get("addingContextToCurrentY")) {
    return Session.set("addingContext", null);
  } else {
    Session.set("addingContext", Session.get('currentYId'));
    return Session.set("editingContext", null);
  }
};

Template.add_horizontal.events({
  "click": function(d) {
    return toggleHorizontalUI();
  }
});

Template.create_horizontal_section_block.created = function() {
  return this.type = new ReactiveVar('video');
};

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
  map: function() {
    return Template.instance().type.get() === "map";
  },
  video: function() {
    return Template.instance().type.get() === "video";
  },
  oec: function() {
    return Template.instance().type.get() === "oec";
  }
});

Template.create_horizontal_section_block.helpers({
  left: function() {
    var cardWidth, halfWidth, width;
    width = Session.get("width");
    if (width < 1024) {
      width = 1024;
    }
    halfWidth = width / 2;
    cardWidth = Session.get("cardWidth");
    return 75 + halfWidth + (Session.get("separation")) * 1.5;
  }
});

Template.create_horizontal_section_block.events({
  'click svg.text-icon': function(d, t) {
    return t.type.set('text');
  },
  'click svg.map-icon': function(d, t) {
    return t.type.set('map');
  },
  'click svg.video-icon': function(d, t) {
    return t.type.set('video');
  },
  'click svg.image-icon': function(d, t) {
    return t.type.set('image');
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

Template.context_anchor_new_card_option.events = {
  "mousedown": function(e) {
    e.preventDefault();
    hideFoldEditor();
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
    temporaryHrefToken = 'http://example.com/OhSuChToken';
    document.execCommand('createLink', false, temporaryHrefToken);
    temporaryAnchorElement = $('a[href="' + temporaryHrefToken +'"]'); // find temporary anchor
    temporaryAnchorElement.attr('href', 'javascript:void(0);'); // get rid of temporary href
    temporaryAnchorElement.attr('data-context-id', contextId); // set data attributes correctly

    //temporaryAnchorElement.data({contextId: contextId});
    goToContext(contextId);
    return false;
  }
};

addContextToStory = function(storyId, contextId, verticalSectionIndex) {
  var pushObject, pushSelectorString;
  pushSelectorString = 'draftStory.verticalSections.' + verticalSectionIndex + '.contextBlocks';
  pushObject = {};
  pushObject[pushSelectorString] = contextId;
  return Meteor.call('saveStory', {
    _id: storyId
  }, {
    $addToSet: pushObject
  }, function(err, numDocs) {
    if (err) {
      return alert(err);
    }
    if (numDocs) {
      Session.set("addingContext", null);
      Session.set("editingContext", null);
      return goToContext(contextId);
    } else {
      return alert('No docs updated');
    }
  });
};

autoFormContextAddedHooks = {
  onSuccess: function(operation, contextId, template) {
    return addContextToStory(Session.get("storyId"), contextId, Session.get("currentY"));
  },
  onError: function(operation, err, template) {
    return alert(err);
  }
};

AutoForm.hooks({
  createMapSectionForm: _.extend({}, autoFormContextAddedHooks, {
    before: {
      insert: function(doc) {
        doc = new MapBlock(doc);
        return _.extend(doc, {
          authorId: Meteor.user()._id
        });
      }
    }
  }),
  createTextSectionForm: _.extend({}, autoFormContextAddedHooks, {
    before: {
      insert: function(doc) {
        doc = new TextBlock(doc);
        return _.extend(doc, {
          authorId: Meteor.user()._id
        });
      }
    }
  })
});

createBlockHelpers = {
  startingBlock: function() {
    if (this instanceof ContextBlock) {
      return this;
    }
  },
  isFocused: function () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      if (this._id === focusResult._id) {
        return true;
      }
    }
  },
  isActive: function () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      return true;
    }
    return false;
  },
  selected: function() {
    return (this.source === Template.instance().source.get());
  }
};

createBlockEvents = {
  "click .cancel": function() {
    Session.set('addingContext', false);
    return Session.set('editingContext', null);
  }
};


var videoSearchDep = new Tracker.Dependency();


Template.create_video_section.created = function() {
  this.focusResult = new ReactiveVar();
  this.searchDep = videoSearchDep;
  this.searchResultsCollection = VideoSearchResults;

  this.searchYoutube = function(query) {
    searchParams = {
      q: query
    }

    pageToken = Session.get("nextPageToken");
    if (pageToken) {
      searchParams['pageToken'] = pageToken;
    }

    Meteor.call('youtubeVideoSearchList', searchParams, function(err, results) {
      nextPageToken = results['nextPageToken'];
      items = results['items'];

      Session.set("nextPageToken", nextPageToken)
      if (err) {
        console.log(err);
        return;
      }
      if (!items) {
        return;
      }
      _.chain(items)
      .map(function(element) {
        return {
          type : 'video',
          source : 'youtube',
          authorId : Meteor.user()._id,
          pageToken : Session.get("nextPageToken"),
          searchQuery : query,
          title: element.title,
          description: element.description,
          referenceId: element.videoId,
          videoUsername : element.channelTitle,
          videoUsernameId : element.channelId,
          videoCreationDate : element.publishedAt.substring(0,10).replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1")
        }
      })
      .each(function(item) {
        VideoSearchResults.insert(item);
      });
    });
    videoSearchDep.changed(); 
    return;
  }
  return
};


Template.create_video_section.helpers(createBlockHelpers);

Template.create_video_section.helpers({
  results: function () {
    videoSearchDep.depend();
    return VideoSearchResults.find({searchQuery: $('input').val()});
  }
});

Template.create_video_section.events(createBlockEvents);



var imageSearchDep = new Tracker.Dependency();

Template.create_image_section.created = function() {
  this.source = new ReactiveVar();
  this.source.set('imgur');
  this.focusResult = new ReactiveVar();
  this.page = 0;

  this.search = function(query) {
    searchParams = {
      q: query
    }

    Meteor.call('imageSearchList', searchParams, function(err, results) {
      items = results.items;

      if (err) {
        console.log(err);
        return;
      }
      if (!items) {
        return;
      }
      _.chain(items)
      .filter(function(e) {
        return (e.type && e.type.indexOf('image') === 0)
      })
      .map(function(e) {
        return {
          type : 'image',
          source : 'imgur',
          authorId : Meteor.user()._id,
          searchQuery : query,
          referenceId : e.id,
          fileExtension: e.link.substring(e.link.lastIndexOf('.') + 1),
          section : e.section,
          title : e.title
        }
      })
      .each(function(item) {
        ImageSearchResults.insert(item);
      });
    });
    imageSearchDep.changed(); 
    return;
  }
  return
};


Template.create_image_section.helpers(createBlockHelpers);


Template.create_image_section.helpers({
    dataSources: [
      {source: 'imgur', display: 'Imgur'},
      {source: 'flickr', display: 'Flickr'},
      {source: 'getty', display: 'Getty Images'}
    ],
    results: function () {
      imageSearchDep.depend();
      return ImageSearchResults.find({searchQuery: $('input').val()});
    }
  }
);

Template.create_image_section.events(createBlockEvents);

Template.create_image_section.events({
  "scroll ol.search-results-container": function(d) {
    var searchContainer = $("ol.search-results-container")

    searchContainer.scroll(function() {
      var searchResultsHeight = _.reduce($('ol.search-results-container li'), 
        function(memo, e) { 
          return memo + $(e).outerHeight() }, 0 
          );

      if ((searchContainer.scrollTop() + searchContainer.height()) === searchResultsHeight) {
        template.search($('input').val());
      }
    })
  },

  "click .data-source": function(d, template) {
    template.source.set(this.source);
  }, 

  "click .search-trigger": function(d) {
    d.preventDefault();
    $(".search-form").toggleClass("search-open");
  },

  "submit form": function(d, template) {
    d.preventDefault();
    template.search($('input').val());
  },

  "click li": function(d, template) {
    template.focusResult.set(this);
  },

  "click .add-button": function(d, template) {
    var contextId = ContextBlocks.insert(template.focusResult.get());
    return addContextToStory(Session.get("storyId"), contextId, Session.get("currentY"));
  }
});

Template.create_video_section.events({
  "scroll ol.search-results-container": function(d, template) {
    var searchContainer = $("ol.search-results-container")

    searchContainer.scroll(function() {
      var searchResultsHeight = _.reduce($('ol.search-results-container li'), 
        function(memo, e) { 
          return memo + $(e).outerHeight() }, 0 
          );

      if ((searchContainer.scrollTop() + searchContainer.height()) === searchResultsHeight) {
        template.searchYoutube($('input').val());
      }
    })
  },

  "click .search-trigger": function(d) {
    d.preventDefault();
    $(".search-form").toggleClass("search-open");
  },

  "submit form": function(d, template) {
    d.preventDefault();
    template.searchYoutube($('input').val());
  },

  "click li": function(d, template) {
    template.focusResult.set(this);
  },

  "click .add-button": function(d, template) {
    var contextId = ContextBlocks.insert(template.focusResult.get());
    return addContextToStory(Session.get("storyId"), contextId, Session.get("currentY"));
  }
});


Template.create_map_section.created = function() {
  return this.blockPreview = new ReactiveVar();
};

Template.create_map_section.helpers({
  url: function() {
    var preview = Template.instance().blockPreview.get();
    if (preview) {
      return preview.url()
    }
  },
  previewUrl: function() {
    var preview = Template.instance().blockPreview.get();
    if (preview) {
      return preview.previewUrl()
    }
  }
});

Template.create_map_section.helpers(createBlockHelpers);

Template.create_map_section.events(createBlockEvents);

Template.create_map_section.events({
  "click .search": function(e, template) {
    var block, previewMapBlock;
    block = AutoForm.getFormValues('createMapSectionForm').insertDoc;
    previewMapBlock = new MapBlock(_.extend(block, {
      source: 'google_maps'
    }));
    return template.blockPreview.set(previewMapBlock);
  },
  "click .cancel": function() {
    Session.set('addingContext', false);
    return Session.set('editingContext', null);
  }
});


Template.create_text_section.helpers({
  startingBlock: function() {
    if (this instanceof ContextBlock) {
      return this;
    }
  }
});

Template.create_text_section.helpers(createBlockHelpers);

Template.create_text_section.events(createBlockEvents);

// Template.create_image_section.events({
//   "click div.save": function(d) {
//     var context, description, horizontalIndex, horizontalSections, newDocument, parentSection, srcE, url;
//     srcE = d.srcElement ? d.srcElement : d.target;
//     parentSection = $(srcE).closest('section');
//     horizontalIndex = parentSection.data('index');
//     url = parentSection.find('input.image-url-input').val();
//     description = parentSection.find('input.image-description-input').val();
//     newDocument = {
//       type: 'image',
//       url: url,
//       description: description,
//       index: horizontalIndex
//     };
//     horizontalSections = Session.get('horizontalSections');
//     horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument;
//     Session.set('horizontalSections', horizontalSections);
//     context = newDocument;
//     return renderTemplate(d, Template.display_image_section, context);
//   }
// });

Template.horizontal_section_block.events({
  "click div.delete": function(d) {
    return console.log("delete");
  },
  "click div.edit": function(e, t) {
    Session.set('editingContext', this._id);
    return Session.set('addingContext', false);
  }
});

Template.create_options.events({
  "click div.publish-story": function() {
    console.log("PUBLISH");
    return this.publish();
  },
  "click .toggle-preview": function() {
    if (Session.get('read')) {
      window.refreshContentDep.changed();
      Session.set('read', false);
    } else {
      Session.set('read', true);
    }
  }
});
