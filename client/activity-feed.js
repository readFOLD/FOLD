
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
  image: function(){
    if(this.type === 'Person'){
      return getProfileImage(this.imageId, this.twitterId, 'small');
    } else if (this.type === 'Story'){
      return Story.getHeaderImageUrl(this.imageId, 'small');
    }
  },
  imageClass: function(){
    return this.type.toLowerCase() + '-preview-image';
  }
});

