window.enclosingAnchorTag = null;
window.selectedNode = null;

var saveUpdatedSelection = function () {
  $(window.selectedNode).closest('.content').blur();
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
