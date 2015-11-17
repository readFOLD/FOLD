var formatDate, weekDays;

var numStoriesToDisplay = 12;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};


Template.my_stories.events({
  'click .unpublish' (){
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
  'click .delete' (){
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
  publishedStories () {
    if (Meteor.user()) {
      return Stories.find({
        authorId: Meteor.user()._id,
        published : true
      });
    }
  },
  unpublishedStories () {
    if (Meteor.user()) {
      return Stories.find({
        authorId: Meteor.user()._id,
        published : false
      });
    }
  },
  lastEditDate () {
    return formatDate(this.savedAt);
  },
  lastPublishDate () {
    return formatDate(this.publishedAt);
  }
});

Template.my_stories.events({
  "click div#delete" (d) {
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
    changed  (id, changes) {
      if (changes.public_id){ 
        var doc = _cloudinary.findOne(id);
        that.uploadPreview.set('//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/w_150,h_150,c_fill,g_face/' + doc.public_id);
        that.pictureId.set(doc.public_id);
      }
    },
    removed  (id) {
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
  editing  () {
    return Template.instance().editing.get()
  },
  ownProfile () {
    var user = Meteor.user();
    return (user && (user.username == this.user.username)) ? true : false
  },
  name  () {
    return this.user.profile.name
  },
  bio  () {
    return this.user.profile.bio
  },
  editPicturePrompt  () {
    return Template.instance().editPicturePrompt.get()
  },
  editingPicture  () {
    return Template.instance().editingPicture.get() || Template.instance().editPicturePrompt.get()
  },
  uploadPreview (){
    return Template.instance().uploadPreview.get();
  }
});

Template.user_profile.events({
  "click .edit-profile"  (d, template) {
    template.editing.set(true);
  },
  "click .save-profile-button"  (d, template) {
    template.editing.set(false);
    if (template.pictureId.get()) {
      Meteor.call('saveProfilePicture', this.user._id, template.pictureId.get());
    }
  },
  "mouseenter .picture"  (d, template) {
    if (template.editing.get()) {
      return template.editPicturePrompt.set(true);
    }
  },
  "mouseleave .picture"  (d, template) {
    if (template.editing.get()) {
      return template.editPicturePrompt.set(false);
    }
  },
  "click input[type=file]" (d, template) {
    return template.editingPicture.set(true);
  },
  "change input[type=file]" (e, template){
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
  "click .toggle-published" (d, template) {
    return template.seeAllPublished.set(!template.seeAllPublished.get())
  }
});

Template.user_stories.helpers({
  seeAllPublished  () {
    return Template.instance().seeAllPublished.get()
  },
  publishedStories () {
    var limit = Template.instance().seeAllPublished.get() ? 0 : numStoriesToDisplay; //when limit=0 -> no limit on stories
    return Stories.find({authorId : this.user._id, published : true}, {
      sort: {
        publishedAt: -1
      }, 
      limit: limit
    })
  },
  showAllPublishedButton () {
    return Stories.find({authorId : this.user._id, published : true}).count() > numStoriesToDisplay
  },
  hasPublished () {
    return Stories.findOne({authorId : this.user._id, published : true})
  },
  unpublishedMessage  () {
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
  "click .toggle-favorites" (d, template) {
    return template.seeAllFavorites.set(!template.seeAllFavorites.get())
  }
});

Template.user_favorite_stories.helpers({
  seeAllFavorites () {
    return Template.instance().seeAllFavorites.get()
  },
  favoriteStories () {
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
  showAllFavoritesButton () {
    var favorites = this.user.profile.favorites;
    if (favorites && favorites.length) {
      return favorites.length > numStoriesToDisplay
    }
  },
  hasFavorites () {
    return !_.isEmpty(this.user.profile.favorites);
  },
  noFavoritesMessage  () {
    var user = Meteor.user();
    if (user && (user.username == this.user.username)) {
      return "You haven't favorited any stories yet!"
    } else {
      return "This user hasn't favorited any stories yet"
    }
  }
});
