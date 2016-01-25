window.GOOGLE_API_CLIENT_KEY = Meteor.settings["public"].GOOGLE_API_CLIENT_KEY;

if (!GOOGLE_API_CLIENT_KEY) {
  console.error('Settings must be loaded for apis to work');
  throw new Meteor.Error('Settings must be loaded for apis to work');
}

window.panelColor = "#815ed9";
window.remixColor = panelColor;
window.orangeColor = "#fc521f";
window.actionColor = '#00c976';
window.dangerColor = '#fc521f';
window.whiteColor = "white";
