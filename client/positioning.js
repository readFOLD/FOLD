window.constants = {
  verticalSpacing: 20, // there is css that needs to match this
  readModeOffset: 246,
  minPageWidth: 1024,
  selectOffset: - 210,
  baselineCardHeight: 300
};

if(Meteor.Device.isPhone()){
  window.constants.readModeOffset = 0;
  window.constants.verticalSpacing = 15;
}

window.getVerticalLeft = function() {
  var windowWidth = Session.get('windowWidth');
  return Math.min(90, (windowWidth - 2 * getCardWidth(windowWidth) - constants.verticalSpacing) / 2);
};

Tracker.autorun(function(){
  var inEmbedMode = embedMode();
  if(inEmbedMode){
    var inSandwichMode = sandwichMode();
    if(!inSandwichMode){
      window.constants.selectOffset = 0;
      return
    }
  }

  window.constants.selectOffset = -210; // original
});

window.getHorizontalLeft = function() {
  var currentPos, currentHorizontal, cardWidth, numCards, left, offset, pageWidth, verticalRight, addContextBlockWidth, cardSeparation;
  
  // Variable definitions (width of page, width of card, offset of cards)
  cardWidth = Session.get("cardWidth");
  cardSeparation = Session.get("separation");
  addContextBlockWidth = 75;
  verticalLeft = getVerticalLeft();
  verticalRight = verticalLeft + cardWidth;

  var currentY = Session.get("currentY");
  var currentX = Session.get("currentX");
  var wrap = Session.get("wrap");
  var horizontalSectionsMap = Session.get("horizontalSectionsMap");
  var inHiddenContextMode = hiddenContextMode();

  // Offset of first card, different on create page because of (+) button
  if (Session.get("read")) {
    offset = 0;
  } else {
    offset = addContextBlockWidth + cardSeparation;
  }
  if (Session.get("addingContext")) {
    offset += cardWidth + cardSeparation;
  }

  if(this.verticalIndex === currentY){
    currentHorizontal = horizontalSectionsMap[currentY];
    if (!currentHorizontal) {
      return
    }
    currentPos = this.index - currentX;
    numCards = currentHorizontal.horizontal.length;
  } else { // card is from another row
    currentPos = this.index - getXByYId(this.verticalId);
    numCards = horizontalSectionsMap[this.verticalIndex].horizontal.length;
  }


  if(inHiddenContextMode){
    // we do something different
    var focusCardLeft = (Session.get('windowWidth') - cardWidth) / 2;
    if(currentPos === 0){
      return focusCardLeft
    }

    var positiveWrapPoint;
    var negativeWrapPoint;

    if(numCards <= 3){
      positiveWrapPoint = 1;
      negativeWrapPoint = -1;
    } else if(numCards <= 4) {
      positiveWrapPoint = 1;
      negativeWrapPoint = -2;
    } else if(numCards <= 5) {
      positiveWrapPoint = 2;
      negativeWrapPoint = -2;
    } else if(numCards <= 6) {
      positiveWrapPoint = 2;
      negativeWrapPoint = -3;
    } else {
      positiveWrapPoint = 3;
      negativeWrapPoint = -3;
    }

    if(currentPos > positiveWrapPoint){
      currentPos -= numCards;
    } else if (currentPos < negativeWrapPoint){
      currentPos += numCards;
    }


    return (Session.get('windowWidth') - cardWidth) / 2 + currentPos * (cardWidth + cardSeparation)
  }



  if (numCards === 1){
    return verticalRight + offset + cardSeparation;
  }

  if (wrap[this.verticalId] || numCards === 2) { // wrapping (and always position as if wrapping when two cards)

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
  var offset;
  if(Meteor.Device.isPhone()){
    offset = constants.readModeOffset + $('.title-overlay').height();
  } else {
    offset = constants.readModeOffset;
  }
  verticalHeights = [offset];
  sum = offset;
  $('.vertical-narrative-section').each(function() {
    sum += $(this).outerHeight() + constants.verticalSpacing;
    return verticalHeights.push(sum);
  });
  return verticalHeights;
};

window.slideCurrentYIntoPlace = function(){
  goToY(Session.get('currentY'), {force: true})
};

window.goToXY = function(x, y) {
  if (y !== Session.get("currentY")) {
    goToY(y, {complete: goToX.bind(this, x)})
  } else {
    goToX(x);
  }
};

window.goToY = function(y, options) {
  options = options || {};
  options.complete = options.complete || function(){};

  if(hiddenContextMode()){ // don't actually scroll in hidden context mode
    Session.set('currentY', y);
    return Meteor.defer(options.complete);
  }

  if ((options.force) || Session.get("currentY") !== y){
    var verticalHeights;
    verticalHeights = window.getVerticalHeights();
    $('body,html').animate({
      scrollTop: verticalHeights[y]
    }, 500, 'easeInExpo', function() {
      Session.set("currentY", y);
      Meteor.setTimeout(function(){
        options.complete();
      });
    });
  } else {
    options.complete();
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
      if (hiddenContextMode()){
        Session.set('hiddenContextShown', true);
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
    return goToY(newY);
  }
};

window.goUpOneCard = function() {
  var currentY, newY;
  currentY = Session.get("currentY");
  newY = currentY - 1;
  if (newY >= 0)
    return goToY(newY);
};

window.goRightOneCard = function() {
  var currentX, horizontalSection, newX;
  var currentY = Session.get("currentY");

  var h = Session.get("horizontalSectionsMap")[currentY];
  if(!h){
    return
  }
  horizontalSection = h.horizontal;
  currentX = Session.get("currentX");
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
  var h = Session.get("horizontalSectionsMap")[Session.get("currentY")];
  if(!h){
    return
  }
  horizontalSection = h.horizontal;
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

window.horizontalExists = function(){
  var currentY = Session.get('currentY');
  return ((_ref = Session.get('horizontalSectionsMap')[currentY]) != null ? _ref.horizontal.length : void 0) > 1
};

Meteor.startup(function(){
  $(document).keydown(function(e) {
    var currentRoute = Router.current();
    var routeName = currentRoute ? currentRoute.route.getName() : '';

    if($(e.target).is('input, textarea')){
      return
    }
    
    if ((routeName === 'read' || routeName === 'embed' || (routeName === 'edit' && Session.get('read'))) && !signingIn()){
      var letter = String.fromCharCode(e.keyCode);
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
    } else if (signingIn() && Session.equals('signinStage', 'signup')){
      if(e.keyCode === 27){ // esc
        closeSignInOverlay();
      }
    }
  });
});

window.resetXPositionMemory = function () {
  Session.set("wrap", {});
  Session.set("currentXByYId", {});
};

window.getXByYId = function(yId) {
  if(yId){
    var currentXByYId = Session.get('currentXByYId');
    if(currentXByYId){
      return currentXByYId[yId] || 0;
    }
  }
};
