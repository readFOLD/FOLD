window.enclosingAnchorTag = null;
window.selectedNode = null;

var saveUpdatedSelection = function () {
  $(window.selectedNode).closest('.content').blur();
};

window.plainTextPaste = function(e) {
  var clipboardData = (e.originalEvent || e).clipboardData;
  e.preventDefault();
  return document.execCommand('insertText', false, clipboardData.getData('text/plain'));
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

window.refreshContentDep = new Tracker.Dependency();


var scrollToRelativePosition = function(offset) {
  var selectedNarrative = $('.vertical-narrative-section.selected');
  if (selectedNarrative){
    $('body,html').animate({
      scrollTop: $('.vertical-narrative-section.selected').position().top + offset
    }, 200, 'easeInCubic');
  }
};



Template.stream_search.events({
  'mouseenter .horizontal-narrative-section': function() {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave .horizontal-narrative-section': function(){
    document.body.style.overflow='auto';
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
Template.content_icons.helpers(
  _.object(_.map(contextTypes, function(type){
      return 'show_' + type + '_icon'
    })
    , _.map(contextTypes, function(type) {
      return function() {
        return this.showAll || Session.get("curateMode") || this.hasContextOfType(type);      };
    }))
);

Template.content_icons.helpers({
  show_stream_icon: function () {
    return Session.get("curateMode");
  },
  show_chat_icon: function () {
    return true;
  },
  disableAllButStream: function (){
    return _.contains(['find_stream'], this.creationStep);
  }
});


Template.content_icons.events(_.object(_.map(contextTypesPlusChat, function(type){
    return 'click .' + type + '-button'
  })
  , _.map(contextTypesPlusChat, function(type) {
    return function() {
      return Session.set('mediaDataType', type);
    };
  }))
);

Template.content_icons.events({
  'click button': function() {
    setCurrentContext(null); // clear current context whenever click on a context button
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

Template.unimplemented_chat_section.onCreated(function(){
  notifyFeature('Chat: coming soon!');
});
