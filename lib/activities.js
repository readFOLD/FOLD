generateFavoriteActivity = function(userId, storyId){
  if(Meteor.isServer){
    Meteor.defer(function(){ // make non-blocking
      check(userId, String);
      check(storyId, String);

      generateActivity('favorite', {
        actor: {
          id: userId,
          type: 'person',
          name: Meteor.users.findOne(userId, {fields: {'profile.name' : 1}}).profile.name
        },
        object: {
          id: storyId,
          type: 'story',
          name: Stories.findOne({_id: storyId, published: true}, {fields: {'title' : 1}}).title
        }
      })
    })
  }
};
