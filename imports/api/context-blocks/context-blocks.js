import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import newTypeSpecificContextBlock from './new-type-specific-context-block.js'

class ContextBlocksCollection extends Mongo.Collection {
  transform: newTypeSpecificContextBlock
}

export const ContextBlocks = new ContextBlocksCollection('context_blocks');

ContextBlocks.deny({
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

ContextReferenceProfile = new SimpleSchema({
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


  flickrOwnerId: {
    type: String,
    optional: true
  },
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
  flickrSecretOrig: {
    type: String,
    optional: true
  },
  flickrFormatOrig: {
    type: String,
    optional: true
  },
  lgUrl: {
    type: String,
    optional: true
  },
  lgHeight: {
    type: String,
    optional: true
  },
  lgWidth: {
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
  thumbnailFallback: { type: String, optional: true },
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

  // OEC
  oecYear: {
    type: String,
    optional: true
  },
  oecCountry: {
    type: String,
    optional: true
  },
  oecDirection: {
    type: String,
    optional: true
  },

  mapQuery: {
    type: String,
    optional: true
  },
  mapType: {
    type: String,
    allowedValues: ['roadmap', 'satellite'],
    optional: true,
    autoform: {
      afFieldInput: {
        firstOption: false,
        options: 'allowed'
      }
    }
  },
  // link override
  thumbnailId: {
    type: String,
    optional: true
  },
  thumbnailFileExtension: {
    type: String,
    optional: true
  },

  // Action
  buttonText: { type: String, optional: true },
  buttonUrl: { type: String, optional: true },

});

ContextBlocksSchema = new SimpleSchema({
  storyId: {
    type: String
  },
  storyShortId: {
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
    autoValue () {
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
    label: " ",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        "class": "text-input"
      }
    }
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
    type: ContextReferenceProfile,
    optional: true
  },
  override: {
    type: ContextReferenceProfile,
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

ContextBlocks.attachSchema(ContextBlocksSchema);
