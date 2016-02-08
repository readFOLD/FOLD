generateActivity = function(type, details){
  check(type, String);
  check(details, Object);

  if(details.fanout){
    throw new Meteor.Error('Fanout should not be set');
  }
  var fullDetails = _.extend({}, details, {type: type});

  var dedupDetails = {
    type: type
  };

  _.each(['actor', 'object', 'target'], function(key){
    if(details[key]){
      dedupDetails[key +'.id'] = details[key].id;
    }
  });

  switch(type){
    case 'Share':
      // pass through
      break;
    case 'Message':
      // pass through
      break;
    default: // don't allow duplicate activities
      if(details.content){
        dedupDetails.content = details.content
      }
      if(Activities.find(dedupDetails, {limit: 1}).count()){
        return // if this is a duplicate. stop here.
      }

  }

  Activities.insert(fullDetails);
};


generateActivityFeedItem = function(userId, activityId, relevancy){
  check(userId, String);
  check(activityId, String);
  check(relevancy, Date);

  return ActivityFeedItems.insert({
    uId: userId,
    aId: activityId,
    r: relevancy
  })
};


fanToObject = function(activity){
  check(activity.object, Object);
  generateActivityFeedItem(activity.object.id, activity._id, activity.published);
};

fanToObjectAuthor = function(activity){
  check(activity.object, Object);

  var populatedObject;

  switch (activity.object.type){
    case 'Story':
      populatedObject = Stories.findOne(activity.object.id, {fields: {authorId: 1}});
      break;
    default:
      throw new Meteor.Error('Object not found in database for activity: ' + activity._id);
  }

  if(populatedObject){
    generateActivityFeedItem(populatedObject.authorId, activity._id, activity.published); // fan to author
  }
};


fanoutActivity = function(activity){
  check(activity, Object);
  check(activity.published, Date);

  Activities.update(activity._id, {$set: {fanout: 'in_progress'}});

  switch(activity.type){
    case 'Favorite':
      fanToObjectAuthor(activity);
      break;
    case 'Follow':
      fanToObject(activity);
      break;
    case 'FollowBack':
      fanToObject(activity);
      break;
    case 'Publish':
      var author = Meteor.users.findOne(activity.actor.id, {fields: {followers: 1}}); // fan to followers
      _.each(author.followers, function(follower){
        generateActivityFeedItem(follower, activity._id, activity.published);
      });
      break;
    case 'Share':
      fanToObjectAuthor(activity);
      break;
    default:
      throw new Error('Activity type not matched for activity: ' + activity._id + ' Type: ' + activity.type);
  }

  // if get here, nothing has thrown
  return Activities.update(activity._id, {$set: {fanout: 'done'}});
};
