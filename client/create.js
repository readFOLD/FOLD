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

  return Stories.update({
    _id: storyId
  }, setObject, {removeEmptyStrings: false}, function(err, numDocs) {
    if (err) {
      return alert(err);
    }
    if (!numDocs) {
      return alert('No docs updated');
    }
  });
};

Template.vertical_section_block.events({
  'mouseup .fold-editable': window.updateUIBasedOnSelection,
  'blur .title' : function(e, template){
    autoSaveVerticalSectionField(template, 'title');
    return true;
  },
  'blur .content' : function(e, template){
    autoSaveVerticalSectionField(template, 'content', 'html');
    return true;
  }
});



Template.vertical_section_block.rendered = function() {
  console.log('Vertical Section Rendered');
   // only allow plaintext in title
  this.$(".title.editable").on('paste', window.plainTextPaste);

  var cleanHtmlOptions = {
    allowedTags: ['strong', 'em', 'u', 'a'], // only allow tags used in fold-editor
    format: false,
    removeAttrs: ['class', 'id', 'href'], // strip away hrefs and other undesired attributes that might slip into a paste
    allowedAttributes: [["data-context-id"]] // data-context-id is used to direct links to context cards
  };

  var matchAnchors =  /<a( data-context-id=["|'].*?["|'])?.*?>/gm; // match anchors, capture data-context-id so it can be kept in string
  var matchBlankAnchors = /<a href="javascript:void\(0\);">(.*?)<\/a>/gm; // match anchors that are left over from above if copied from somewhere else, capture contents so can be kept

  // clean up pasting into vertical section content
  return this.$(".fold-editable").on('paste', function(e) {
    var clipboardData, html;
    e.preventDefault();
    clipboardData = (e.originalEvent || e).clipboardData;
    if (!clipboardData){return}
    html = clipboardData.getData('text/html') || clipboardData.getData('text/plain');

    var cleanHtml = $.htmlClean(html, cleanHtmlOptions)
      .replace(matchAnchors, '<a href="javascript:void(0);"$1>') // add js void to all anchors and keep all data-context-ids
      .replace(matchBlankAnchors, '$1'); // remove anchors without data-context-ids

    return document.execCommand('insertHTML', false, cleanHtml);
  });
};

Template.story_title.rendered = function(){
  // only allow plaintext in title
  return this.$("[contenteditable]").on('paste', window.plainTextPaste);
};

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

    return Stories.update({
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

Tracker.autorun(function() {
  var currentY, story;
  story = Session.get('story');
  currentY = Session.get("currentY");
  if (story && (currentY != null)) {
    return Session.set('currentYId', story.verticalSections[currentY]._id);
  }
});

Tracker.autorun(function() {
  var currentContextBlocks, currentY, horizontalContextDiv, story, _ref;
  story = Session.get('story');
  currentY = Session.get("currentY");
  if (story && (currentY != null)) {
    currentContextBlocks = story.verticalSections[currentY].contextBlocks;
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
    link = '#' + contextId;
    document.execCommand('createLink', false, link);
    goToContext(contextId);
    return false;
  }
};

addContextToStory = function(storyId, contextId, verticalSectionIndex) {
  var pushObject, pushSelectorString;
  pushSelectorString = 'draftStory.verticalSections.' + verticalSectionIndex + '.contextBlocks';
  pushObject = {};
  pushObject[pushSelectorString] = contextId;
  return Stories.update({
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
  }
};

createBlockEvents = {
  "click .cancel": function() {
    Session.set('addingContext', false);
    return Session.set('editingContext', null);
  }
};

Template.create_video_section.helpers(createBlockHelpers);

Template.create_video_section.events(createBlockEvents);

Template.create_video_section.events({
  "submit": function(d) {
    var horizontalIndex, parentSection, srcE, url, videoId, _ref;
    d.preventDefault();
    srcE = d.srcElement ? d.srcElement : d.target;
    parentSection = $(srcE).closest('section');
    horizontalIndex = parentSection.data('index');
    url = $('input.youtube-link-input').val();
    videoId = (_ref = url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)) != null ? _ref[1] : void 0;
    return Meteor.call('youtubeVideoInfo', videoId, function(err, info) {
      var contextId, newContextBlock;
      if (err) {
        console.log(err);
        return;
      }
      if (!info) {
        console.log('video not found');
        return;
      }
      newContextBlock = {
        type: 'video',
        service: 'youtube',
        videoId: videoId,
        description: info.title,
        authorId: Meteor.user()._id
      };
      contextId = ContextBlocks.insert(newContextBlock);
      return addContextToStory(Session.get("storyId"), contextId, Session.get("currentY"));
    });
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
      service: 'google_maps'
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

Template.create_image_section.events({
  "click div.save": function(d) {
    var context, description, horizontalIndex, horizontalSections, newDocument, parentSection, srcE, url;
    srcE = d.srcElement ? d.srcElement : d.target;
    parentSection = $(srcE).closest('section');
    horizontalIndex = parentSection.data('index');
    url = parentSection.find('input.image-url-input').val();
    description = parentSection.find('input.image-description-input').val();
    newDocument = {
      type: 'image',
      url: url,
      description: description,
      index: horizontalIndex
    };
    horizontalSections = Session.get('horizontalSections');
    horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument;
    Session.set('horizontalSections', horizontalSections);
    context = newDocument;
    return renderTemplate(d, Template.display_image_section, context);
  }
});

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
  "click div.save-story": function() {
    var backgroundImage, contextBlocks, oldStory, storyTitle, verticalSections;
    console.log("SAVE");
    storyTitle = $.trim($('div.title-author div.title').text());
    backgroundImage = Session.get("backgroundImage");
    oldStory = Session.get("story");
    contextBlocks = _.pluck(oldStory.verticalSections, 'contextBlocks');
    verticalSections = [];
    $('.vertical-narrative-section').each(function(verticalIndex) {
      var content, title, verticalId;
      verticalId = $(this).data('verticalId');
      title = $.trim($(this).find('div.title').text());
      content = $.trim($(this).find('div.content').html());
      return verticalSections.push({
        title: title,
        content: content,
        contextBlocks: contextBlocks[verticalIndex],
        _id: verticalId
      });
    });
    this.title = storyTitle;
    this.backgroundImage = backgroundImage;
    this.verticalSections = verticalSections;
    if (this._id) {
      return this.save();
    } else {
      return Meteor.call('saveNewStory', this, function(err, story) {
        return Router.go('edit', {
          userPathSegment: story.userPathSegment,
          storyPathSegment: story.storyPathSegment
        });
      });
    }
  },
  "click div.delete-story": function() {
    var storyId;
    storyId = Session.get('storyId');
    if (storyId) {
      Stories.remove({
        _id: storyId
      });
    }
    return Router.go('home');
  },
  "click div.publish-story": function() {
    console.log("PUBLISH");
    return this.publish();
  }
});
