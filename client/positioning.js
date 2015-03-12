window.constants = {
  verticalSpacing: 12,
  readModeOffset: 250,
  minPageWidth: 1024
};

window.getVerticalLeft = function(width) {
  if (width <= 1304) {
    left =  88 + 16;
  } else {
    left = (width / 2) - (Session.get("separation") / 2) - Session.get("cardWidth");
  }
  return left
}

window.getHorizontalLeft = function() {
  var currentPos, currentHorizontal, cardWidth, numCards, left, offset, pageWidth, verticalRight, addContextBlockWidth, cardSeparation;

  currentHorizontal = Session.get("horizontalSectionsMap")[Session.get("currentY")];
  if (!currentHorizontal) { 
    return 
  }

  // Variable definitions (width of page, width of card, offset of cards)
  pageWidth = Session.get("width") >= 1024 ? Session.get("width") : 1024;
  cardWidth = Session.get("cardWidth");
  cardSeparation = Session.get("separation");
  addContextBlockWidth = 75;
  verticalLeft = Session.get("verticalLeft");

  // Offset of first card, different on create page because of (+) button
  if (Session.get("read")) {
    offset = 0;
  } else {
    offset = addContextBlockWidth + cardSeparation;
  }
  if (Session.get("addingContextToCurrentY")) {
    offset += cardWidth + cardSeparation;
  }

  numCards = currentHorizontal.horizontal.length;
  currentPos = this.index - Session.get("currentX");
  if (currentPos < 0) {
    currentPos = numCards + currentPos;
  }

  // Default context positioning (all to the right of vertical narrative)
  verticalRight = verticalLeft + cardWidth
  left = (currentPos * (cardWidth + cardSeparation)) + (verticalRight + cardSeparation + offset);

  // Last card positioning if number of cards is greater than 3
  if (numCards >= 3) {
    if (currentPos === numCards - 1) {
      left = verticalLeft - cardWidth - cardSeparation;
    }
  }
  return left;
}

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
  Session.set("currentX", x);
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
