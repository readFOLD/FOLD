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
  },
  profileImage: function() {
    return Meteor.user().profile.profile_picture;
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
  this.editting = new ReactiveVar(false);
});

Template.user_profile.helpers({
  editting : function() {
    return Template.instance().editting.get()
  },
  ownProfile: function() {
    return Meteor.user().username == this.user.username ? true : false
  },
  name : function() {
    return this.user.profile.name
  },
  bio : function() {
    return this.user.profile.bio
  },
  profileImage: function() {
    return Meteor.user().profile.profile_picture;
   },
});

Template.user_profile.events({
  "click .edit_profile" : function(d, template) {
    template.editting.set(true);
  },
  "click .save-profile-button" : function(d, template) {
    template.editting.set(false);
  }
});

Template.user_stories.helpers({
  writtenStories: function() {
    return Template.currentData().stories
  }
})

Template.user_favorite_stories.onCreated(function(){
  this.subscribe('readStoriesPub', Meteor.user().profile.favorites);
});

Template.user_favorite_stories.helpers({
  favoriteStories: function() {
    if (Meteor.user()) {
      return Stories.find({
        _id: {
          $in: Meteor.user().profile.favorites
        }
      });
    }
  }
});
