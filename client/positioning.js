(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
window.constants = {
  verticalSpacing: 12,
  readModeOffset: 250
};

window.getVerticalHeights = function() {
  var sum, verticalHeights;
  verticalHeights = [constants.readModeOffset];
  sum = constants.readModeOffset;
  $('section.vertical-narrative-section').each(function() {
    sum += $(this).height() + 12;
    return verticalHeights.push(sum);
  });
  return verticalHeights;
};

window.goToXY = function(x, y) {
  if (y !== Session.get("currentY")) {
    goToY(y);
  }
  return goToX(x);
};

window.goToY = function(y) {
  var verticalHeights;
  $('.horizontal-context').fadeOut(100);
  verticalHeights = window.getVerticalHeights();
  $('body,html').animate({
    scrollTop: verticalHeights[y]
  }, 500, 'easeInExpo', function() {
    Session.set("currentY", y);
    return $('.horizontal-context').fadeIn();
  });
};

window.goToX = function(x) {
  Session.set("currentX", x);
};

window.goToContext = function(id) {
  var contextIndex, currentVertical, currentY, story;
  if (id) {
    story = Session.get('story');
    currentY = Session.get('currentY');
    currentVertical = story.verticalSections[currentY];
    contextIndex = _.indexOf(currentVertical.contextBlocks, id);
    if (contextIndex >= 0) {
      return goToX(contextIndex);
    }
  }
};

window.goDownOneCard = function() {
  var currentY, newY;
  currentY = Session.get("currentY");
  newY = currentY + 1;
  return goToXY(0, newY);
};

window.goUpOneCard = function() {
  var currentY, newY;
  currentY = Session.get("currentY");
  newY = currentY - 1;
  return goToXY(0, newY);
};

window.moveOneCard = function(d) {
  if (d < 0) {
    return goDownOneCard();
  } else if (d > 0) {
    return goUpOneCard();
  }
};

})();
