
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

var loadedActivities;
var loadedActivitiesDep = new Tracker.Dependency();

var loadInitialActivities = function(cb) {
  if (!loadedActivities) { // only load if haven't loaded
    Meteor.call('getActivityFeed', function (err, feedItems) {
      if (err) {
        throw err
      }

      loadedActivities = _.pluck(feedItems, '_id');
      loadedActivitiesDep.changed();

      _.each(feedItems, function (feedItem) {
        ActivityItems.insert(feedItem);
      });

      cb(null, loadedActivities);
    });
  } else {

    loadedActivities = ActivityItems.find({}).map(function (a) {
      return a._id
    });
    loadedActivitiesDep.changed();
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
        added (id, aFI) {
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
  unfreezePageScroll();
  if(this.activityFeedObserver){
    this.activityFeedObserver.stop();
  }
});

Template.activity_feed.events({
  'mouseenter .activity-feed' () {
    freezePageScroll();
  },
  'mouseleave .activity-feed' (){
    unfreezePageScroll();
  }
});

var feedLimit = Meteor.Device.isPhone() ? 5 : 50;

Template.activity_feed.helpers({
  populatedFeedItems (){
    return ActivityItems.find({}, {sort: {published: -1}, limit: feedLimit});
  },
  loading (){
    return Template.instance().activityFeedLoading.get();
  },
  hideContent (){
    loadedActivitiesDep.depend();
    return loadedActivities ? false : true;
  }
});

Template._activity_feed_content.helpers({
  image (){
    if(this.type === 'Person'){
      return getProfileImage(this.imageId, this.twitterId, 'small');
    } else if (this.type === 'Story'){
      return Story.getHeaderImageUrl(this.imageId, 'small');
    }
  },
  imageClass (){
    return this.type.toLowerCase() + '-preview-image';
  },
  objectIsYou (){
    return this.object.id === Meteor.userId();
  },
  includeBaselineActivityFeedContent (){
    return Template.instance().data.activities.count() <= (feedLimit - 3);
  },
  activityPlaceholders (){
    if(Meteor.Device.isPhone()){
      return 0;
    }
    var numPlaceholders;
    var numActivities = Template.instance().data.activities.count();
    if (numActivities <= 3 ) {
      numPlaceholders = 5 - numActivities;
    } else {
      numPlaceholders = 0;
    }
    return _.range(numPlaceholders);
  },
  hasButton (){
    return _.contains(['Follow', 'FollowBack'], this.type);
  },
  noRightImage (){
    return _.contains(['Share'], this.type);
  }
});

