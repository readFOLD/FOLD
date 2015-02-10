var formatDate, weekDays;

weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

formatDate = function(date) {
  var hms;
  hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms;
};

Template.user_stories.helpers({
  userStories: function() {
    var _ref;
    return Stories.find({
      authorId: (_ref = Meteor.user()) != null ? _ref._id : void 0
    });
  },
  lastEditDate: function() {
    return formatDate(this.lastSaved);
  },
  lastPublishDate: function() {
    return formatDate(this.publishDate);
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
    var _ref;
    return (_ref = this.verticalSections[0]) != null ? _ref.content : void 0;
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
    var _ref, _ref1;
    return Stories.find({
      _id: {
        $in: (_ref = Meteor.user()) != null ? (_ref1 = _ref.profile) != null ? _ref1.favorites : void 0 : void 0
      }
    });
  }
});