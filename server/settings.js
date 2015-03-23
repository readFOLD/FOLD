// get segment key to the client, while allowing it to be set from environment variable
// NOTE: this hack may not be 100% reliable (for ex when initially deploy won't update clients)
Meteor.startup(function () {
  if (process.env.SEGMENT_WRITE_KEY){
    Meteor.settings['public'].SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY;
  }
});
