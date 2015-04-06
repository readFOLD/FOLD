// get segment key to the client, while allowing it to be set from environment variable
// NOTE: this hack may not be 100% reliable (for ex when initially deploy won't update clients)
Meteor.startup(function () {
  if (process.env.SEGMENT_WRITE_KEY){
    Meteor.settings['public'].SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY;
  }
});

if (Meteor.settings.CLOUDINARY_API_SECRET){
  Cloudinary.config({
    cloud_name: Meteor.settings['public'].CLOUDINARY_CLOUD_NAME,
    api_key: Meteor.settings.CLOUDINARY_API_KEY,
    api_secret: Meteor.settings.CLOUDINARY_API_SECRET
  });
};
