window.enclosingAnchorTag = null;
window.selectedNode = null;

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
    clearCurrentContext(); // clear current context whenever click on a context button
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

window.addStream = function(stream, template) {
  Session.set('query', null); // clear query so it doesn't seem like you're editing this card next time open the new card menu
  Session.set('saveState', 'saving');
  template.focusResult.set(null);

  Meteor.call('addStreamToStream', Session.get("streamShortId"), stream, function(err, streamId){
    saveCallback(err, streamId);
  });
};

window.addContext = function(contextBlock) {
  Session.set('saveState', 'saving');

  contextBlock._id = Random.id(9);
  contextBlock.rank = 0; // places above existing ranked context

  Meteor.setTimeout(function(){ // scroll to top and focus annotation box
    $('.context-area').scrollTop(0);
    $('.context-section[data-context-id=' + contextBlock._id + '] textarea').focus();
  });



  Meteor.call('addContextToStream', Session.get("streamShortId"), contextBlock, function(err, contextId){
    saveCallback(err, contextId);
  });
};



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


Template.unimplemented_chat_section.onCreated(function(){
  notifyFeature('Chat: coming soon!');
});
