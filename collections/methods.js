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




Meteor.methods({
  addContextToStream: addContextToStream,
  setActiveStream (streamShortId, streamId){
    check(streamShortId, String);
    check(streamId, String);
    return updateDeepstream.call(this,{shortId: streamShortId}, {$set: {activeStreamId: streamId}});
  },
  addStreamToStream (streamShortId, stream){
    check(streamShortId, String);
    if (Meteor.isServer){
      check(stream, Object);
    } else {
      check(stream, Match.Any); // this should be Object or Stream but that doesn't seem to work out clientside...
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
      success = updateDeepstream.call(this, { shortId: streamShortId }, modifierObject);
    }

    if (success) {

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
  removeStreamFromStream (shortId, streamId) {
    check(shortId, String);
    check(streamId, String);

    var deepstream = Deepstreams.findOne({shortId: shortId}, {fields: { 'streams':1, activeStreamId: 1 }, transform: null});

    if (!deepstream){
      throw new Meteor.Error('Deepstream not found')
    }

    var streamToDelete = _.extend(_.findWhere(deepstream.streams, {_id: streamId}), {deletedAt: new Date});


    var modifier = {
      $pull: {
        streams: {
          _id: streamId
        }
      }, $push: {
        'deletedContent.streams': streamToDelete
      }
    };

    if (streamId === deepstream.activeStreamId){ // if removing active stream
      var newActiveStream = _.chain(deepstream.streams)
        .reject(function(stream){
          return stream._id === streamId;
        })
        .sortBy('addedAt')
        .sortBy('live')
        .last()
        .value();
      modifier['$set'] = {
        activeStreamId: newActiveStream ? newActiveStream._id : null // set to another recent stream, preferably live
      }
    }

    var numUpdated = updateDeepstream.call(this, {
      shortId: shortId
    }, modifier);

    if (!numUpdated){
      throw new Meteor.Error('Stream not updated')
    }

    return numUpdated;
  },
  removeContextFromStream (shortId, contextId) {
    check(shortId, String);
    check(contextId, String);

    var deepstream = Deepstreams.findOne({shortId: shortId}, {fields: { 'contextBlocks':1, 'curatorIds': 1 }, transform: null});

    var deletedAt = new Date;

    if (!deepstream){
      throw new Meteor.Error('Deepstream not found')
    }

    if(!_.contains(deepstream.curatorIds, this.userId)){
      throw new Meteor.Error('User not authorized to remove context from this stream');
    }


    var contextBlockUpdated = updateContextBlock.call(this, {
      streamShortId: shortId,
      _id: contextId
    }, {
      $set: {
        deleted: true,
        deletedAt: deletedAt
      }
    });

    if (!contextBlockUpdated ){
      throw new Meteor.Error('ContextBlock not updated')
    }

    var internalContextToDelete = _.extend(_.findWhere(deepstream.contextBlocks, {_id: contextId}), {deletedAt: deletedAt});

    var deepstreamUpdated = updateDeepstream.call(this, {
      shortId: shortId
    }, {
      $pull: {
        contextBlocks: {
          _id: contextId
        }
      }, $push: {
        'deletedContent.contextBlocks': internalContextToDelete
      }
    });

    if (!deepstreamUpdated){
      throw new Meteor.Error('Deepstream not updated')
    }

    return true;
  },
  goToFindStreamStep (shortId){
    return updateDeepstream.call(this, { shortId: shortId}, {$set: { creationStep: 'find_stream'}});
  },
  goToAddCardsStep (shortId){
    return updateDeepstream.call(this, { shortId: shortId}, {$set: { creationStep: 'add_cards'}});
  },
  goToPublishStreamStep (shortId){
    return updateDeepstream.call(this, { shortId: shortId}, {$set: { creationStep: 'go_on_air'}});
  },
  skipFindStreamStep (shortId){
    check(shortId, String);
    return updateDeepstream.call(this, {shortId: shortId}, {$set: {creationStep: nextCreationStepAfter('find_stream') }});
  },
  skipAddCardsStep (shortId){
    check(shortId, String);
    return updateDeepstream.call(this, {shortId: shortId}, {$set: {creationStep: nextCreationStepAfter('add_cards') }});
  },
  goBackFromTitleDescriptionStep (shortId){
    check(shortId, String);
    return updateDeepstream.call(this, {shortId: shortId}, {$set: {creationStep: creationStepBefore('title_description') }});
  },
  proceedFromGoOnAirStep (shortId){
    check(shortId, String);
    return updateDeepstream.call(this, {shortId: shortId}, {$set: {creationStep: nextCreationStepAfter('go_on_air') }});
  },
  publishStream (shortId, title, description){
    check(shortId, String);

    var deepstream = Deepstreams.findOne({shortId: shortId}, {fields:{"streams.length": 1, firstOnAirAt: 1}});

    if(!deepstream.streams.length){
      throw new Meteor.Error('Deepstreams must contain at least one stream before publishing')
    }

    var setObject = {creationStep: null, onAir: true, onAirSince: new Date };

    if(!deepstream.firstOnAirAt){
      setObject.firstOnAirAt = new Date;
    }

    if(title){ // if title, description included
      check(title, String);
      check(description, String);
      var streamPathSegment = generateStreamPathSegment(shortId, title);
      setObject.title = title;
      setObject.description = description;
      setObject.streamPathSegment = streamPathSegment;
    }

    return updateDeepstream.call(this, {shortId: shortId}, {$set: setObject});
  },
  unpublishStream : unpublishDeepstream,
  updateStreamTitle (shortId, title){
    check(shortId, String);
    check(title, String);
    var streamPathSegment = generateStreamPathSegment(shortId, title);
    return updateDeepstream.call(this, {shortId: shortId}, {$set: {'title' : title, 'streamPathSegment' : streamPathSegment }});
  },
  updateStreamDescription (shortId, description){
    check(shortId, String);
    check(description, String);
    return updateDeepstream.call(this, {shortId: shortId}, {$set: {'description' : description }});
  },
  editContextBlockAnnotation (streamShortId, contextId, annotation) {
    check(streamShortId, String);
    check(contextId, String);
    check(annotation, String);
    var deepstream = Deepstreams.findOne({shortId: streamShortId}, {fields: {'curatorIds': 1}});

    if(!_.contains(deepstream.curatorIds, this.userId)){
      throw new Meteor.Error('User not authorized to edit context in this deepstream');
    }

    return updateContextBlock.call(this, {"streamShortId": streamShortId, "_id": contextId }, {"$set": {"annotation": annotation}});
  },
  editTextSection (streamShortId, contextId, content) {
    check(streamShortId, String);
    check(contextId, String);
    check(content, String);
    var deepstream = Deepstreams.findOne({shortId: streamShortId}, {fields: {'curatorIds': 1}});

    if(!_.contains(deepstream.curatorIds, this.userId)){
      throw new Meteor.Error('User not authorized to edit context in this deepstream');
    }

    return updateContextBlock.call(this, {"streamShortId": streamShortId, "_id": contextId }, {"$set": {"content": content}});
  },
  reorderContext (shortId, ordering){
    check(shortId, String);
    check(ordering, [String]);

    // can't use Mongo position operator because also searching curatorIds array in query
    deepstream = Deepstreams.findOne({shortId: shortId}, {fields:{'contextBlocks._id' : 1}});

    var setObject = _.chain(deepstream.contextBlocks)
      .map((cBlock, i) => {
        return ['contextBlocks.' + i + '.rank', _.indexOf(ordering, cBlock._id) + 1];
      })
      .object()
      .value();

    return updateDeepstream.call(this, {"shortId": shortId}, {"$set": setObject});
  },
  directorModeOff (shortId){
    check(shortId, String);
    this.unblock();
    return updateDeepstream.call(this, {
      shortId: shortId
    }, {
      $set: {
        directorMode: false
      }
    });
  },
  directorModeOn (shortId){
    check(shortId, String);
    this.unblock();
    return updateDeepstream.call(this, {
      shortId: shortId
    }, {
      $set: {
        directorMode: true
      }
    });
  },
  startCuratorWebcam (shortId, stream){
    check(shortId, String);
    check(stream, Object);

    _.extend(stream, {type: 'stream'});

    if(Meteor.isClient){
      Session.set('mediaDataType', null);
    }

    // TODO save info on the user as a default

    return updateDeepstream.call(this, {
      shortId: shortId
    }, {
      $set: {
        curatorWebcamStream: stream,
        curatorWebcamActive: true
      }
    });
  },
  stopCuratorWebcam (shortId){
    check(shortId, String);

    return updateDeepstream.call(this, {
      shortId: shortId
    }, {
      $set: {
        curatorWebcamActive: false
      }
    });
  },
  favoriteStory (storyId) {
    check(storyId, String);
    return changeFavorite.call(this, storyId, true);
  },
  unfavoriteStory (storyId) {
    check(storyId, String);
    return changeFavorite.call(this, storyId, false);
  },
  designateEditorsPick (storyId) {
    check(storyId, String);
    return changeEditorsPick.call(this, storyId, true);
  },
  stripEditorsPick (storyId) {
    check(storyId, String);
    return changeEditorsPick.call(this, storyId, false);
  },
  deleteDeepstream: function(shortId){
    check(shortId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to delete a deepstream');
    }

    var stream = Deepstreams.findOne({shortId: shortId, curatorIds: this.userId});

    if (!stream) {
      throw new Meteor.Error('deepstream not found by curator to delete. stream short id: ' + shortId + '  userId: ' + this.userId);
    }

    if (stream.onAir){
      var unpublishSuccessful = unpublishDeepstream.call(this, shortId);
      if (!unpublishSuccessful) {
        throw new Meteor.Error('unpublish failed ' + shortId + '  userId: ' + this.userId);
      }
    }

    return updateDeepstream.call(this, { shortId: shortId }, {
      $set: {
        onAir: false,
        deleted: true,
        deletedAt: new Date
      }
    });
  },
  createDeepstream (shortId, initialStream) { // TO-DO find a way to generate these ids in a trusted way server without compromising UI speed
    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to create a story');
    }
    var accessPriority = user.accessPriority;
    if(!accessPriority || accessPriority > createAccessLevel){
      throw new Meteor.Error('user does not have create access. userId: ' + this.userId);
    }

    var streamPathSegment = generateStreamPathSegment(shortId);
    var userPathSegment= user.username;

    Deepstreams.insert({
      savedAt: new Date,
      userPathSegment: userPathSegment,
      streamPathSegment: streamPathSegment,
      mainCuratorId: this.userId,
      curatorIds: [this.userId],
      curatorName: user.profile.name || user.username,
      curatorUsername: user.username,
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
