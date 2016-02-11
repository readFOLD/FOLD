
ActivityItems = new Mongo.Collection(null);

var activityFeedItemsSub;

var activityFeedSubs = new SubsManager({
  cacheLimit: 1,
  expireIn: 99999
});

var subscribeToActivityFeedItems = function(cb){
  if(!activityFeedItemsSub){
    activityFeedItemsSub = activityFeedSubs.subscribe("activityFeedItemsPub", function(){
      if(cb){
        cb();
      }
    })
  } else {
    if(cb){
      cb();
    }
  }
};

var loadInitialActivities = function(cb) {

  var loadedActivities = ActivityItems.find({}).map(function (a) {
    return a._id
  });

  if (!loadedActivities.length) { // only load if haven't loaded
    Meteor.call('getActivityFeed', function (err, feedItems) {
      if (err) {
        throw err
      }

      loadedActivities = _.pluck(feedItems, '_id');

      _.each(feedItems, function (feedItem) {
        ActivityItems.insert(feedItem);
      });

      cb(null, loadedActivities);
    });
  } else {
    cb(null, loadedActivities)
  }
};

Template.activity_feed.onCreated(function(){
  var that = this;

  this.activityFeedLoading = new ReactiveVar(true);

  loadInitialActivities(function(err, loadedActivities){
    that.activityFeedLoading.set(false);

    subscribeToActivityFeedItems(function(){
      var query = ActivityFeedItems.find({uId: Meteor.userId()}, {sort:{r: -1}, fields: {'aId' : 1}});

      if(that.activityFeedObserver){
        that.activityFeedObserver.stop();
      }
      that.activityFeedObserver = query.observeChanges({
        added: function(id, aFI) {
          if (!_.contains(loadedActivities, aFI.aId)) {
            Meteor.call('getActivityFeed', aFI.aId, function (err, feedItems) {
              if (err) {
                throw err
              }

              loadedActivities.push(aFI.aId);

              _.each(feedItems, function (feedItem) {
                ActivityItems.insert(feedItem);
              })
            });
          }
        }
      })

    })
  })
});

Template.activity_feed.onDestroyed(function(){
  document.body.style.overflow = 'auto';
  if(this.activityFeedObserver){
    this.activityFeedObserver.stop();
  }
});

Template.activity_feed.events({
  'mouseenter': function() {
    document.body.style.overflow = 'hidden';
  },
  'mouseleave': function(){
    document.body.style.overflow='auto';
  }
});

Template.activity_feed.helpers({
  populatedFeedItems: function(){
    return ActivityItems.find({}, {sort: {published: -1}});
  },
  loading: function(){
    return Template.instance().activityFeedLoading.get();
  },
  hasButton: function(){
    return _.contains(['Follow', 'FollowBack'], this.type)
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
  },
  objectIsYou: function(){
    return this.object.id === Meteor.userId();
  }
});

