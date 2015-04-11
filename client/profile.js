var formatDate, weekDays;

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
  this.editing = new ReactiveVar(false);
});

Template.user_profile.helpers({
  editing : function() {
    return Template.instance().editing.get()
  },
  ownProfile: function() {
    return Meteor.user().username == this.user.username ? true : false
  },
  name : function() {
    return this.user.profile.name
  },
  bio : function() {
    return this.user.profile.bio
  }
});

Template.user_profile.events({
  "click .edit-profile" : function(d, template) {
    template.editing.set(true);
  },
  "click .save-profile-button" : function(d, template) {
    template.editing.set(false);
  }
});

Template.user_stories.helpers({
  publishedStories: function() {
    return _.filter(this.stories.fetch(), function(story) {
      return story.published ==true
    })
  },
  unpublishedMessage: function () {
    if (Meteor.user().username == this.user.username) {
      return "You haven't published any stories yet!"
    } else {
      return "This user hasn't written any stories yet"
    }
  }
});

Template.user_favorite_stories.helpers({
  favoriteStories: function() {
      return this.favorites
    },
  noFavoritesMessage: function () {
    if (Meteor.user().username == this.user.username) {
      return "You haven't favorited any stories yet!"
    } else {
      return "This user hasn't favorited any stories yet"
    }
  }
});
