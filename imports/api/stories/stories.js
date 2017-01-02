import { _ } from 'meteor/underscore';
import { ContextBlock } from '../context-blocks/context-block.js'
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class StoriesCollection extends Mongo.Collection {
  transform (doc) {
    return new Story(doc);
  }
};


export const Stories = new StoriesCollection('stories');


Stories.deny({
  insert () {
    return true;
  },
  update () {
    return true
  },
  remove () {
    return true;
  }
});


var verticalSectionSchema = new SimpleSchema({
  '_id': {
    type: String
  },
  'title': {
    type: String,
    optional: true
  },
  'hasTitle': {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  'content': {
    type: String,
    trim: false
  },
  'contextBlocks': {
    type: [String],
    defaultValue: []
  }
});

var sharedStorySchema = function(options) {
  options = options || {};
  return {
    headerImageFormat: {
      type: String,
      optional: true
    },
    headerImageAttribution: {
      type: String,
      optional: true
    },
    headerImage: {
      type: String,
      optional: true,
      autoValue () {
        if(options.draft){
          if (this.isSet) {
            return this.value;
          } else {
            return this.unset();
          }
        }
        var placeholderNumber = _.random(1,13).toString();
        if (this.isSet) {
          return this.value;
        } else if (this.isInsert) {
          return placeholderNumber;
        } else if (this.isUpsert) {
          return {$setOnInsert: placeholderNumber};
        } else {
          this.unset();
        }
      }
    },
    storyPathSegment: {
      type: String
    },
    title: {
      type: String,
      defaultValue: ''
    },
    keywords:{
      type: [String],
      defaultValue: []
    },
    narrativeRightsReserved: {
      type: Boolean,
      optional: true
    },
    verticalSections: {
      type: [verticalSectionSchema],
      minCount: 1,
      maxCount: 1000
    }
  }
};

var draftStorySchema = new SimpleSchema(sharedStorySchema({draft: true}));

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


StoriesSchema = new SimpleSchema(_.extend({}, sharedStorySchema(), {
    shortId: {
      type: String
    },
    savedAt: {
      type: Date
    },
    createdAt: {
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
    'r': { // relevancy for published stories. determines order of results on homepage
      type: Date,
      optional: true
    },
    publishedAt: {
      type: Date,
      optional: true
    },
    firstPublishedAt: {
      type: Date,
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
    userPathSegment: {
      type: String
    },
    authorId: {
      type: String
    },
    authorName: {
      type: String
    },
    authorUsername: {
      type: String
    },
    authorDisplayUsername: {
      type: String,
      optional: true
    },

    deleted: {
      type: Boolean,
      defaultValue: false
    },
    deletedAt: {
      type: Date,
      optional: true
    },

    favorited: {
      type: [String],
      defaultValue: []
    },
    favoritedTotal: {
      type: Number,
      defaultValue: 0
    },
    editorsPick: {
      type: Boolean,
      optional: true
    },
    editorsPickAt: {
      type: Date,
      optional: true
    },

    analytics: {
      type: Object
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
    contextBlocks: {
      type: [ContextBlock], // TODO this should really be Schema.ContextBlocks, but would need to be converted to a regular object, otherwise simple-schema complains
      minCount: 0,
      maxCount: 1000,
      defaultValue: []
    },
    contextBlockIds: {
      type: [String],
      minCount: 0,
      maxCount: 1000,
      defaultValue: []
    },
    contextBlockTypeCount:{
      type: Object,
      optional: true,
      blackbox: true
    },
    narrativeBlockCount:{
      type: Number,
      optional: true
    },
    draftStory: {
      type: draftStorySchema
    },
    'version': {
      type: String,
      optional: true
    }
  })
);

Stories.attachSchema(StoriesSchema);
