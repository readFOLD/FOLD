window.constants = {
  verticalSpacing: 12,
  readModeOffset: 286,
  minPageWidth: 1024
};

window.getVerticalLeft = function(width) {
  return Meteor.Device.isPhone() ? (Session.get('windowWidth') > 340 ? 30 : 20) : 106;
};

window.getHorizontalLeft = function() {
  var currentPos, currentHorizontal, cardWidth, numCards, left, offset, pageWidth, verticalRight, addContextBlockWidth, cardSeparation;

  currentHorizontal = Session.get("horizontalSectionsMap")[Session.get("currentY")];
  if (!currentHorizontal) { 
    return 
  }

  // Variable definitions (width of page, width of card, offset of cards)
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

  if (numCards === 1){
    return verticalRight + offset + cardSeparation;
  }

  if (Session.get("wrap")[this.verticalId] || numCards === 2) { // wrapping (and always position as if wrapping when two cards)

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
  } else { // not wrapping

    if (currentPos === numCards - 1 || currentPos < -1) { // this makes cards appear on the right when they run off the left
      currentPos = numCards + currentPos;
    }

    if (currentPos >= 0) {
      left = (currentPos * (cardWidth + cardSeparation)) + (verticalRight + cardSeparation + offset);
    } else {

      left = ((currentPos + 1) * (cardWidth + cardSeparation)) + (verticalLeft - cardWidth - cardSeparation);
    }


    return left;
  }
};

window.getVerticalHeights = function() {
  var sum, verticalHeights;
  var offset = Session.get('read') ? constants.readModeOffset : constants.readModeOffset + constants.verticalSpacing;
  verticalHeights = [offset];
  sum = offset;
  $('.vertical-narrative-section').each(function() {
    sum += $(this).outerHeight() + constants.verticalSpacing;
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
  currentXByYId = Session.get("currentXByYId");
  currentXByYId[Session.get("currentYId")] = x;
  Session.set("currentXByYId", currentXByYId);
};

window.goToContext = function(id) {
  var contextIndex, currentVertical, currentY, story;
  if (id) {
    currentY = Session.get('currentY');

    contextIndex = _.indexOf(_.pluck(Session.get('horizontalSectionsMap')[currentY].horizontal, '_id'), id.toString());
    if (contextIndex >= 0) {
      if (Meteor.Device.isPhone()){
        Session.set('mobileContextView', true);
      }
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

window.goRightOneCard = function() {
  var currentX, horizontalSection, newX;
  horizontalSection = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal;
  currentX = Session.get("currentX");
  currentY = Session.get("currentY");
  currentYId = Session.get("currentYId");
  if (currentX === (horizontalSection.length - 1)) { // end of our rope
    newX = 0;
    wrap = Session.get("wrap");
    wrap[currentYId] = true;
    Session.set("wrap", wrap);
  } else {
    newX = currentX + 1;
  }
  goToX(newX);
};

window.goLeftOneCard = function() {
  var currentX, horizontalSection, newX;
  horizontalSection = Session.get("horizontalSectionsMap")[Session.get("currentY")].horizontal;
  currentX = Session.get("currentX");
  newX = currentX ? currentX - 1 : horizontalSection.length - 1;
  goToX(newX);
};

window.moveOneCard = function(d) {
  if (d < 0) {
    return goDownOneCard();
  } else if (d > 0) {
    return goUpOneCard();
  }
};

$(document).keydown(function(e) {
  if (Router.current().route.getName() === 'read'){
    letter = String.fromCharCode(e.keyCode);
    switch(letter){
      case 'J':
        goDownOneCard();
        break;
      case 'K':
        goUpOneCard();
        break;
      case 'H':
        if(Session.get('pastHeader')){
          goLeftOneCard();
        }
        break;
      case 'L':
        if(Session.get('pastHeader')) {
          goRightOneCard();
        }
        break;
      case '&': // up arrow
        goUpOneCard();
        break;
      case '(': // down arrow
        goDownOneCard();
        break;
      case '%': // left arrow
        if(Session.get('pastHeader')){
          goLeftOneCard();
        }
        break;
      case '\'': // right arrow
        if(Session.get('pastHeader')) {
          goRightOneCard();
        }
        break;
      case ' ': // spacebar
        break;
    }
  }
});
