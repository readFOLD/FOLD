window.GOOGLE_API_CLIENT_KEY = Meteor.settings["public"].GOOGLE_API_CLIENT_KEY;

if (!GOOGLE_API_CLIENT_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}

