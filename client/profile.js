var formatDate, weekDays;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};

Template.user_stories.helpers({
  userStories: function() {
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
  displayName: function() {
    if (Meteor.user()) {
      if (Meteor.user().emails) {
        return Meteor.user().emails[0].address;
      } else {
        return Meteor.user().profile.name;
      }
    }
  },
  previewContent: function() {
    return verticalSections[0].content
  },
  profileImageExists: function() {
    return Meteor.user().profile.profile_picture;
  },
  profileImage: function() {
    return Meteor.user().profile.profile_picture;
  }
});

Template.user_stories.events({
  "click div#delete": function(d) {
    var srcE, storyId;
    srcE = d.srcElement ? d.srcElement : d.target;
    storyId = $(srcE).closest('div.story').data('story-id');
    return Stories.remove({
      _id: storyId
    });
  }
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
