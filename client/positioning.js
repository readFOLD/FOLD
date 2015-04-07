window.constants = {
  verticalSpacing: 12,
  readModeOffset: 250,
  minPageWidth: 1024
};

window.getVerticalLeft = function(width) {
  return 106;
};

window.getHorizontalLeft = function() {
  var currentPos, currentHorizontal, cardWidth, numCards, left, offset, pageWidth, verticalRight, addContextBlockWidth, cardSeparation;

  currentHorizontal = Session.get("horizontalSectionsMap")[Session.get("currentY")];
  if (!currentHorizontal) { 
    return 
  }

  // Variable definitions (width of page, width of card, offset of cards)
  pageWidth = Session.get("windowWidth") >= 1024 ? Session.get("windowWidth") : 1024;
  cardWidth = Session.get("cardWidth");
  cardSeparation = Session.get("separation");
  addContextBlockWidth = 75;
  verticalLeft = Session.get("verticalLeft");
  verticalRight = verticalLeft + cardWidth;

  // Offset of first card, different on create page because of (+) button
  if (Session.get("read")) {
    offset = 0;
  } else {
    offset = addContextBlockWidth + cardSeparation;
  }
  if (Session.get("addingContext")) {
    offset += cardWidth + cardSeparation;
  }
  currentPos = this.index - Session.get("currentX");
  numCards = currentHorizontal.horizontal.length;

  if (!Session.get("wrap")[this.verticalIndex]) { // not wrapping

    if (currentPos === numCards - 1 || currentPos < -1){ // this makes cards appear on the right when they run off the left
      currentPos = numCards + currentPos;
    }

    if (currentPos >= 0) {
      left = (currentPos * (cardWidth + cardSeparation)) + (verticalRight + cardSeparation + offset);
    } else {

      left = ((currentPos + 1) * (cardWidth + cardSeparation)) + (verticalLeft - cardWidth - cardSeparation);
    }



    return left;
  } else { // wrapping

    if (currentPos < 0) { // makes the first card appear at the end of the last card
      currentPos = numCards + currentPos;
    }

    // Default context positioning (all to the right of vertical narrative)
    left = (currentPos * (cardWidth + cardSeparation)) + (verticalRight + cardSeparation + offset);
  
    // Last card positioning if number of cards is greater than 3
    if (numCards >= 3) {
      if (currentPos === numCards - 1) {
        left = verticalLeft - cardWidth - cardSeparation;
      }
    }
    return left;
  }
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
  if (Session.get("currentY") !== y){
    var verticalHeights;
    verticalHeights = window.getVerticalHeights();
    $('body,html').animate({
      scrollTop: verticalHeights[y]
    }, 500, 'easeInExpo', function() {
      Session.set("currentY", y);
    });
  }
};

window.goToX = function(x) {
  currentXByRow = Session.get("currentXByRow");
  currentXByRow[Session.get("currentY")] = x;
  Session.set("currentXByRow", currentXByRow);
};

window.goToContext = function(id) {
  var contextIndex, currentVertical, currentY, story;
  if (id) {
    story = Session.get('story');
    currentY = Session.get('currentY');

    contextIndex = _.indexOf(_.pluck(Session.get('horizontalSectionsMap')[currentY].horizontal, '_id'), id.toString());
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
