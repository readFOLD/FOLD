var throttledResize;

var windowSizeDep = new Tracker.Dependency();

Meteor.startup(function(){
  Tracker.autorun(function(){
    windowSizeDep.depend();

    var windowWidth = $(window).width();

    // Safari changes window size in a weird way that jquery doesn't register correctly when scroll up vs down
    Session.set("windowHeight", Meteor.Device.isPhone() && !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ? window.innerHeight : $(window).height());

    Session.set("windowWidth", windowWidth);

    if (Meteor.Device.isPhone()) {
      document.body.style.overflowX = "hidden";
      $('body').css('max-width', windowWidth);
    }
  });

  var windowResize = function() {
    windowSizeDep.changed();
  };

  throttledResize = _.throttle(windowResize, 20);

  $(window).resize(throttledResize);
});

//window.trackingInfoFromStory = function(story){
//  return _.chain(story)
//    .pick([
//      '_id',
//      'authorDisplayUsername',
//      'authorId',
//      'authorName',
//      'authorUsername',
//      'createdAt',
//      'editorsPick',
//      'editorsPickAt',
//      'firstPublishedAt',
//      'headerImageFormat',
//      'keywords',
//      'narrativeRightsReserved',
//      'publishedAt',
//      'savedAt',
//      'shortId',
//      'title'])
//    .extend(story.published ? {
//      'numberOfContextBlocks': story.contextBlockIds.length,
//      'numberOfVerticalSections': story.verticalSections.length,
//      'favorites': story.favoritedTotal,
//      'numberofKeywords': story.keywords.length,
//      'titleLength': story.title.length
//    } : {})
//    .extend(story.countContextTypes ? story.countContextTypes() : {})
//    .value();
//};


//Template.story_header.onRendered(function() {
//  var range, sel, titleDiv;
//  // add cursor to title section if empty
//  if (!this.data.title) {
//    if (!Session.get('read')) {
//      titleDiv = $(this)[0].find('.story-title');
//      sel = window.getSelection();
//      if (sel.rangeCount > 0) {
//        sel.removeAllRanges();
//      }
//      range = document.createRange();
//      range.selectNodeContents(titleDiv);
//      range.collapse();
//      return sel.addRange(range);
//    }
//  }
//});



editableDescriptionCreatedBoilerplate = function() {
  this.editing = new ReactiveVar(false);
};


editableDescriptionEventsBoilerplate = function(meteorMethod) {
  return { 
    "blur .text-content.editable": function(d, template) {
      var that = this;
      if (Session.get('curateMode')) {
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, Session.get('streamShortId'),that._id, textContent, saveCallback);
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
      if (Session.get('curateMode') && e.which === 13 ) {
        e.preventDefault();
        var textContent = template.$('textarea[name=content]').val();
        Session.set('saveState', 'saving');
        Meteor.call(meteorMethod, that._id, textContent, saveCallback);
      }
    }
  }
};

var imagePlaceholderHeight = function(){
  return this.heightAtGivenWidth(310);
};

Template.preview_image_section.helpers({
  height: imagePlaceholderHeight,
  width: 310,
  usePlaceholder: imagePlaceholderHeight
});
Template.preview_image_section.helpers(horizontalBlockHelpers);
Template.preview_image_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_image_section.onCreated(editableDescriptionCreatedBoilerplate);
//Template.display_image_section.onCreated(editableDescriptionDestroyedBoilerplate('editHorizontalBlockDescription'));
Template.display_image_section.helpers(horizontalBlockHelpers);
Template.display_image_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_audio_section.helpers(horizontalBlockHelpers);
Template.display_audio_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_video_section.helpers(horizontalBlockHelpers);
Template.display_video_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.preview_video_section.helpers({
  height: function() {
    return this.previewHeightAtGivenWidth(310);
  },
  width: 310
});

Template.preview_video_section.helpers(horizontalBlockHelpers);
Template.preview_video_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_twitter_section.helpers(horizontalBlockHelpers);
Template.display_twitter_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_map_section.helpers(horizontalBlockHelpers);
Template.display_map_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.preview_map_section.helpers({
  width: 310,
  height: 200
});
Template.preview_map_section.helpers(horizontalBlockHelpers);
Template.preview_map_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.preview_news_section.helpers(horizontalBlockHelpers);
Template.display_news_section.helpers(horizontalBlockHelpers);
Template.display_news_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));

Template.display_link_section.helpers(horizontalBlockHelpers);
Template.display_link_section.events(editableDescriptionEventsBoilerplate('editHorizontalBlockDescription'));
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
Template.preview_text_section.helpers(horizontalBlockHelpers);
Template.homepage_preview_text_section.helpers(horizontalBlockHelpers);
Template.display_text_section.events(editableDescriptionEventsBoilerplate('editTextSection'));

//
//Template.share_button.events({
//  'click': function(e, t) {
//    t.tooltipShown.set(!t.tooltipShown.get());
//  },
//  'click .share-facebook': function(e, t) {
//    var width  = 575;
//    var height = 400;
//    var left   = ($(window).width()  - width)  / 2;
//    var top    = ($(window).height() - height) / 2;
//    var url    = "//facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.href);
//    var opts   = 'status=1' +
//      ',width='  + width  +
//      ',height=' + height +
//      ',top='    + top    +
//      ',left='   + left
//    window.open(url, 'facebook', opts);
//    Meteor.call('countStoryShare', this._id, 'facebook');
//    analytics.track('Share on Facebook');
//  },
//  'click .share-twitter': function(e, t) {
//    var title = $(".story-title").text();
//    var width  = 575;
//    var height = 400;
//    var left   = ($(window).width()  - width)  / 2;
//    var top    = ($(window).height() - height) / 2;
//    var url    = '//twitter.com/intent/tweet?text=Read "' + title + '" on @readFOLD&url=' + encodeURIComponent(location.href);
//    var opts   = 'status=1' +
//      ',width='  + width  +
//      ',height=' + height +
//      ',top='    + top    +
//      ',left='   + left
//    window.open(url, 'twitter', opts);
//    Meteor.call('countStoryShare', this._id, 'twitter');
//    analytics.track('Share on Twitter');
//  }
//});


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





Template.create_deepstream.events({
  'click': function(){

    if (Meteor.user()){
      var accessPriority = Meteor.user().accessPriority;
      if (accessPriority && accessPriority <= window.createAccessLevel){

        var shortId = Random.id(8);

        var initialStream = (this instanceof Stream) ? this : null;

        Meteor.call('createDeepstream',shortId, initialStream, function(err, pathObject){
          if (err) {
            notifyError(err);
            throw(err);
          }
          analytics.track('User clicked create and created story');

        })
      } else {
        notifyInfo("Due to high demand, we had to turn off new curation functionality for a moment. Stay tuned for updates!");
      }
    } else {
      Session.set('signingIn', true);
      Session.set('signingInFrom', setSigningInFrom());
      analytics.track('User clicked curate on homepage and needs to sign in');
    }
  }
});

//
//var storyViewed = '';
//Template.read.onCreated(function(){
//
//  // analytics autorun
//  this.autorun(function(){
//    if (!Session.equals("currentY", null)){
//      var y = Session.get("currentY");
//      var storyLength = Session.get("story").verticalSections.length;
//      analytics.track('View vertical narrative section', {
//        label: y,
//        verticalNarrativeIndex: y,
//        storyLength: storyLength,
//        verticalNarrativeFraction: (y + 1) / storyLength,
//        storyId: Session.get("storyId")
//      })
//    }
//  });
//
//  var id = this.data._id;
//  if (storyViewed !== id){
//    storyViewed = id;
//    Meteor.call('countStoryView', id);
//    analytics.track('View story', trackingInfoFromStory(this.data));
//  }
//});
//
//
//Template.read.onRendered(function(){
//  $(window).scrollTop(Session.get('scrollTop'));
//});
