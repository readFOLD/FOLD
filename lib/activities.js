infoFor = function(type, id){
  switch(type){
    case 'Person':
      var user = Meteor.users.findOne(id, {fields: {'profile.name' : 1, 'displayUsername': 1}});
      return {
        id: user._id,
        type: 'Person',
        name: user.profile.name,
        urlPath: '/profile/' + user.displayUsername
      };
    case 'Story':
      var story = Stories.findOne({_id: id, published: true}, {fields: {'title' : 1, 'userPathSegment': 1, 'storyPathSegment': 1}});
      return {
        id: story._id,
        type: 'Story',
        name: story.title,
        urlPath: '/read/' + story.userPathSegment + '/' + story.storyPathSegment
      };
    default:
      throw new Meteor.Error('Type not found for infoFor')
  }
};

generateFavoriteActivity = function(userId, storyId){
  if(Meteor.isServer){
    Meteor.defer(function(){ // make non-blocking
      check(userId, String);
      check(storyId, String);

      generateActivity('Favorite', {
        actor: infoFor('Person', userId),
        object: infoFor('Story', storyId)
      })
    })
  }
};

generateFollowActivity = function(userId, userToFollowId){
  if(Meteor.isServer){

    Meteor.defer(function(){ // make non-blocking
      check(userId, String);
      check(userToFollowId, String);

      var userToFollow = Meteor.users.findOne(userToFollowId, {fields: {'profile.following': 1}});
      var activityType = _.contains(userToFollow.profile.following, userId) ? 'FollowBack' : 'Follow';

      generateActivity(activityType, {
        actor: infoFor('Person', userId),
        object: infoFor('Person', userToFollowId)
      })
    })
  }
};
