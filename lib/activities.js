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
