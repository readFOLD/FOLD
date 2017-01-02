

idFromPathSegment = function(pathSegment) { // everything after last dash
  return pathSegment.substring(pathSegment.lastIndexOf('-') + 1);
};

sum = function(a,b){ return a+b; };

if(Meteor.isServer){
  import cheerio from 'cheerio';
}

getProfileImage = function(profilePicture, twitterId, size, forEmail){
  var diameter;
  if (size === 'large'){
    diameter = 150;
  } else {
    diameter = 60;
  }
  var defaultProfilePic = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // transparent gif
  var dprSetting = ((typeof window == 'undefined') || window.isHighDensity) ? ',dpr_2.0' : '';
  var twitterPic;
  if (twitterId) {
    twitterPic = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/twitter/w_' + diameter + ',h_' + diameter + ',c_fill,g_face' + dprSetting + '/' + twitterId
  }


  if (profilePicture || twitterId) {
    if ( profilePicture) {
      if ( profilePicture < 20) { // it's a monster
        if (twitterPic){
          return twitterPic
        } else { // show monster
          if(forEmail){
            return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/w_' + diameter + ',h_' + diameter + dprSetting + '/static/profile_monster_' + profilePicture + '.png';
          } else {
            return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/static/profile_monster_' + profilePicture + '.svg';
          }
        }
      } else {
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/w_' + diameter + ',h_' + diameter + ',c_fill,g_face' + dprSetting + '/' + profilePicture
      }
    } else if (twitterPic) {
      return twitterPic
    }
  }

  // if nothing else served up
  return defaultProfilePic
}
