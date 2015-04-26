var formatDate, weekDays;

var numStoriesToDisplay = 12;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};


Template.my_stories.helpers({
  writtenStories: function() {
    if (Meteor.user()) {
      return Stories.find({
        authorId: Meteor.user()._id
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
    that.subscribe('minimalUsersPub', Stories.find({ published: true}, {fields: {authorId:1}, reactive: false}).map(function(story){return story.authorId}));
  });
  
  this.editing = new ReactiveVar(false);
  this.editPicturePrompt = new ReactiveVar(false);
  this.editingPicture = new ReactiveVar(false);
  this.uploadPreview = new ReactiveVar();
  this.pictureId = new ReactiveVar();
  
  var query = _cloudinary.find({});
  this.observeCloudinary = query.observeChanges({ 
    changed: function (id, changes) { 
      if (changes.public_id){ 
        var doc = _cloudinary.findOne(id);
        that.uploadPreview.set('//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/w_150,h_150,c_fill,g_face/' + doc.public_id);
        that.pictureId.set(doc.public_id);
      }
    },
    removed: function (id) {
      var input = that.$('input[type=file]');
      input.val(null);
      input.change(); 
    }
  });
});

Template.user_profile.onDestroyed(function(){
  this.observeCloudinary.stop();
});

Template.user_profile.helpers({
  editing : function() {
    return Template.instance().editing.get()
  },
  ownProfile: function() {
    var user = Meteor.user();
    return (user && (user.username == this.user.username)) ? true : false
  },
  name : function() {
    return this.user.profile.name
  },
  bio : function() {
    return this.user.profile.bio
  },
  editPicturePrompt : function() {
    return Template.instance().editPicturePrompt.get()
  },
  editingPicture : function() {
    return Template.instance().editingPicture.get() || Template.instance().editPicturePrompt.get()
  },
  uploadPreview: function(){
    return Template.instance().uploadPreview.get();
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
  "mouseenter .picture" : function(d, template) {
    if (template.editing.get()) {
      return template.editPicturePrompt.set(true);
    }
  },
  "mouseleave .picture" : function(d, template) {
    if (template.editing.get()) {
      return template.editPicturePrompt.set(false);
    }
  },
  "click input[type=file]": function(d, template) {
    return template.editingPicture.set(true);
  },
  "change input[type=file]": function(e, template){
    var file = _.first(e.target.files);
    if (!file){
      template.uploadPreview.set(null);
    } 
    return template.editingPicture.set(false);
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
    return Stories.find({authorUsername : this.user.username, published : true}, {
      sort: {
        publishedAt: -1
      }, 
      limit: limit
    })
  },
  showAllPublishedButton: function() {
    return Stories.find({authorUsername : this.user.username, published : true}).count() > numStoriesToDisplay
  },
  hasPublished: function() {
    return Stories.findOne({authorUsername : this.user.username, published : true})
  },
  unpublishedMessage: function () {
    var user = Meteor.user();
    if (user && (user.username == this.user.username)) {
      return "You haven't published any stories yet!"
    } else {
      return "This user hasn't written any stories yet"
    }
  }
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
  noFavoritesMessage: function () {
    var user = Meteor.user();
    if (user && (user.username == this.user.username)) {
      return "You haven't favorited any stories yet!"
    } else {
      return "This user hasn't favorited any stories yet"
    }
  }
});
