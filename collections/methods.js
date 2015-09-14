var publishAccessLevel = parseInt(Meteor.settings['public'].PUBLISH_ACCESS_LEVEL || 0);
var createAccessLevel = parseInt(Meteor.settings['public'].CREATE_ACCESS_LEVEL || 0);

if (Meteor.isClient) {
  window.publishAccessLevel = publishAccessLevel;
  window.createAccessLevel = createAccessLevel;
}

var changeFavorite;

changeFavorite = function(storyId, toFavorite) {
  var operator, storyOperation, userOperation;

  this.unblock();
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to favorite a story');
  }

  var story = Stories.findOne({
    _id: storyId,
  }, {
    fields: {
      favorited: 1
    }
  });

  operator = toFavorite ? '$addToSet' : '$pull';
  storyOperation = {};
  storyOperation[operator] = {
    favorited: this.userId
  };

  var currentlyFavorited = (_.contains(story.favorited, this.userId));

  if (toFavorite && !currentlyFavorited){
    storyOperation['$inc'] = { favoritedTotal : 1 };
  } else if (!toFavorite && currentlyFavorited){
    storyOperation['$inc'] = { favoritedTotal : -1 };
  }

  userOperation = {};
  userOperation[operator] = {
    'profile.favorites': storyId
  };
  Stories.update({
    _id: storyId
  }, storyOperation);
  return Meteor.users.update({
    _id: this.userId
  }, userOperation);
};

var changeEditorsPick = function(storyId, isPick) {

  this.unblock();
  if (!Meteor.user().admin) {
    throw new Meteor.Error('not-admin-in', 'Sorry, you must be an admin to designate an editors pick');
  }

  Stories.update({
    _id: storyId
  }, {
    $set: {
      editorsPick: isPick,
      editorsPickAt: new Date
    }
  });
};


var checkOwner = function(userId, doc) {
  return userId && userId === doc.authorId;
};

var assertOwner = function(userId, doc) {
  if(!checkOwner(userId, doc)){
    throw new Meteor.Error('Only the author may edit in this way')
  }
};

// only the curator may update the stream
var updateStream = function(selector, modifier, options) {
  if (_.isEmpty(modifier)){
    return
  }
  modifier.$set = _.extend(modifier.$set || {}, {savedAt: new Date});
  selector.curatorId = this.userId; // this.userId must be the user (use via .call or .apply)

  return Deepstreams.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
};


Meteor.methods({
  addContextToStream: function(streamShortId, contextBlock){ // TODO find a way to pick id safely to avoid potential collisions. Context block id uniqueness is currently not enforced.
    check(streamShortId, String);
    check(contextBlock, Object);

    var pushObject, pushSelectorString;
    pushSelectorString = 'contextBlocks';
    pushObject = {};
    pushObject[pushSelectorString] = _.extend({}, contextBlock, {
      authorId: Meteor.user()._id,
      addedAt: new Date,
      savedAt: new Date
    });


    var modifierObject = {
      '$addToSet' : pushObject
    };

    deepstream = Deepstreams.findOne({shortId: streamShortId}, {fields:{'creationStep': 1}});

    modifierObject['$set'] = {};

    // advance creation if at this creation step
    if (deepstream.creationStep === 'add_cards'){
      _.extend(modifierObject['$set'], {
        creationStep : nextCreationStepAfter('add_cards')
      });
    }

    var numUpdated = updateStream.call(this, { shortId: streamShortId }, modifierObject); // TODO, make it so can't easily add the same one twice (savedAt and addedAt are different)

    if (numUpdated){


      if (Meteor.isClient){
        Session.set("searchingMedia", false); // leave search mode
        var typeSpecificContextBlock = newTypeSpecificContextBlock(contextBlock);
        if(typeSpecificContextBlock.soloModeLocation === 'sidebar'){
          setCurrentContext(typeSpecificContextBlock); // if single context is in sidebar, show that instead of default list mode
        }
      }
    } else {
      throw new Meteor.Error('Stream not updated')
    }
    return contextBlock._id;
  },
  setActiveStream: function(streamShortId, streamId){
    check(streamShortId, String);
    check(streamId, String);
    return updateStream.call(this,{shortId: streamShortId}, {$set: {activeStreamId: streamId}});
  },
  addStreamToStream: function(streamShortId, stream){
    check(streamShortId, String);
    if (Meteor.isServer){
      check(stream, Object);
    } else {
      check(stream, Match.Any); // TODO this should be Object or Stream but that doesn't seem to work out clientside...
    }


    var pushObject, pushSelectorString, success;
    pushSelectorString = 'streams';
    pushObject = {};
    pushObject[pushSelectorString] = _.extend({}, stream, {
      authorId: Meteor.user()._id,
      addedAt: new Date
    });

    var modifierObject = {
      '$addToSet' : pushObject
    };

    deepstream = Deepstreams.findOne({shortId: streamShortId}, {fields:{'activeStreamId' : 1, 'creationStep': 1, 'streams': 1}});

    var numberOfStreamsBeforeAdd = deepstream.streams.length;

    modifierObject['$set'] = {};

    // make stream active if none is active
    if (!deepstream.activeStreamId){
      _.extend(modifierObject['$set'], {
        activeStreamId : stream._id
      });
    }

    // advance creation if at this creation step
    if (deepstream.creationStep === 'find_stream'){
      _.extend(modifierObject['$set'], {
        creationStep : nextCreationStepAfter('find_stream')
      });
    }

    var duplicateStream = _.any(deepstream.streams, function(existingStream) {
      return stream.reference.id === existingStream.reference.id;
    });

    if(duplicateStream){
      success = true; // it's already done!
    } else {
      success = updateStream.call(this, { shortId: streamShortId }, modifierObject); // TODO, make it so can't easily add the same one twice (addedAt is different)
    }

    if (success) {

      // TODO something
      if (Meteor.isClient){
        if(numberOfStreamsBeforeAdd === 1 && !duplicateStream) { // this is the second stream to be added
          window.notifySuccess("You just added a second stream. Now you can switch between streams and all your viewers will see that change!");
        }

        if (duplicateStream){
          window.notifyInfo("This stream has already been added.")
        }

        // briefly add the justAdded class so that user knows it was added to the bottom
        setTimeout(function(){ // wait till in DOM. TO-DO this is kinda hacky
          $('.stream[data-stream-reference-id="' + stream.reference.id + '"]').addClass('justAdded');
          setTimeout(function(){
            $('.stream[data-stream-reference-id="' + stream.reference.id + '"]').removeClass('justAdded');
          }, 1300);
        }, 0);
      }
    } else {
      throw new Meteor.Error('Stream not updated');
    }
    return stream._id;
  },

  removeContextFromStream: function(shortId, contextId) {
    check(shortId, String);
    check(contextId, String);
    var numUpdated = updateStream.call(this, {
      shortId: shortId
    }, {
      $pull: {
        contextBlocks: {
          _id: contextId
        }
      }
    });

    if (!numUpdated){
      throw new Meteor.Error('Stream not updated')
    }

    return numUpdated;
  },
  goToFindStreamStep: function(shortId){
    return updateStream.call(this, { shortId: shortId}, {$set: { creationStep: 'find_stream'}});
  },
  goToAddCardsStep: function(shortId){
    return updateStream.call(this, { shortId: shortId}, {$set: { creationStep: 'add_cards'}});
  },
  goToPublishStreamStep: function(shortId){
    return updateStream.call(this, { shortId: shortId}, {$set: { creationStep: 'go_on_air'}});
  },
  skipFindStreamStep: function(shortId){
    check(shortId, String);
    return updateStream.call(this, {shortId: shortId}, {$set: {creationStep: nextCreationStepAfter('find_stream') }});
  },
  skipAddCardsStep: function(shortId){
    check(shortId, String);
    return updateStream.call(this, {shortId: shortId}, {$set: {creationStep: nextCreationStepAfter('add_cards') }});
  },
  goBackFromTitleDescriptionStep: function(shortId){
    check(shortId, String);
    return updateStream.call(this, {shortId: shortId}, {$set: {creationStep: creationStepBefore('title_description') }});
  },
  proceedFromGoOnAirStep: function(shortId){
    check(shortId, String);
    return updateStream.call(this, {shortId: shortId}, {$set: {creationStep: nextCreationStepAfter('go_on_air') }});
  },
  publishStream: function(shortId, title, description){
    check(shortId, String);

    // TODO add onAir at... OR change it all to published
    var setObject = {creationStep: null, onAir: true };

    if(title){ // if title, description included
      check(title, String);
      check(description, String);
      var streamPathSegment = _s.slugify(title.toLowerCase() || 'deep-stream')+ '-' + shortId;
      setObject.title = title;
      setObject.description = description;
      setObject.streamPathSegment = streamPathSegment;
    }

    return updateStream.call(this, {shortId: shortId}, {$set: setObject});
  },
  unpublishStream: function(shortId){
    check(shortId, String);
    // TODO maybe change it all to published
    return updateStream.call(this, {shortId: shortId}, {$set: {onAir: false }});
  },
  updateStreamTitle: function(shortId, title){
    check(shortId, String);
    check(title, String);
    // TODO DRY
    var streamPathSegment = _s.slugify(title.toLowerCase() || 'deep-stream') + '-' + shortId;
    return updateStream.call(this, {shortId: shortId}, {$set: {'title' : title, 'streamPathSegment' : streamPathSegment }});
  },
  updateStreamDescription: function(shortId, description){
    check(shortId, String);
    check(description, String);
    return updateStream.call(this, {shortId: shortId}, {$set: {'description' : description }});
  },
  editHorizontalBlockDescription: function(shortId, contextId, description) {
    check(shortId, String);
    check(contextId, String);
    check(description, String);
    return updateStream.call(this, {"shortId": shortId, "contextBlocks._id": contextId }, {"$set": {"contextBlocks.$.description": description}});
  },
  editTextSection: function(shortId, contextId, content) {
    check(shortId, String);
    check(contextId, String);
    check(content, String);
    return updateStream.call(this, {"shortId": shortId, "contextBlocks._id": contextId }, {"$set": {"contextBlocks.$.content": content}});
  },
  reorderContext: function(shortId, ordering){
    check(shortId, String);
    check(ordering, [String]);

    var that = this;
    var numberUpdated = 0;
    _.each(ordering, function(contextId, i){
      numberUpdated += updateStream.call(that, {"shortId": shortId, "contextBlocks._id": contextId }, {"$set": {"contextBlocks.$.rank": i + 1}});
    });

    return numberUpdated;
  },
  directorModeOff: function(shortId){
    check(shortId, String);
    this.unblock();
    return updateStream.call(this, {
      shortId: shortId
    }, {
      $set: {
        directorMode: false
      }
    });
  },
  directorModeOn: function(shortId){
    check(shortId, String);
    this.unblock();
    return updateStream.call(this, {
      shortId: shortId
    }, {
      $set: {
        directorMode: true
      }
    });
  },
  favoriteStory: function(storyId) {
    check(storyId, String);
    return changeFavorite.call(this, storyId, true);
  },
  unfavoriteStory: function(storyId) {
    check(storyId, String);
    return changeFavorite.call(this, storyId, false);
  },
  designateEditorsPick: function(storyId) {
    check(storyId, String);
    return changeEditorsPick.call(this, storyId, true);
  },
  stripEditorsPick: function(storyId) {
    check(storyId, String);
    return changeEditorsPick.call(this, storyId, false);
  },
  createDeepstream: function(shortId, initialStream) { // TO-DO find a way to generate these ids in a trusted way server without compromising UI speed
    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to create a story');
    }
    var accessPriority = user.accessPriority;
    if(!accessPriority || accessPriority > createAccessLevel){
      throw new Meteor.Error('user does not have create access. userId: ' + this.userId);
    }

    var streamPathSegment = _s.slugify('new-deep-stream') + '-' + shortId;  // TODO DRY
    var userPathSegment= user.displayUsername;

    Deepstreams.insert({
      onAir: false,
      createdAt: new Date,
      savedAt: new Date,
      userPathSegment: userPathSegment,
      streamPathSegment: streamPathSegment,
      curatorId: this.userId,
      curatorName: user.profile.name || user.username,
      curatorUsername: user.username,
      curatorDisplayUsername: user.displayUsername,
      shortId: shortId,
      creationStep: CREATION_STEPS[0]
    });

    if (Meteor.isClient){
      Session.set('showPreviewOverlayForStreamId', null);
      FlowRouter.go('curate', {userPathSegment: userPathSegment, streamPathSegment: streamPathSegment});
    }

    if(initialStream){
      Meteor.call('addStreamToStream', shortId, initialStream);
    }

    return {
      userPathSegment: userPathSegment,
      streamPathSegment: streamPathSegment
    };
  }

});
