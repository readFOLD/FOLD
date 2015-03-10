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
  modifier.$set = _.extend(modifier.$set || {}, {lastSaved: Date.now()});

  return Stories.update(selector, modifier, _.defaults({}, options, {removeEmptyStrings: false}));
};



Meteor.methods({
  // TODO PREVENT FROM SAVING OTHER WAYS
  updateStoryTitle: function(storyId, title){
    // TODO DRY
    // TODO Security
    var storyPathSegment = _s.slugify(title.toLowerCase() || 'new-story')+ '-' + Stories.findOne({_id: storyId}).shortId;
    return updateStory({_id: storyId}, {$set: {'draftStory.title' : title, 'draftStory.storyPathSegment' : storyPathSegment }});
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
  insertVerticalSection: function(storyId, index, section) {
    // TODO - Once Meteor upgrades to use Mongo 2.6
    // This should use the $position operator and work directly there
    // Also, can probably get rid of the blackbox: true on verticalSections in the schema!

    section = section || {
      _id: Random.id(8),
      contextBlocks: [],
      title: "",
      content: ""
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
      content: ""
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


    if ((index + 1) >= story.draftStory.verticalSections){
      throw new Meteor.Error('Index too high')
    }

    swapArrayElements(verticalSections, index, index + 1);

    return updateStory({ _id: storyId }, {
      $set: {
        'draftStory.verticalSections': verticalSections
      }
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
    console.log(1111);
    var storyPathSegment = _s.slugify('new-story') + '-' + shortId;  // TODO DRY
    var userPathSegment= user.username;

    initialVerticalSection = {
      _id: Random.id(8),
      contextBlocks: [],
      title: "",
      content: ""
    };

    Stories.insert({
      published: false,
      verticalSections: [initialVerticalSection],
      lastSaved: new Date,
      userPathSegment: userPathSegment,
      storyPathSegment: storyPathSegment,
      authorId: this.userId,
      authorName: user.profile.name || 'Anonymous',
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
  // publishStory
  // 'draftStory.unpublishedChanges' : false

});


