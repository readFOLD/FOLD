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
}

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
