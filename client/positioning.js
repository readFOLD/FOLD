window.constants = {
  verticalSpacing: 12,
  readModeOffset: 250
};

window.getVerticalHeights = function() {
  var sum, verticalHeights;
  verticalHeights = [constants.readModeOffset];
  sum = constants.readModeOffset;
  $('.vertical-narrative-section').each(function() {
    sum += $(this).outerHeight() + 12;
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
    contextIndex = _.indexOf(currentVertical.contextBlocks, id.toString());
    if (contextIndex >= 0) {
      return goToX(contextIndex);
    }
  }
};

window.goDownOneCard = function() {
  var currentY, newY;
  currentY = Session.get("currentY");
  if (typeof currentY !== 'number'){
    return goToXY(0, 0);
  }

  newY = currentY + 1;
  if (newY < Session.get("story").verticalSections.length){
    return goToXY(0, newY);
  }
};

window.goUpOneCard = function() {
  var currentY, newY;
  currentY = Session.get("currentY");
  newY = currentY - 1;
  if (newY >= 0)
    return goToXY(0, newY);
};

window.moveOneCard = function(d) {
  if (d < 0) {
    return goDownOneCard();
  } else if (d > 0) {
    return goUpOneCard();
  }
};

$(document).keydown(function(e) {
  if (Session.get('read')){
    letter = String.fromCharCode(e.keyCode)
    console.log(letter)
    switch(letter){
      case 'J':
        goUpOneCard()
        break;
      case 'K':
        goDownOneCard()
        break;
      case '&': // up arrow
        goUpOneCard()
        break;
      case '(': // down arrow
        goDownOneCard()
        break;
    }
  }
});
