var ContextBlock, MapBlock, Schema, Story, TextBlock, VideoBlock, checkOwner,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Schema = {};

Story = (function() {
  function Story(doc) {
    _.extend(this, doc);
    if (this.verticalSections == null) {
      this.verticalSections = [];
    }
    if (this.published == null) {
      this.published = false;
    }
    if (this.verticalSections.length === 0) {
      this.verticalSections.push({
        _id: Random.id(8),
        contextBlocks: [],
        title: "",
        content: ""
      });
    }
  }

  Story.prototype.contentPreview = function() {
    var content;
    if (content = this.verticalSections[0].content) {
      return content.replace(/(<([^>]+)>)/ig, "");
    }
  };

  Story.prototype.updateAuthor = function(user) {
    if (user == null) {
      user = Meteor.user();
    }
    this.authorId = user._id;
    this.authorName = user.profile.name;
    return this.title = "";
  };

  Story.prototype.save = function() {
    var updateDoc;
    if (!this._id) {
      throw new Meteor.Error('not-yet-created');
    }
    updateDoc = {
      lastSaved: new Date,
      verticalSections: this.verticalSections,
      title: this.title,
      backgroundImage: this.backgroundImage
    };
    return Stories.update({
      _id: this._id
    }, {
      $set: updateDoc
    });
  };

  Story.prototype.publish = function() {
    var dasherizedTitle;
    if (!this.lastSaved) {
      throw new Meteor.Error('not-yet-saved');
    }
    if (this.published) {
      throw new Meteor.Error('already-published');
    }
    dasherizedTitle = _s.slugify(this.title.toLowerCase());
    if (confirm('Your story will have the url path: /' + dasherizedTitle)) {
      return Stories.update({
        _id: this._id
      }, {
        $set: {
          published: true,
          publishedDate: new Date,
          lastSaved: new Date,
          storyPathSegment: dasherizedTitle
        }
      });
    }
  };

  return Story;

})();

if (Meteor.isClient) {
  window.Story = Story;
}

this.Stories = new Meteor.Collection("stories", {
  transform: function(doc) {
    return new Story(doc);
  }
});

checkOwner = function(userId, doc) {
  return userId && userId === doc.authorId;
};

this.Stories.allow({
  update: function(userId, doc, fieldNames) {
    var disallowedFields;
    disallowedFields = ['authorId', 'storyPathSegment', 'userPathSegment', 'favorited'];
    if (_.intersection(fieldNames, disallowedFields).length) {
      return false;
    }
    return checkOwner(userId, doc);
  }
});

this.Stories.deny({
  insert: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

Schema.Stories = new SimpleSchema({
  backgroundImage: {
    type: String,
    optional: true
  },
  headerImageAttribution: {
    type: String,
    optional: true
  },
  lastSaved: {
    type: Date
  },
  publishDate: {
    type: Date,
    optional: true
  },
  published: {
    type: Boolean,
    defaultValue: false
  },
  userPathSegment: {
    type: String
  },
  storyPathSegment: {
    type: String
  },
  title: {
    type: String,
    defaultValue: ''
  },
  authorId: {
    type: String
  },
  authorName: {
    type: String
  },
  keywords:{
    type: [String],
    defaultValue: []
  },
  deleted: {
    type: Boolean,
    defaultValue: false
  },
  deletedDate: {
    type: Date,
    optional: true
  },
  favorited: {
    type: [String],
    defaultValue: []
  },
  views: {
    type: Number,
    defaultValue: 0
  },
  shared: {
    type: Number,
    defaultValue: 0
  },
  verticalSections: {
    type: [Object],
    minCount: 1,
    maxCount: 1000
  },
  'verticalSections.$._id': {
    type: String
  },
  'verticalSections.$.title': {
    type: String
  },
  'verticalSections.$.content': {
    type: String
  },
  'verticalSections.$.contextBlocks': {
    type: [String],
    defaultValue: []
  }
});

this.Stories.attachSchema(Schema.Stories);

ContextBlock = (function() {
  function ContextBlock(doc) {
    _.extend(this, doc);
  }

  return ContextBlock;

})();

VideoBlock = (function(_super) {
  __extends(VideoBlock, _super);

  function VideoBlock(doc) {
    VideoBlock.__super__.constructor.call(this, doc);
    this.type = 'video';
    if (this.service == null) {
      this.service = 'youtube';
    }
  }

  VideoBlock.prototype.url = function() {
    if (this.service === 'youtube') {
      return '//www.youtube.com/embed/' + this.videoId;
    } else if (this.service === 'vimeo') {
      return '//player.vimeo.com/video/' + this.videoId;
    }
  };

  VideoBlock.prototype.previewUrl = function() {
    if (this.service === 'youtube') {
      return '//img.youtube.com/vi/' + this.videoId + '/0.jpg';
    }
  };

  VideoBlock.prototype.thumbnailUrl = function() {
    if (this.service === 'youtube') {
      return '//i.ytimg.com/vi/' + this.videoId + '/default.jpg';
    }
  };

  return VideoBlock;

})(ContextBlock);

MapBlock = (function(_super) {
  __extends(MapBlock, _super);

  function MapBlock(doc) {
    MapBlock.__super__.constructor.call(this, doc);
    this.type = 'map';
    if (this.service == null) {
      this.service = 'google_maps';
    }
  }

  MapBlock.prototype.description = function() {
    return this.mapQuery;
  };

  MapBlock.prototype.escape = function(value) {
    return encodeURIComponent(value).replace(/%20/g, "+");
  };

  MapBlock.prototype.url = function() {
    if (this.service === 'google_maps') {
      return 'https://www.google.com/maps/embed/v1/place?' + 'key=' + GOOGLE_API_CLIENT_KEY + '&q=' + this.escape(this.mapQuery) + '&maptype=' + this.escape(this.mapType);
    }
  };

  MapBlock.prototype.previewUrl = function() {
    if (this.service === 'google_maps') {
      return 'https://maps.googleapis.com/maps/api/staticmap?' + 'key=' + GOOGLE_API_CLIENT_KEY + '&center=' + this.escape(this.mapQuery) + '&maptype=' + this.escape(this.mapType) + '&size=' + '520x300';
    }
  };

  return MapBlock;

})(ContextBlock);

TextBlock = (function(_super) {
  __extends(TextBlock, _super);

  function TextBlock(doc) {
    TextBlock.__super__.constructor.call(this, doc);
    this.type = 'text';
  }

  TextBlock.prototype.description = function() {
    var maxLength;
    maxLength = 40;
    if (this.content.length <= maxLength) {
      return this.content;
    } else {
      return this.content.slice(0, maxLength) + '...';
    }
  };

  return TextBlock;

})(ContextBlock);

if (Meteor.isClient) {
  window.VideoBlock = VideoBlock;
  window.MapBlock = MapBlock;
  window.ContextBlock = ContextBlock;
  window.TextBlock = TextBlock;
}

this.ContextBlocks = new Meteor.Collection("context_blocks", {
  transform: function(doc) {
    switch (doc.type) {
      case 'video':
        return new VideoBlock(doc);
      case 'text':
        return new TextBlock(doc);
      case 'map':
        return new MapBlock(doc);
      default:
        return new ContextBlock(doc);
    }
  }
});

this.ContextBlocks.allow({
  insert: function(userId, doc) {
    return checkOwner(userId, doc);
  },
  update: function(userId, doc) {
    if (_.contains(fieldNames, 'authorId')) {
      return false;
    }
    return checkOwner(userId, doc);
  },
  remove: function(userId, doc) {
    return checkOwner(userId, doc);
  }
});

Schema.ContextBlocks = new SimpleSchema({
  authorId: {
    type: String
  },
  type: {
    type: String
  },
  service: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  videoId: {
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
    defaultValue: 'satellite',
    optional: true,
    autoform: {
      afFieldInput: {
        firstOption: false,
        options: 'allowed'
      }
    }
  },
  content: {
    type: String,
    label: "Text",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        "class": "text-input"
      }
    }
  },
  url: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  videoCreationDate: {
    type: String,
    optional: true
  },
  videoUsername: {
    type: String,
    optional: true
  },
  videoUsernameId: {
    type: String,
    optional: true
  }
});

this.ContextBlocks.attachSchema(Schema.ContextBlocks);

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String,
    regEx: /^[a-z0-9A-Z\s]*$/,
    optional: true,
    min: 2,
    max: 127
  },
  bio: {
    type: String,
    optional: true,
    max: 2000,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        "class": "bio"
      }
    }
  },
  favorites: {
    type: [String],
    optional: true,
    defaultValue: []
  }
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email address",
    autoform: {
      afFieldInput: {
        readOnly: true,
        disabled: true
      }
    }
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Schema.UserProfile,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(Schema.User);
