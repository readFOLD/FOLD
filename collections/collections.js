var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };


SimpleSchema.debug = true; // TODO Remove after launch

if(!this.Schema){
  Schema = {};
};

// TO-DO consider replacing htmlclean with https://github.com/cristo-rabani/meteor-universe-html-purifier/
var cleanHtmlOptions = {
  allowedTags: ['strong', 'em', 'u', 'b', 'a', 'br'], // only allow tags used in fold-editor and
  format: false,
  removeTags: [], // allow u tag
  removeAttrs: ['class', 'id', 'href'], // strip away hrefs and other undesired attributes that might slip into a paste
  allowedAttributes: [["data-context-id"],["data-context-type"],["data-context-source"]] // data-context-id is used to direct links to context cards
};

var matchAnchors =  /<a( data-context-[a-z]*?=["|'].*?["|'])?( data-context-[a-z]*?=["|'].*?["|'])?( data-context-[a-z]*?=["|'].*?["|'])?.*?>/gm; // match anchors, capture data-context-id and other attributes so it can be kept in string
var matchBlankAnchors = /<a href="javascript:void\(0\);">(.*?)<\/a>/gm; // match anchors that are left over from above if copied from somewhere else, capture contents so can be kept

cleanVerticalSectionContent = function(html) {


  var initialClean = $.htmlClean(html, _.extend({}, _.omit(cleanHtmlOptions, 'allowedTags'), {allowEmpty: ['div']})); // do all cleaning except tag removal. allowEmpty means <div><br></div> turns into <div></div> instead of being deleted entirely
  
  var linebreakClean = initialClean
    .replace(new RegExp('<br />', 'g'), '<br>')
    .replace(new RegExp('<div><br></div>', 'g'), '<br>')
    .replace(new RegExp('<div>', 'g'), '<br>')
    .replace(new RegExp('</div>', 'g'), '');

  return $.htmlClean(linebreakClean, cleanHtmlOptions)
    .replace(matchAnchors, '<a href="javascript:void(0);"$1$2$3>') // add js void to all anchors and keep all data-context-ids and other data attributes
    .replace(matchBlankAnchors, '$1') // remove anchors without data-context-ids
    .replace(new RegExp('<br />', 'g'), '<br>');

};

if (Meteor.isClient) {
  window.cleanVerticalSectionContent = cleanVerticalSectionContent;
}


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

Schema.ContextBlocksExtension = new SimpleSchema({
  streamShortId: {
    type: String
  }
});

this.ContextBlocks.attachSchema(Schema.ContextBlocksExtension);


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



// DEEPSTREAM

Deepstream = (function() {
  function Deepstream(doc) {
    _.extend(this, doc);
    var that = this;
    this.streams = _.map(this.streams, function(stream){
      return new Stream(stream);
    });
    this.contextBlocks = _.map(this.contextBlocks, function(contextBlock){
      return newTypeSpecificContextBlock(contextBlock);
    });
  }

  Deepstream.prototype.contextCountOfType = function(type) {
    return this.contextBlocks.reduce(function(count, contextBlock){
      if(contextBlock.type === type){
        count++;
      }
      return count;
    }, 0)
  };

  Deepstream.prototype.countContextTypes = function(){
    return _.chain(this.contextBlocks).pluck('type').countBy(_.identity).value()
  };

  Deepstream.prototype.contextOfType = function(type) {
    if (type === 'stream'){
      return []; // streams aren't context
    }
    return _.chain(this.contextBlocks)
      .where({type : type})
      .value();
  };

  Deepstream.prototype.hasContextOfType = function(type) {
    if(type === 'chat'){
      return true // TODO this is a hack
    }
    return this.contextOfType(type).length;
  };

  Deepstream.prototype.mostRecentContext = function() {
    return this.contextBlocks ? _.last(_.sortBy(this.contextBlocks, 'addedAt')) : null;
  };

  Deepstream.prototype.mostRecentContextOfType = function(type) {
    if(this.hasContextOfType(type)){
      return this.contextBlocks ? _.last(_.sortBy(this.contextOfType(type), 'addedAt')) : null;
    }
  };

  Deepstream.prototype.nextContext = function(contextId) {
    if(!this.contextBlocks){
      return null;
    }
    var contextBlock = _.findWhere(this.contextBlocks, {_id: contextId});
    if(!contextBlock){
      return null;
    }
    var type = contextBlock.type;
    var contextOfType = this.contextOfType(type);
    var index = _.indexOf(contextOfType, contextBlock);
    if (index < contextOfType.length - 1){
      return contextOfType[index + 1];
    }
  };
  Deepstream.prototype.previousContext = function(contextId) {
    if(!this.contextBlocks){
      return null;
    }
    var contextBlock = _.findWhere(this.contextBlocks, {_id: contextId});
    if(!contextBlock){
      return null;
    }
    var type = contextBlock.type;
    var contextOfType = this.contextOfType(type);
    var index = _.indexOf(contextOfType, contextBlock);
    if (index > 0){
      return contextOfType[index - 1];
    }
  };

  Deepstream.prototype.activeStream = function(){
    return this.getStream(this.activeStreamId);
  };

  Deepstream.prototype.getStream = function(id){
    return _.findWhere(this.streams, {_id: id});
  };

  Deepstream.prototype.watchPath = function(){
    return '/watch/' + this.userPathSegment + '/' + this.streamPathSegment;
  };

  Deepstream.prototype.curatePath = function(){
    return '/curate/' + this.userPathSegment + '/' + this.streamPathSegment;
  };

  Deepstream.prototype.previewUrl = function(){
    var activeStream = this.activeStream();
    return activeStream ? activeStream.previewUrl() : null;
  };

  return Deepstream;

})();


this.Deepstreams = new Mongo.Collection("deepstreams", {
  transform: function(doc) {
    return new Deepstream(doc);
  }
});

this.Deepstreams.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true
  },
  remove: function() {
    return true;
  }
});

