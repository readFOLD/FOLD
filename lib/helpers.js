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
}


idFromPathSegment = function(pathSegment) { // everything after last dash
  return pathSegment.substring(pathSegment.lastIndexOf('-') + 1);
};
