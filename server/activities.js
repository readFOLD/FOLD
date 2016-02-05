generateActivity = function(type, details){
  check(type, String);
  check(details, Object);

  if(details.fanout){
    throw new Error('Fanout should not be set');
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

  if(details.content){ // TODO if message or similar, don't want to dedup at all. can send multiple messages that are the same
    dedupDetails.content = details.content
  }

  if(!Activities.find(dedupDetails, {limit: 1}).count()){
    Activities.insert(fullDetails);
  }
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

fanToActor = function(activity){
  check(activity.actor, Object);
  generateActivityFeedItem(activity.actor.id, activity._id, activity.published);
};

fanToObject = function(activity){
  check(activity.object, Object);
  generateActivityFeedItem(activity.object.id, activity._id, activity.published);
};

fanToTarget = function(activity){
  check(activity.target, Object);
  generateActivityFeedItem(activity.target.id, activity._id, activity.published);
};


fanoutActivity = function(activity){
  check(activity, Object);
  check(activity.published, Date);

  Activities.update(activity._id, {$set: {fanout: 'in_progress'}});

  switch(activity.type){
    case 'Favorite':
      var story = Stories.findOne(activity.object.id, {fields: {authorId: 1}});
      if(story){
        generateActivityFeedItem(story.authorId, activity._id, activity.published);
      }
      break;
    case 'Follow':
      fanToObject(activity);
      break;
    case 'FollowBack':
      fanToObject(activity);
      break;
    default:
      throw new Error('Activity type not matched for activity: ' + activity._id);
  }

  // if get here, nothing has thrown
  return Activities.update(activity._id, {$set: {fanout: 'done'}});
};
