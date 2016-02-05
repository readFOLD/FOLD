// TODO include info needed to generate links, or entire links themselves. //

generateFavoriteActivity = function(userId, storyId){
  if(Meteor.isServer){
    Meteor.defer(function(){ // make non-blocking
      check(userId, String);
      check(storyId, String);

      generateActivity('Favorite', {
        actor: {
          id: userId,
          type: 'Person',
          name: Meteor.users.findOne(userId, {fields: {'profile.name' : 1}}).profile.name
        },
        object: {
          id: storyId,
          type: 'Story',
          name: Stories.findOne({_id: storyId, published: true}, {fields: {'title' : 1}}).title
        }
      })
    })
  }
};

generateFollowActivity = function(userId, userToFollowId){
  if(Meteor.isServer){

    Meteor.defer(function(){ // make non-blocking
      check(userId, String);
      check(userToFollowId, String);

      var userToFollow = Meteor.users.findOne(userToFollowId, {fields: {'profile.following': 1, 'profile.name': 1}});
      var activityType = _.contains(userToFollow.profile.following, userId) ? 'FollowBack' : 'Follow';
      console.log(activityType)

      generateActivity(activityType, {
        actor: {
          id: userId,
          type: 'Person',
          name: Meteor.users.findOne(userId, {fields: {'profile.name' : 1}}).profile.name
        },
        object: {
          id: userToFollowId,
          type: 'Person',
          name: userToFollow.profile.name
        }
      })
    })
  }
};
