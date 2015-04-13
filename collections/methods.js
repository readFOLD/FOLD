var changeFavorite;

changeFavorite = function(storyId, toFavorite) {
  var operator, storyOperation, userOperation;
  check(storyId, String);
  this.unblock();
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to favorite a story');
  }
  operator = toFavorite ? '$addToSet' : '$pull';
  storyOperation = {};
  storyOperation[operator] = {
    favorited: this.userId
  };
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

var changeHasTitle = function(storyId, index, newValue){
  var selector = {_id: storyId};
  setObject = {};
  key = 'draftStory.verticalSections.' + index + '.hasTitle'
  setObject[key] = newValue;

  return updateStory({_id: storyId, authorId: this.userId}, {
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

var updateStory = function(selector, modifier, options) {
  if (_.isEmpty(modifier)){
    return
  }
  modifier.$set = _.extend(modifier.$set || {}, {savedAt: new Date});

  return Stories.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
};

Meteor.methods({
  addContextToStory: function(storyId, contextBlock, verticalIndex){
    // TODO check that user owns story
    delete contextBlock._id
    var contextId = ContextBlocks.insert(_.extend({storyId: storyId, authorId: Meteor.user()._id}, contextBlock));

    var pushObject, pushSelectorString;
    pushSelectorString = 'draftStory.verticalSections.' + verticalIndex + '.contextBlocks';
    pushObject = {};
    pushObject[pushSelectorString] = contextId;
    var numUpdated = Stories.update({ _id: storyId}, { $addToSet: pushObject});
    if (!numUpdated){
      throw new Meteor.Error('Story not updated')
    }
    return contextId;
  },
  // TODO PREVENT FROM SAVING OTHER WAYS
  updateStoryTitle: function(storyId, title){
    // TODO DRY
    // TODO Security
    // TODO don't update story path if ever been published
    var storyPathSegment = _s.slugify(title.toLowerCase() || 'new-story')+ '-' + Stories.findOne({_id: storyId}).shortId;
    return updateStory({_id: storyId}, {$set: {'draftStory.title' : title, 'draftStory.storyPathSegment' : storyPathSegment }});
  },
  updateVerticalSectionTitle: function(storyId, index, title){
    // TODO clean title

    var setObject = { $set:{} };
    setObject['$set']['draftStory.verticalSections.' + index + '.title'] = title;

    return updateStory({_id: storyId}, setObject, {removeEmptyStrings: false})
  },
  updateVerticalSectionContent: function(storyId, index, content){

    // TODO Clean html
    var setObject = { $set:{} };
    setObject['$set']['draftStory.verticalSections.' + index + '.content'] = content;

    return updateStory({_id: storyId}, setObject, {removeEmptyStrings: false})
  },
  // TODO replace with specific methods
  saveStory: function(selector, modifier, options) {
    console.log('saveStory!');
    //update: function(userId, doc, fieldNames) {
    //  var disallowedFields;
    //  disallowedFields = ['authorId', 'storyPathSegment', 'userPathSegment', 'favorited'];
    //  if (_.intersection(fieldNames, disallowedFields).length) {
    //    return false;
    //  }
    //  return checkOwner(userId, doc);
    //}
  //  if (titleField.isSet){
  //  return _s.slugify(titleField.value.toLowerCase())+ '-' + this.docId;
  //} else {
  //}

    return updateStory(selector, modifier, options);
  },
  updateHeaderImage: function(storyId, filename) {
    return updateStory({_id: storyId, authorId: this.userId}, {
      $set: {'draftStory.headerImage': filename}
    })
  },
  addTitle: function(storyId, index) {
    return changeHasTitle.call(this, storyId, index, true);
  },
  removeTitle: function(storyId, index) {
    return changeHasTitle.call(this, storyId, index, false);
  },
  editHorizontalBlockDescription: function(horizontalId, description) {
    // TODO - Go though some UpdateContextBlock function
    return ContextBlocks.update({"_id": horizontalId, "authorId": this.userId}, {"$set": {"description": description}});
  },
  editTextSection: function(horizontalId, content) {
    // TODO - Go though some UpdateContextBlock function
    return ContextBlocks.update({"_id": horizontalId, "authorId": this.userId}, {"$set": {"content": content}});
  },
  reorderStory: function(storyId, idMap) {

    var story = Stories.findOne({_id: storyId, authorId: this.userId}, {
      fields: {
        'draftStory.verticalSections': 1
      }
    });

    if (!story || !story.draftStory){
      return new Meteor.Error('story not found for reordering: ' + storyId)
    }

    var draftStory = story.draftStory;

    var originalVerticalSections = draftStory.verticalSections;


    var newVerticalSections = _.map(idMap, function(horizontal) {
      return _.extend(
        {},
        _.findWhere(originalVerticalSections, {_id: horizontal.verticalId}),
        {
          contextBlocks: horizontal.contextBlocks
        }
      );
    });

    return updateStory({_id: storyId}, {
      $set: {
        'draftStory.verticalSections': newVerticalSections
      }
    })
  },
  insertVerticalSection: function(storyId, index, section) {
    // TODO - Once Meteor upgrades to use Mongo 2.6
    // This should use the $position operator and work directly there
    // Also, can probably get rid of the blackbox: true on verticalSections in the schema!

    section = section || {
      _id: Random.id(8),
      contextBlocks: [],
      title: "",
      content: "",
      hasTitle: false
    };

    var selector = {_id: storyId};

    var story = Stories.findOne(selector, {
      fields: {
        'draftStory.verticalSections': 1,
        'authorId': 1
      }
    });

    assertOwner(this.userId, story);


    var verticalSections = story.draftStory.verticalSections;

    verticalSections.splice(index, 0, {
      _id: Random.id(8),
      contextBlocks: [],
      title: "",
      content: "",
      hasTitle: false
    });

    return updateStory({_id: storyId}, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
    })
  },
  moveVerticalSectionUpOne: function(storyId, index) {

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

    return updateStory({ _id: storyId }, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
    })
  },
  moveVerticalSectionDownOne: function(storyId, index) {


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

    return updateStory({ _id: storyId }, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
    })
  },
  moveHorizontalContextLeftOne: function(storyId, verticalIndex, horizontalIndex) {
    if (!horizontalIndex){
      throw new Meteor.Error('Must have a positive horizontal index')
    }
    var selector = { _id: storyId };
    var story = Stories.findOne(selector, {fields:
      {
        'draftStory.verticalSections': 1,
        'authorId': 1
      }
    });

    assertOwner(this.userId, story);

    var verticalSection = story.draftStory.verticalSections[verticalIndex];

    if (!verticalSection){
      throw new Meteor.Error('Vertical index too high')
    }

    swapArrayElements(verticalSection.contextBlocks, horizontalIndex, horizontalIndex - 1);

    setObject = {};

    setObject['draftStory.verticalSections.' + verticalIndex + '.contextBlocks'] = verticalSection.contextBlocks;

    return updateStory({ _id: storyId }, {
      $set: setObject
    })
  },
  moveHorizontalContextRightOne: function(storyId, verticalIndex, horizontalIndex) {
    var selector = { _id: storyId };
    var story = Stories.findOne(selector, {fields:
      {
        'draftStory.verticalSections': 1,
        'authorId': 1
      }
    });

    assertOwner(this.userId, story);

    var verticalSection = story.draftStory.verticalSections[verticalIndex];

    if (!verticalSection){
      throw new Meteor.Error('Vertical index too high')
    }


    if ((horizontalIndex + 1) >= verticalSection.contextBlocks.length){
      throw new Meteor.Error('Horizontal index too high')
    }

    swapArrayElements(verticalSection.contextBlocks, horizontalIndex, horizontalIndex + 1);

    setObject = {};

    setObject['draftStory.verticalSections.' + verticalIndex + '.contextBlocks'] = verticalSection.contextBlocks;

    return updateStory({ _id: storyId }, {
      $set: setObject
    })
  },
  deleteVerticalSection: function(storyId, index) {

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

    if (contextBlocks){ // TODO check owner and if remixed etc..
      ContextBlocks.remove({_id: {$in: contextBlocks}})
    }

    return updateStory({ _id: storyId }, {
      $pull: {
        'draftStory.verticalSections': {_id: verticalSections[index]._id}
      }
    })
  },
  publishStory: function(storyId) {
    var story = Stories.findOne({_id: storyId, authorId: this.userId});

    if (!story){
      throw new Meteor.Error('story not found by author to publish. story: ' + storyId + '  userId: ' + this.userId)
    }

    var draftStory = story.draftStory;

    if (!draftStory){
      throw new Meteor.Error('story for publishing does not have a draft. story: ' + storyId + '  userId: ' + this.userId)
    }

    var contextBlockIds =_.chain(draftStory.verticalSections)
      .pluck('contextBlocks')
      .flatten()
      .value();

    // update contextblocks so they are ready for publish
    var numCBlocksUpdated = ContextBlocks.update({ _id: {$in: contextBlockIds}}, {
      $set: {
        'published': true,
        'everPublished': true
      },
    }, {multi: true});

    if (numCBlocksUpdated !== contextBlockIds.length){
      throw new Meteor.Error('context blocks failed to update on publish ' + storyId + '. Maybe some are missing. Number of ids: ' + contextBlockIds.length + ' Number of blocks updated: ' + numCBlocksUpdated);
    }

    var contextBlocks = ContextBlocks.find({_id: {$in: contextBlockIds}}).fetch();

    // TODO
    // Don't update story path and such unless not yet set.
    // Tags (keywords).
    // Update title from publish form
    // Update header image from publish form
    // Probably confirm that all the context cards included are by the author!
    // Maybe a list of all context cards on the story
    // Maybe a list of which cards are original and which are remixed
    // Maybe a list of all context types and amounts for better searching

    var fieldsToCopyFromDraft = [
      'verticalSections',
      'headerImage',
      'headerImageAttribution',
      'title'
    ];
    var additionalFieldsToSet = {};
    //if (story.everPublished){
    //  additionalFieldsToSet = {};
    //} else {
    //  additionalFieldsToSet = {
    //
    //  }
    //}

    var setObject = _.extend({},
      _.pick(draftStory, fieldsToCopyFromDraft), // copy all safe fields from draftStory.
      additionalFieldsToSet,
      {
        'contextBlocks': contextBlocks,
        //'draftStory.unpublishedChanges' : false,
        'storyPathSegment': _s.slugify(draftStory.title.toLowerCase()) + '-' + story.shortId, // TODO DRY and probably get from draft
        'publishedAt': Date.now(),
        'published': true,
        'everPublished': true,
        'authorUsername': Meteor.user().username,
        'version': 'earlybird'
      }
    );

    return updateStory({ _id: storyId }, {
      $set: setObject,
      $push: {'history': _.omit(story, ['draftStory', 'history'])} // history has everything except the current published story
    });
  },
  favoriteStory: function(storyId) {
    return changeFavorite.call(this, storyId, true);
  },
  unfavoriteStory: function(storyId) {
    return changeFavorite.call(this, storyId, false);
  },
  createStory: function() {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to create a story');
    }
    var user = Meteor.users.findOne({ _id : this.userId });

    var shortId = Random.id(8);

    var storyPathSegment = _s.slugify('new-story') + '-' + shortId;  // TODO DRY
    var userPathSegment= user.username;

    initialVerticalSection = {
      _id: Random.id(8),
      contextBlocks: [],
      title: "",
      content: "",
      hasTitle: false
    };

    Stories.insert({
      published: false,
      verticalSections: [initialVerticalSection],
      savedAt: new Date,
      userPathSegment: userPathSegment,
      storyPathSegment: storyPathSegment,
      authorId: this.userId,
      authorName: user.profile.name || 'Anonymous',
      authorUsername: Meteor.user().username,
      shortId: shortId,
      draftStory: {
        authorId: this.userId,
        authorName: user.profile.name || 'Anonymous',
        verticalSections: [initialVerticalSection],
        title: '',
        userPathSegment: userPathSegment,
        storyPathSegment: storyPathSegment
      }
  }, {removeEmptyStrings: false});
    return {
      userPathSegment: userPathSegment,
      storyPathSegment: storyPathSegment
    };
  }

});


