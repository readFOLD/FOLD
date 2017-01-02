SimpleSchema.debug = true; // TODO Remove after launch

if(!this.Schema){
  Schema = {};
};


this.StoryStats = new Mongo.Collection("story_stats");


this.StoryStats.deny({
  insert () {
    return true;
  },
  update () {
    return true
  },
  remove () {
    return true
  }
});

var deepAnalyticsSchema = new SimpleSchema({
  uniqueViewersByConnection: {
    type: [String],
    defaultValue: []
  },
  uniqueViewersByIP: {
    type: [String],
    defaultValue: []
  },
  uniqueViewersByUserId: {
    type: [String],
    defaultValue: []
  },
  all: {
    type: [Object],
    blackbox: true
  }
});

Schema.StoryStats = new SimpleSchema({
  storyId: {
    type: String
  },
  deepAnalytics: {
    type: Object,
    optional: true
  },
  'deepAnalytics.views': {
    type: deepAnalyticsSchema
  },
  'deepAnalytics.shares': {
    type: deepAnalyticsSchema
  },
  'deepAnalytics.reads': {
    type: deepAnalyticsSchema
  },
  analytics: {
    type: analyticsSchema,
    optional: true
  },
  'analytics.views': {
    type: analyticsSchema
  },
  'analytics.shares': {
    type: analyticsSchema
  },
  'analytics.reads': {
    type: analyticsSchema
  },
  'analytics.heartbeats': {
    type: Object,
    optional: true
  },
  'analytics.heartbeats.active': {
    type: Object,
    optional: true,
    blackbox: true
  },
  'analytics.contextInteractions': {
    type: Object,
    optional: true,
    blackbox: true
  },
  'analytics.anchorClicks': {
    type: Object,
    optional: true,
    blackbox: true
  },
});

this.StoryStats.attachSchema(Schema.StoryStats);


this.StoryHistories = new Mongo.Collection("story_histories");


this.Activities = new Mongo.Collection("activities");

var basicObjectSchema = {
  type: {
    type: String,
    allowedValues: ['Person', 'Story', 'ContextCard']
  },
  id: {
    type: String
  },
  name: {
    type: String
  },
  urlPath: {
    type: String
  },
  imageId: {
    type: String,
    optional: true
  },
  twitterId: {
    type: String,
    optional: true
  }
};

var objectSchema = new SimpleSchema(_.extend( basicObjectSchema, {
    attributedTo: {
      type: new SimpleSchema(basicObjectSchema),
      optional: true
    }
  })
);

Schema.Activities = new SimpleSchema({
  type: { // follow, favorite etc...
    type: String,
    allowedValues: ['Favorite', 'Follow', 'FollowBack', 'Publish', 'Share', 'ViewThreshold']
  },
  content: { // for ex., message contents
    type: String,
    optional: true
  },
  published: { // when this happened
    type: Date,
    autoValue () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  },
  fanout: { // fanout status
    type: String,
    defaultValue: 'pending',
    allowedValues: ['pending', 'in_progress', 'done']
  },
  actor: {
    type: objectSchema,
    optional: true
  },
  object: {
    type: objectSchema,
    optional: true
  },
  //target: {
  //  type: objectSchema,
  //  optional: true
  //}
});

this.Activities.attachSchema(Schema.Activities);



this.ActivityFeedItems = new Mongo.Collection("activity_feed_items");

Schema.ActivityFeedItems = new SimpleSchema({
  uId: { // userId
    type: String
  },
  aId: { // actionId
    type: String
  },
  r: { // relevancy
    type: Date
  }
});

this.ActivityFeedItems.attachSchema(Schema.ActivityFeedItems);
