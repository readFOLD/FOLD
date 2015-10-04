nextCreationStepAfter = function(currentStep){
  var currentIndex =_.indexOf(CREATION_STEPS, currentStep);
  if (currentIndex == -1){
    throw new Meteor.Error(currentStep + 'is not a valid step in CREATION_STEPS');
  }
  return CREATION_STEPS[currentIndex + 1];
};

creationStepBefore = function(currentStep){
  var currentIndex = _.indexOf(CREATION_STEPS, currentStep);
  if (currentIndex == -1){
    throw new Meteor.Error(currentStep + 'is not a valid step in CREATION_STEPS');
  } else if (currentIndex === 0) {
    throw new Meteor.Error(currentStep + 'has no prior steps in in CREATION_STEPS');
  }
  return CREATION_STEPS[currentIndex - 1];
};


buildRegExp = function(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
};


idFromPathSegment = function(pathSegment) { // everything after last dash
  return pathSegment.substring(pathSegment.lastIndexOf('-') + 1);
};

generateStreamPathSegment = function(shortId, title){
  return _s.slugify(title ? title.toLowerCase() : 'deep-stream') + '-' + shortId;
};

newTypeSpecificContextBlock = function (doc) {
  switch (doc.type) {
    case 'stream':
      return new Stream(doc);
    case 'video':
      return new VideoBlock(doc);
    case 'text':
      return new TextBlock(doc);
    case 'map':
      return new MapBlock(doc);
    case 'image':
      return new ImageBlock(doc);
    case 'audio':
      return new AudioBlock(doc);
    case 'twitter':
      return new TwitterBlock(doc);
    case 'link':
      return new LinkBlock(doc);
    case 'news':
      return new NewsBlock(doc);
    default:
      return new ContextBlock(doc);
  }
};

// only the curator may update the stream
updateDeepstream = function(selector, modifier, options) {
  if (_.isEmpty(modifier)){
    return
  }
  modifier.$set = _.extend(modifier.$set || {}, {savedAt: new Date});
  selector.curatorIds = this.userId; // this.userId must be the user (use via .call or .apply)

  return Deepstreams.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
};

updateContextBlock = function(selector, modifier, options) {
  if (_.isEmpty(modifier)){
    return
  }
  modifier.$set = _.extend(modifier.$set || {}, {savedAt: new Date});

  return ContextBlocks.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
};

addContextToStream =  function (streamShortId, contextBlock) {
  check(streamShortId, String);
  check(contextBlock, Object);

  var deepstream = Deepstreams.findOne({shortId: streamShortId}, {fields: {'creationStep': 1, 'curatorIds': 1}});

  if(!_.contains(deepstream.curatorIds, this.userId)){
    throw new Meteor.Error('User not authorized to add context to this stream');
  }

  var pushObject, pushSelectorString;
  pushSelectorString = 'contextBlocks';
  pushObject = {};
  var contextBlockToInsert = _.extend({}, contextBlock, {
    streamShortId: streamShortId,
    authorId: this.userId, // TODO, make this correct
    addedAt: new Date,
    savedAt: new Date
  });

  var contextId = ContextBlocks.insert(contextBlockToInsert);

  pushObject[pushSelectorString] = _.extend(_.pick(contextBlockToInsert, ['type', 'source']), {_id: contextId, rank: 0}); // TODO, anything else?;

  var modifierObject = {
    '$addToSet': pushObject
  };


  modifierObject['$set'] = {};

  // advance creation if at this creation step
  if (deepstream.creationStep === 'add_cards') {
    _.extend(modifierObject['$set'], {
      creationStep: nextCreationStepAfter('add_cards')
    });
  }

  if (!contextId) {
    throw new Meteor.Error('Context block not inserted')
  }

  var numUpdated = updateDeepstream.call(this, {shortId: streamShortId}, modifierObject);

  if (!numUpdated) {
    throw new Meteor.Error('Stream not updated')
  }


  if (Meteor.isClient) {
    Session.set("mediaDataType", Session.get('mediaDataType'));
    Session.set("mediaDataType", null); // leave search mode
    var typeSpecificContextBlock = newTypeSpecificContextBlock(contextBlock);
    if (typeSpecificContextBlock.soloModeLocation === 'sidebar') {
      setCurrentContext(typeSpecificContextBlock); // if single context is in sidebar, show that instead of default list mode
    }
  }

  return contextBlock._id;
};
