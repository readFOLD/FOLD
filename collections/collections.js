var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };


SimpleSchema.debug = true; // TODO Remove after launch

if(!this.Schema){
  Schema = {};
};

var analyticsSchema = new SimpleSchema({
  byConnection: {
    type: Number,
    defaultValue: 0
  },
  byIP: {
    type: Number,
    defaultValue: 0
  },
  byId: {
    type: Number,
    defaultValue: 0
  },
  total: {
    type: Number,
    defaultValue: 0
  }
});

this.StoryStats = new Mongo.Collection("story_stats");


this.StoryStats.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true
  },
  remove: function() {
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
  analytics: {
    type: analyticsSchema,
    optional: true
  },
  'analytics.views': {
    type: analyticsSchema
  },
  'analytics.shares': {
    type: analyticsSchema
  }
});

this.StoryStats.attachSchema(Schema.StoryStats);


this.StoryHistories = new Mongo.Collection("story_histories");



this.Deepstreams = new Mongo.Collection("deepstreams", {
  transform: function(doc) {
    return new Deepstream(doc);
  }
});

this.Deepstreams.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true
  },
  remove: function () {
    return true;
  }
});


ContextBlocks = new Mongo.Collection("context_blocks", {
  transform: newTypeSpecificContextBlock
});

if(!this.Schema){
  Schema = {};
}

Schema.ContextReferenceProfile = new SimpleSchema({
  id: {
    type: String,
    optional: true
  },

  creationDate: {
    type: String,
    optional: true
  },

  username: {
    type: String,
    optional: true
  },

  userId: {
    type: String,
    optional: true
  },

  source: {
    type: String,
    optional: true
  },

  artworkUrl: {
    type: String,
    optional: true
  },

  previewImage: {
    type: String,
    optional: true
  },

  title: {
    type: String,
    optional: true,
    defaultValue: ''
  },

  description: {
    type: String,
    optional: true,
    defaultValue: ''
  },
  fileExtension: {
    type: String,
    optional: true
  },

  // Image


  flickrFarm: {
    type: String,
    optional: true
  },
  flickrSecret: {
    type: String,
    optional: true
  },
  flickrServer: {
    type: String,
    optional: true
  },
  uploadDate: {
    type: Date,
    optional: true
  },
  ownerName: {
    type: String,
    optional: true
  },

  hasWebM: {
    type: Boolean,
    optional: true
  },

  hasMP4: {
    type: Boolean,
    optional: true
  },



  // Image upload
  width: {
    type: Number,
    optional: true
  },
  height: {
    type: Number,
    optional: true
  },

  // twitter
  retweet: {
    type: String,
    optional: true
  },
  creationDate: {
    type: String,
    optional: true
  },
  username: {
    type: String,
    optional: true
  },
  screenname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  userPic: {
    type: String,
    optional: true
  },
  text: {
    type: String,
    optional: true
  },
  entities: {
    type: Object,
    optional: true,
    blackbox: true
  },
  extendedEntities: {
    type: Object,
    optional: true,
    blackbox: true
  },
  retweetedStatus: {
    type: Object,
    optional: true,
    blackbox: true
  },

  // Link
  title: { type: String, optional: true },
  thumbnailUrl: { type: String, optional: true },
  url: { type: String, optional: true },
  originalUrl: { type: String, optional: true },
  providerName: { type: String, optional: true },
  providerUrl: { type: String, optional: true },
  authorUrl: { type: String, optional: true },
  authorName: { type: String, optional: true },
  thumbnailHeight: { type: Number, optional: true },
  thumbnailWidth: { type: Number, optional: true },
  embedlyType: { type: String, optional: true },
  imageOnLeft: { type: Boolean, optional: true },

  // Rich or Extract
  html: { type: String, optional: true },


  // Map

  mapQuery: {
    type: String,
    optional: true
  },
  mapType: {
    type: String,
    allowedValues: ['roadmap', 'satellite'],
    defaultValue: 'satellite',
    optional: true,
    autoform: {
      afFieldInput: {
        firstOption: false,
        options: 'allowed'
      }
    }
  }

});

Schema.ContextBlocks = new SimpleSchema({
  streamShortId: {
    type: String
  },
  authorId: {
    type: String
  },
  type: {
    type: String
  },
  source: {
    type: String,
    optional: true
  },
  fromEmbedly: {
    type: Boolean,
    optional: true
  },
  version: {
    type: String,
    optional: true
  },
  savedAt: {
    type: Date,
    optional: true
  },
  publishedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    optional: true // optional because only added this fieldjust before launch
  },
  fullDetails: {
    type: Object,
    optional: true,
    blackbox: true
  },
  description: {
    type: String,
    optional: true
  },
  content: {
    type: String,
    trim: false,
    optional: true
  },
  published: {
    type: Boolean,
    defaultValue: false
  },
  everPublished: {
    type: Boolean,
    defaultValue: false
  },
  reference: {
    type: Schema.ContextReferenceProfile,
    optional: true
  },

  searchQuery: {
    type:String,
    optional:true
  },
  searchOption: {
    type: String,
    optional:true
  }
});

ContextBlocks.attachSchema(Schema.ContextBlocks);


this.ContextBlocks.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true
  },
  remove: function() {
    return true
  }
});

this.Streams = new Mongo.Collection("streams", {
  transform: function(doc) {
    return new Stream(doc);
  }
});
