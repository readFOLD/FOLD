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

var changeHasTitle = function(storyId, index, newValue){

  var selector = {_id: storyId};
  setObject = {};
  key = 'draftStory.verticalSections.' + index + '.hasTitle'
  setObject[key] = newValue;

  return updateStory.call(this, {_id: storyId }, {
    $set: setObject
  })
}


var checkOwner = function(userId, doc) {
  return userId && userId === doc.authorId;
};

var assertOwner = function(userId, doc) {
  if(!checkOwner(userId, doc)){
    throw new Meteor.Error('Only the author may edit in this way')
  }
};

var swapArrayElements = function(arr, x, y){
  var b = arr[y];
  arr[y] = arr[x];
  arr[x] = b;
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

// only the author may update the story
var updateContextBlocks = function(selector, modifier, options) {
  if (_.isEmpty(modifier)){
    return
  }
  modifier.$set = _.extend(modifier.$set || {}, {savedAt: new Date});
  selector.authorId = this.userId; // this.userId must be the user (use via .call or .apply)

  return ContextBlocks.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
};

Meteor.methods({
  addContextToStream: function(streamShortId, contextBlock){ // TODO find a way to pick id safely to avoid potential collisions. Context block id uniqueness is currently not enforced.
    check(streamShortId, String);
    check(contextBlock, Object);

    //if (!Stories.find({_id: storyId, authorId: this.userId},{ fields:{ _id: 1 }}).count()){
    //  throw new Meteor.Error("User doesn't own story")
    //}

    // TO-DO Remix. When add remix, will need another method or modify this one
    //var contextId = ContextBlocks.insert(_.extend({}, contextBlock, {
    //  storyId: storyId,
    //  storyShortId: storyShortId,
    //  authorId: Meteor.user()._id,
    //  savedAt: new Date
    //}));

    var pushObject, pushSelectorString;
    pushSelectorString = 'contextBlocks';
    pushObject = {};
    pushObject[pushSelectorString] = _.extend({}, contextBlock, {
      //storyId: storyId,
      //storyShortId: storyShortId,
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

      // TODO something
      if (Meteor.isClient){
        Session.set("searchingMedia", false);
        setCurrentContextIdOfType(contextBlock.type, contextBlock._id);
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
    check(stream, Object);

    //if (!Stories.find({_id: storyId, authorId: this.userId},{ fields:{ _id: 1 }}).count()){
    //  throw new Meteor.Error("User doesn't own story")
    //}

    //delete contextBlock._id;

    var pushObject, pushSelectorString, success;
    pushSelectorString = 'streams';
    pushObject = {};
    pushObject[pushSelectorString] = _.extend({}, stream, {
      //storyId: storyId,
      //storyShortId: storyShortId,
      authorId: Meteor.user()._id,
      addedAt: new Date
    });

    var modifierObject = {
      '$addToSet' : pushObject
    };

    deepstream = Deepstreams.findOne({shortId: streamShortId}, {fields:{'activeStreamId' : 1, 'creationStep': 1, 'streams': 1}});

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
      return stream.reference.id === existingStream.reference.id
    });

    if(duplicateStream){
      success = true; // it's already done!
    } else {
      success = updateStream.call(this, { shortId: streamShortId }, modifierObject); // TODO, make it so can't easily add the same one twice (addedAt is different)
    }

    if (success){

      // TODO something
      if (Meteor.isClient){
        if(deepstream.streams.length === 1){ // this is the second stream to be added
          window.notifySuccess("You just added a second stream. Now you can switch between streams and all your viewers will see that change!")
        }
        //window.hideNewHorizontalUI();

        //var story = Stories.findOne(storyId, fields);
        //goToX(_.indexOf(story.draftStory.verticalSections[verticalIndex].contextBlocks, contextId.toString()))
      }
    } else {
      throw new Meteor.Error('Stream not updated')
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

    if (Meteor.isClient && numUpdated){
      setCurrentContextIdOfTypeToMostRecent();
      //Session.set("addingContext", null);
      //Session.set("editingContext", null);
      //var currentX = Session.get('currentX');
      //goToX(currentX ? currentX - 1 : 0);
    }

    return numUpdated;
  },
  setStreamTitleDescription: function(shortId, title, description){
    check(shortId, String);
    check(title, String);
    check(description, String);
    // TODO DRY
    var streamPathSegment = _s.slugify(title.toLowerCase() || 'deep-stream')+ '-' + shortId;
    return updateStream.call(this, {shortId: shortId}, {$set: {'title' : title, 'description' : description, 'streamPathSegment' : streamPathSegment, creationStep: nextCreationStepAfter('title_description') }});
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
  publishStream: function(shortId){
    check(shortId, String);
    // TODO add onAir at... OR change it all to published
    return updateStream.call(this, {shortId: shortId}, {$set: {creationStep: null, onAir: true }});
  },
  unpublishStream: function(shortId){
    check(shortId, String);
    // TODO maybe change it all to published
    return updateStream.call(this, {shortId: shortId}, {$set: {onAir: false }});
  },
  updateStreamTitle: function(shortId, title){
    console.log(arguments)

    check(shortId, String);
    check(title, String);
    // TODO DRY
    var streamPathSegment = _s.slugify(title.toLowerCase() || 'deep-stream') + '-' + shortId;
    return updateStream.call(this, {shortId: shortId}, {$set: {'title' : title, 'streamPathSegment' : streamPathSegment }});
  },
  updateHeaderImage: function(storyId, filePublicId, fileFormat) {
    check(storyId, String);
    check(filePublicId, String);
    check(fileFormat, String);
    return updateStory.call(this, {_id: storyId}, {
      $set: {
        'draftStory.headerImage': filePublicId,
        'draftStory.headerImageFormat': fileFormat
      }
    })
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
  insertVerticalSection: function(storyId, index, verticalSectionId) { // TO-DO find a good way to generate this id in a trusted way
    check(storyId, String);
    check(index, Number);
    var newSection = {
      _id: verticalSectionId,
      contextBlocks: [],
      title: "",
      content: "",
      hasTitle: false
    };

    var numUpdated = updateStory.call(this, {_id: storyId }, {
      $push: {
        'draftStory.verticalSections': {
          $position: index,
          $each: [newSection]
        }
      }
    });

    if (Meteor.isClient && numUpdated){
      goToY(index);
    }

    return numUpdated;
  },
  moveVerticalSectionUpOne: function(storyId, index) {
    check(storyId, String);
    check(index, Number);
    if (!index){
      throw new Meteor.Error('Must have a positive index')
    }

    var selector = { _id: storyId };
    var story = Stories.findOne(selector, {fields:
      {
        'draftStory.verticalSections': 1,
        'authorId': 1
      }
    });

    assertOwner(this.userId, story);

    var verticalSections = story.draftStory.verticalSections;

    swapArrayElements(verticalSections, index, index - 1);

    var numUpdated = updateStory.call(this, { _id: storyId }, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
    });

    if (Meteor.isClient && numUpdated) {
      goToY(index - 1);
    }

    return numUpdated
  },
  moveVerticalSectionDownOne: function(storyId, index) {
    check(storyId, String);
    check(index, Number);

    var selector = { _id: storyId };
    var story = Stories.findOne(selector, {fields:
      {
        'draftStory.verticalSections': 1,
        'authorId': 1
      }
    });

    assertOwner(this.userId, story);

    var verticalSections = story.draftStory.verticalSections;


    if ((index + 1) >= verticalSections.length){
      throw new Meteor.Error('Index too high')
    }

    swapArrayElements(verticalSections, index, index + 1);

    var numUpdated = updateStory.call(this, { _id: storyId }, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
    })

    if (Meteor.isClient && numUpdated) {
      goToY(index + 1);
    }

    return numUpdated
  },
  deleteVerticalSection: function(storyId, index) {
    check(storyId, String);
    check(index, Number);

    var selector = { _id: storyId };
    var story = Stories.findOne(selector, {fields:
      {
        'draftStory.verticalSections': 1,
        'authorId': 1
      }
    });

    assertOwner(this.userId, story);

    var verticalSections = story.draftStory.verticalSections;

    if (index < 0 || index >= story.draftStory.verticalSections){
      throw new Meteor.Error('Index too high')
    }

    var contextBlocks = verticalSections[index].contextBlocks;

    if (contextBlocks){ // TO-DO Remix. Check if remixed etc..
      ContextBlocks.remove({_id: {$in: contextBlocks}, authorId: this.userId})
    }

    return updateStory.call(this, { _id: storyId }, {
      $pull: {
        'draftStory.verticalSections': {_id: verticalSections[index]._id}
      }
    })
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
  createDeepstream: function(shortId) { // TO-DO find a way to generate these in a trusted way server without compromising UI speed
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
      FlowRouter.go('curate', {userPathSegment: userPathSegment, streamPathSegment: streamPathSegment});
    }

    return {
      userPathSegment: userPathSegment,
      streamPathSegment: streamPathSegment
    };
  }

});


