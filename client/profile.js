var formatDate, weekDays;

var numStoriesToDisplay = 12;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};

Template.profile.onCreated(function(){
  this.sectionToShow = new ReactiveVar('latest');
});

Template.profile.events({
  "click .show-latest": function (e, t) {
    t.sectionToShow.set('latest');
  },
  "click .show-favorites": function (e, t) {
    t.sectionToShow.set('favorites');
  },
  "click .show-following": function (e, t) {
    t.sectionToShow.set('following');
  },
  "click .show-followers": function (e, t) {
    t.sectionToShow.set('followers');
  }
});

Template.profile.helpers({
  "showLatest": function(){
    return Template.instance().sectionToShow.get() === 'latest';
  },
  "showFavorites": function(){
    return Template.instance().sectionToShow.get() === 'favorites';
  },
  "showFollowing": function(){
    return Template.instance().sectionToShow.get() === 'following';
  },
  "showFollowers": function(){
    return Template.instance().sectionToShow.get() === 'followers';
  }
});


Template.my_stories.events({
  'click .unpublish': function(){
    var that = this;
    if (confirm('Are you sure you want to unpublish this story?')){
      $('.story[data-story-id=' + that._id + ']').fadeOut(500, function(){
        Meteor.call('unpublishStory', that._id, function(err, result) {
          if(err || !result){
            notifyError('Unpublish failed.');
          }
        });
      })

    }
  },
  'click .delete': function(){
    var that = this;
    if (confirm('Are you sure you want to delete this story? This cannot be undone.')){
      $('.story[data-story-id=' + that._id + ']').fadeOut(500, function(){
        Meteor.call('deleteStory', that._id, function(err, result) {
          if(err || !result){
            notifyError('Delete failed.');
          }
        });
      })

    }
  }
});
Template.my_stories.helpers({
  publishedStories: function() {
    if (Meteor.user()) {
      return Stories.find({
        authorId: Meteor.userId(),
        published : true
      });
    }
  },
  unpublishedStories: function() {
    if (Meteor.user()) {
      return Stories.find({
        authorId: Meteor.userId(),
        published : false
      });
    }
  },
  lastEditDate: function() {
    return formatDate(this.savedAt);
  },
  lastPublishDate: function() {
    return formatDate(this.publishedAt);
  }
});

Template.my_stories.events({
  "click div#delete": function(d) {
    var srcE, storyId;
    srcE = d.srcElement ? d.srcElement : d.target;
    storyId = $(srcE).closest('div.story').data('story-id');
    return Stories.remove({
      _id: storyId
    });
  }
});

Template.user_profile.onCreated(function(){
  var that = this;

  this.autorun(function(){
    var usersFromStories = Stories.find({ published: true}, {fields: {authorId:1}, reactive: false}).map(function(story){return story.authorId});
    var user = Meteor.user();
    var usersToSubscribeTo = _.compact(_.union(usersFromStories, user.profile.following, user.followers));
    that.subscribe('minimalUsersPub', _.sortBy(usersToSubscribeTo, _.identity));
  });
  
  this.editing = new ReactiveVar(false);
  this.uploadPreview = new ReactiveVar();
  this.uploadingPicture = new ReactiveVar();
  this.pictureId = new ReactiveVar();
});


var ownProfile = function() {
  var user = Meteor.user();
  return (user && (user.username == this.user.username)) ? true : false
};

Template.user_profile.helpers({
  editing : function() {
    return Template.instance().editing.get()
  },
  ownProfile: ownProfile,
  name : function() {
    return this.user.profile.name
  },
  bio : function() {
    return this.user.profile.bio
  },
  uploadPreview: function(){
    return Template.instance().uploadPreview.get();
  },
  uploadingPicture: function(){
    return Template.instance().uploadingPicture.get();
  }
});

Template.user_profile.events({
  "click .edit-profile" : function(d, template) {
    template.editing.set(true);
  },
  "click .save-profile-button" : function(d, template) {
    template.editing.set(false);
    if (template.pictureId.get()) {
      Meteor.call('saveProfilePicture', this.user._id, template.pictureId.get());
    }
  },
  "change input[type=file]": function(e, template){
    var file = _.first(e.target.files);
    if (file) {
      if(file.size > CLOUDINARY_FILE_SIZE){
        return notifyImageSizeError();
      }
      template.uploadingPicture.set(true);
      // actual upload
      Cloudinary.upload([file], {}, function(err, doc) {
        template.uploadingPicture.set(false);
        if(err){
          var input = template.$('input[type=file]');
          input.val(null);
          input.change();
          notifyError('Image upload failed');
        } else {
          template.uploadPreview.set('//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/w_150,h_150,c_fill,g_face/' + doc.public_id);
          template.pictureId.set(doc.public_id);
        }
      })
    } else {
      template.uploadPreview.set(null);
    }
  }
});

Template.user_stories.onCreated(function(){
  this.seeAllPublished = new ReactiveVar(false);
});

Template.user_stories.events({
  "click .toggle-published": function(d, template) {
    return template.seeAllPublished.set(!template.seeAllPublished.get())
  }
});

Template.user_stories.helpers({
  seeAllPublished : function() {
    return Template.instance().seeAllPublished.get()
  },
  publishedStories: function() {
    var limit = Template.instance().seeAllPublished.get() ? 0 : numStoriesToDisplay; //when limit=0 -> no limit on stories
    return Stories.find({authorId : this.user._id, published : true}, {
      sort: {
        publishedAt: -1
      }, 
      limit: limit
    })
  },
  showAllPublishedButton: function() {
    return Stories.find({authorId : this.user._id, published : true}).count() > numStoriesToDisplay
  },
  hasPublished: function() {
    return Stories.findOne({authorId : this.user._id, published : true})
  },
  hasDrafts: function(){
    return Stories.findOne({authorId : this.user._id}, {published: false})
  },
  ownProfile: ownProfile
});

Template.user_favorite_stories.onCreated(function(){
  this.seeAllFavorites = new ReactiveVar(false);
});

Template.user_favorite_stories.events({
  "click .toggle-favorites": function(d, template) {
    return template.seeAllFavorites.set(!template.seeAllFavorites.get())
  }
});

Template.user_favorite_stories.helpers({
  seeAllFavorites: function() {
    return Template.instance().seeAllFavorites.get()
  },
  favoriteStories: function() {
    var limit = Template.instance().seeAllFavorites.get() ? 0 : numStoriesToDisplay; 
    var favorites = this.user.profile.favorites;
    if (favorites && favorites.length) {
      return Stories.find({
        _id: {
          $in: this.user.profile.favorites
        }}, {
          sort: {
            publishedAt: -1
            }, 
          limit: limit
      })
    } else {
      return [];
    }
  },
  showAllFavoritesButton: function() {
    var favorites = this.user.profile.favorites;
    if (favorites && favorites.length) {
      return favorites.length > numStoriesToDisplay
    }
  },
  hasFavorites: function() {
    return !_.isEmpty(this.user.profile.favorites);
  },
  ownProfile: ownProfile
});

Template.user_following.helpers({
  usersFollowing: function() {
    var following = this.user.profile.following;
    if (following && following.length) {
      return Meteor.users.find({
        _id: {
          $in: following
        }}, {
          sort: {
            followersTotal: -1
            }
      })
    } else {
      return [];
    }
  },
  ownProfile: ownProfile
});

Template.user_followers.helpers({
  followers: function() {
    var followers = this.user.followers;
    if (followers && followers.length) {
      return Meteor.users.find({
        _id: {
          $in: followers
        }}, {
          sort: {
            followersTotal: -1
            }
      })
    } else {
      return [];
    }
  },
  ownProfile: ownProfile
});
