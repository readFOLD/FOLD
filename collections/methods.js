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


  if (!story) {
    throw new Meteor.Error('story-not-found', "Sorry, we couldn't find that story");
  }


  operator = toFavorite ? '$addToSet' : '$pull';
  storyOperation = {};
  storyOperation[operator] = {
    favorited: this.userId
  };

  var currentlyFavorited = (_.contains(story.favorited, this.userId));

  story.favorited = story.favorited || [];

  if (toFavorite && !currentlyFavorited){
    storyOperation['$set'] = { favoritedTotal : story.favorited.length + 1 };
  } else if (!toFavorite && currentlyFavorited){
    storyOperation['$set'] = { favoritedTotal : story.favorited.length - 1 };
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

changeFollow = function(userId, toFollow) {
  var operator, recipientOperation, actorOperation;

  this.unblock();
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to follow a user');
  }

  if (this.userId === userId) {
    throw new Meteor.Error('cant-follow-self', "Sorry, you can't follow yourself");
  }

  var recipient = Meteor.users.findOne({
    _id: userId,
  }, {
    fields: {
      followers: 1
    }
  });

  if (!recipient) {
    throw new Meteor.Error('user-not-found', "Sorry, we couldn't find that user");
  }

  var actor = Meteor.users.findOne({
    _id: this.userId,
  }, {
    fields: {
      'profile.following': 1
    }
  });



  operator = toFollow ? '$addToSet' : '$pull';
  recipientOperation = {};
  recipientOperation[operator] = {
    followers: this.userId
  };

  var currentlyFollowed = (_.contains(recipient.followers, this.userId));

  recipient.followers = recipient.followers || [];

  if (toFollow && !currentlyFollowed){
    recipientOperation['$set'] = { followersTotal : recipient.followers.length + 1 };
  } else if (!toFollow && currentlyFollowed){
    recipientOperation['$set'] = { followersTotal : recipient.followers.length - 1 };
  }


  var currentlyFollowing = (_.contains(actor.profile.following, userId));

  actor.profile.following = actor.profile.following || [];


  if(Meteor.isClient){
    if(toFollow && actor.profile.following.length === 0){
      notifySuccess("Yay your first follow!")
    }
  }

  actorOperation = {};
  actorOperation[operator] = {
    'profile.following': userId
  };

  if (toFollow && !currentlyFollowing){
    actorOperation['$set'] = { followingTotal : actor.profile.following.length + 1 };
  } else if (!toFollow && currentlyFollowing){
    actorOperation['$set'] = { followingTotal : actor.profile.following.length - 1 };
  }


  Meteor.users.update({
    _id: userId
  }, recipientOperation);
  return Meteor.users.update({
    _id: this.userId
  }, actorOperation);
};

var changeEditorsPick = function(storyId, isPick) {

  this.unblock();
  if (!Meteor.user().admin) {
    throw new Meteor.Error('not-admin', 'Sorry, you must be an admin to designate an editors pick');
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

// only the author may update the story
var updateStory = function(selector, modifier, options) {
  if (_.isEmpty(modifier)){
    return
  }
  modifier.$set = _.extend(modifier.$set || {}, {savedAt: new Date});
  selector.authorId = this.userId; // this.userId must be the user (use via .call or .apply)

  return Stories.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
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

var unpublishStory = function(storyId) {
  check(storyId, String);
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to unpublish a story');
  }

  var story = Stories.findOne({_id: storyId, authorId: this.userId});

  if (!story) {
    throw new Meteor.Error('story not found by author to unpublish. story: ' + storyId + '  userId: ' + this.userId);
  }

  var contextBlockIds = story.contextBlockIds;

  // update contextblocks so they are ready for unpublish
  if (Meteor.isServer){ // context blocks probably aren't loaded on client
    // TODO REMIX. Might need to do something different if remixed.
    var numCBlocksUpdated = updateContextBlocks.call(this, {_id: {$in: contextBlockIds}}, {
      $set: {
        'published': false
      }
    }, {multi: true});

    if (numCBlocksUpdated !== contextBlockIds.length) {
      throw new Meteor.Error('context blocks failed to update on unpublish ' + storyId + '. Maybe some are missing. Or are not by author. Number of ids: ' + contextBlockIds.length + ' Number of blocks updated: ' + numCBlocksUpdated);
    }
  }

  return updateStory.call(this, {_id: storyId}, {
    $set: {published: false}
  });
};

Meteor.methods({
  addContextToStory: function(storyId, storyShortId, contextBlock, verticalIndex){
    check(storyId, String);
    check(storyShortId, String);
    check(contextBlock, Object);
    check(verticalIndex, Number);
    if (!Stories.find({_id: storyId, authorId: this.userId},{ fields:{ _id: 1 }}).count()){
      throw new Meteor.Error("User doesn't own story")
    }
    delete contextBlock._id;

    // TO-DO Remix. When add remix, will need another method or modify this one
    var contextId = ContextBlocks.insert(_.extend({}, contextBlock, {
      storyId: storyId,
      storyShortId: storyShortId,
      authorId: Meteor.userId(),
      savedAt: new Date
    }));

    var pushObject, pushSelectorString;
    pushSelectorString = 'draftStory.verticalSections.' + verticalIndex + '.contextBlocks';
    pushObject = {};
    pushObject[pushSelectorString] = contextId;
    var numUpdated = updateStory.call(this, { _id: storyId }, { $addToSet: pushObject});

    if (numUpdated){
      if (Meteor.isClient){
        window.hideNewHorizontalUI();
        var placeholderAnchorElement = window.findPlaceholderLink(verticalIndex);
        if (placeholderAnchorElement) {
          placeholderAnchorElement.attr('data-context-id', contextId); // set data attributes correctly
          placeholderAnchorElement.attr('data-context-type', contextBlock.type);
          placeholderAnchorElement.attr('data-context-source', contextBlock.source);

          placeholderAnchorElement.removeClass('placeholder'); // add active class because we go to this context and if we're already there it won't get the class
        }

        var fields = {};
        fields['draftStory.verticalSections.' + verticalIndex + '.contextBlocks'] = 1;
        var story = Stories.findOne(storyId, fields);

        goToX(_.indexOf(story.draftStory.verticalSections[verticalIndex].contextBlocks, contextId.toString()))
      }
    } else {
      throw new Meteor.Error('Story not updated')
    }
    return contextId;
  },
  removeContextFromStory: function(storyId, contextId, verticalSectionIndex) {
    check(storyId, String);
    check(contextId, String);
    check(verticalSectionIndex, Number);
    var pushSelectorString = 'draftStory.verticalSections.' + verticalSectionIndex + '.contextBlocks';
    var pullObject = {};
    pullObject[pushSelectorString] = contextId;
    var numUpdated = updateStory.call(this, {
      _id: storyId
    }, {
      $pull: pullObject
    });
    if (!numUpdated){
      throw new Meteor.Error('Story not updated')
    }
    // TO-DO Remix. Don't actually delete if has ever been remixed (or maybe if ever published)
    var numRemoved = ContextBlocks.remove({_id: contextId, authorId: this.userId});

    if (Meteor.isClient && numRemoved){
      Session.set("addingContext", null);
      Session.set("editingContext", null);
      var currentX = Session.get('currentX');
      goToX(currentX ? currentX - 1 : 0);
    }

    return numRemoved
  },
  updateStoryTitle: function(storyId, title){
    check(storyId, String);
    check(title, String);
    // TODO DRY
    var storyPathSegment = _s.slugify(title.toLowerCase() || 'new-story')+ '-' + Stories.findOne({_id: storyId}).shortId;
    return updateStory.call(this, {_id: storyId}, {$set: {'draftStory.title' : title, 'draftStory.storyPathSegment' : storyPathSegment }});
  },
  updateVerticalSectionTitle: function(storyId, index, title){ // TO-DO switch to using id instead of index
    check(storyId, String);
    check(index, Number);
    check(title, String);
    var setObject = { $set:{} };
    setObject['$set']['draftStory.verticalSections.' + index + '.title'] = title;

    return updateStory.call(this, {_id: storyId}, setObject, {removeEmptyStrings: false})
  },
  updateVerticalSectionContent: function(storyId, index, content){ // TO-DO switch to using id instead of index
    check(storyId, String);
    check(index, Number);
    check(content, String);
    // html is cleaned client-side on both save and display
    var setObject = { $set:{} };
    setObject['$set']['draftStory.verticalSections.' + index + '.content'] = content;

    return updateStory.call(this, {_id: storyId}, setObject, {removeEmptyStrings: false, autoConvert: false}); // don't autoconvert because https://github.com/aldeed/meteor-simple-schema/issues/348
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
  addTitle: function(storyId, index) {
    check(storyId, String);
    check(index, Number);
    return changeHasTitle.call(this, storyId, index, true);
  },
  removeTitle: function(storyId, index) {
    check(storyId, String);
    check(index, Number);
    return changeHasTitle.call(this, storyId, index, false);
  },
  editHorizontalBlockDescription: function(horizontalId, description) {
    check(horizontalId, String);
    check(description, String);
    return updateContextBlocks.call(this, {"_id": horizontalId }, {"$set": {"description": description}});
  },
  editTextSection: function(horizontalId, content) {
    check(horizontalId, String);
    check(content, String);
    return updateContextBlocks.call(this, {"_id": horizontalId }, {"$set": {"content": content}});
  },
  editLinkTitle: function(horizontalId, content) {
    check(horizontalId, String);
    check(content, String);
    return updateContextBlocks.call(this, {"_id": horizontalId }, {"$set": {"override.title": content.replace(/\n/g, "") }});
  },
  editLinkDescription: function(horizontalId, content) {
    check(horizontalId, String);
    check(content, String);
    return updateContextBlocks.call(this, {"_id": horizontalId }, {"$set": {"override.description": content.replace(/\n/g, "") }});
  },
  editLinkThumbnail: function(horizontalId, cloudinaryImageInfo) {
    check(horizontalId, String);
    check(cloudinaryImageInfo, Object);
    check(cloudinaryImageInfo.id, String);
    check(cloudinaryImageInfo.fileExtension, String);
    check(cloudinaryImageInfo.width, Number);
    check(cloudinaryImageInfo.height, Number);

    return updateContextBlocks.call(this, {"_id": horizontalId }, {"$set": {
      "override.thumbnailId": cloudinaryImageInfo.id,
      "override.thumbnailWidth": cloudinaryImageInfo.width,
      "override.thumbnailHeight": cloudinaryImageInfo.height,
      "override.thumbnailFileExtension": cloudinaryImageInfo.fileExtension
    }});
  },
  reorderStory: function(storyId, idMap) {
    check(storyId, String);
    check(idMap, [Object]);

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

    return updateStory.call(this, {_id: storyId}, {
      $set: {
        'draftStory.verticalSections': newVerticalSections
      }
    })
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
  publishStory: function(storyId, title, keywords, narrativeRightsReserved) {
    check(storyId, String);
    check(title, String);
    check(keywords, [String]);
    check(narrativeRightsReserved, Boolean);
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to publish a story');
    }

    var user = Meteor.user();

    if (!user){
      throw new Meteor.Error('user not found by author to publish. userId: ' + this.userId);
    }

    var accessPriority = user.accessPriority;
    if(!accessPriority || accessPriority > publishAccessLevel){
      throw new Meteor.Error('user does not have publish access. userId: ' + this.userId);
    }

    var story = Stories.findOne({_id: storyId, authorId: this.userId});

    if (!story){
      throw new Meteor.Error('story not found by author to publish. story: ' + storyId + '  userId: ' + this.userId);
    }


    var draftStory = story.draftStory;

    if (!draftStory){
      throw new Meteor.Error('story for publishing does not have a draft. story: ' + storyId + '  userId: ' + this.userId)
    }

    var contextBlockIds = _.chain(draftStory.verticalSections)
      .pluck('contextBlocks')
      .flatten()
      .value();

    // update contextblocks so they are ready for publish
    var numCBlocksUpdated = updateContextBlocks.call(this, { _id: {$in: contextBlockIds} }, {
      $set: {
        'published': true,
        'everPublished': true,
        'publishedAt': new Date()
      },
    }, {multi: true});

    if (numCBlocksUpdated !== contextBlockIds.length){
      throw new Meteor.Error('context blocks failed to update on publish ' + storyId + '. Maybe some are missing. Or are not by author. Number of ids: ' + contextBlockIds.length + ' Number of blocks updated: ' + numCBlocksUpdated);
    }

    var contextBlocks = ContextBlocks.find({_id: {$in: contextBlockIds}}).fetch();

    var contextBlockTypeCount = _.chain(contextBlocks).pluck('type').countBy(_.identity).value();

    // TO-DO
    // Maybe a list of which cards are original and which are remixed

    var fieldsToCopyFromDraft = [
      'verticalSections',
      'headerImage',
      'headerImageFormat',
      'headerImageAttribution'
      //'title'
    ];

    var fieldsToSetFromArguments = {
      'title': title,
      'draftStory.title': title,
      'keywords': keywords,
      'draftStory.keywords': keywords,
      'narrativeRightsReserved': narrativeRightsReserved,
      'draftStory.narrativeRightsReserved': narrativeRightsReserved,
    };


    var setObject = _.extend({},
      _.pick(draftStory, fieldsToCopyFromDraft), // copy all safe fields from draftStory.
      fieldsToSetFromArguments,
      {
        'contextBlocks': contextBlocks,
        'contextBlockIds': contextBlockIds,
        'contextBlockTypeCount': contextBlockTypeCount,
        'userPathSegment': user.displayUsername,
        'storyPathSegment': _s.slugify(title.toLowerCase()) + '-' + story.shortId, // TODO DRY
        'publishedAt': new Date,
        'firstPublishedAt': story.firstPublishedAt || new Date, // only change if not set TODO cleanup and actually don't set if already set
        'published': true,
        'everPublished': true,
        'authorName': user.profile.name || 'Anonymous',
        'authorUsername': user.username,
        'authorDisplayUsername': user.displayUsername,
        'version': 'earlybird'
      }
    );

    if (story.published){ // if was published before, add the current published version to the history
      StoryHistories.insert(_.extend({storyId: story._id}, _.omit(story, ['draftStory', 'history', '_id']))); // TO-DO remove history once migrate all existing stories
    }

    return updateStory.call(this, { _id: storyId }, {
      $set: setObject
    });
  },
  unpublishStory: unpublishStory,
  deleteStory: function(storyId){
    check(storyId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to delete a story');
    }

    var story = Stories.findOne({_id: storyId, authorId: this.userId});

    if (!story) {
      throw new Meteor.Error('story not found by author to delete. story: ' + storyId + '  userId: ' + this.userId);
    }

    if (story.published){
      var unpublishSuccessful = unpublishStory.call(this, storyId);
      if (!unpublishSuccessful) {
        throw new Meteor.Error('unpublish failed' + storyId + '  userId: ' + this.userId);
      }
    }

    return updateStory.call(this, { _id: storyId }, {
      $set: {
        deleted: true,
        deletedAt: new Date
      }
    });
  },
  followUser: function(userId) {
    check(userId, String);
    var success = changeFollow.call(this, userId, true);
    if(success){
      generateFollowActivity(this.userId, userId);
    }
    return success
  },
  unfollowUser: function(userId) {
    check(userId, String);
    return changeFollow.call(this, userId, false);
  },
  favoriteStory: function(storyId) {
    check(storyId, String);
    var success = changeFavorite.call(this, storyId, true);
    if(success){
      generateFavoriteActivity(this.userId, storyId)
    }
    return success;
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
  createStory: function(shortId, verticalSectionId) { // TO-DO find a way to generate these in a trusted way server without compromising UI speed
    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('not-logged-in', 'Sorry, you must be logged in to create a story');
    }
    var accessPriority = user.accessPriority;
    if(!accessPriority || accessPriority > createAccessLevel){
      throw new Meteor.Error('user does not have create access. userId: ' + this.userId);
    }

    var storyPathSegment = _s.slugify('new-story') + '-' + shortId;  // TODO DRY
    var userPathSegment= user.displayUsername;

    initialVerticalSection = {
      _id: verticalSectionId,
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
      authorName: user.profile.name || user.username,
      authorUsername: user.username,
      authorDisplayUsername: user.displayUsername,
      shortId: shortId,
      draftStory: {
        verticalSections: [initialVerticalSection],
        storyPathSegment: storyPathSegment,
        title: ''
      }
    }, {removeEmptyStrings: false});

    if (Meteor.isClient){
      Router.go('edit', Stories.findOne({shortId:shortId}))
    }

    return {
      userPathSegment: userPathSegment,
      storyPathSegment: storyPathSegment
    };
  }

});


