
ActivityItems = new Mongo.Collection(null);

Template.activity_feed.onCreated(function(){
  ActivityItems.remove({});
  Meteor.call('getActivityFeed', function(err, feedItems){
    if(err){
      throw err
    }
    _.each(feedItems, function(feedItem){
      ActivityItems.insert(feedItem);
    })
  })
});

Template.activity_feed.helpers({
  populatedFeedItems: function(){
    return ActivityItems.find({}, {sort: {published: -1}});
  }
});

Template._activity_feed_content.helpers({
  actorImage: function(){
    if(this.actor.type === 'Person'){
      return getProfileImage(this.actor.imageId, this.actor.twitterId, 'small');
    }
  },
  objectImage: function(){
    if(this.object.type === 'Person'){
      return getProfileImage(this.object.imageId, this.object.twitterId, 'small');
    } else if (this.object.type === 'Story'){
      return Story.getHeaderImageUrl(this.object.imageId, 'small');
    }
  }
});

