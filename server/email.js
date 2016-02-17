sendWelcomeEmail = function(user){ // this takes actual user instead of userId because user might be in process of being created in db
  var email = user.emails[0].address;
  var emailName = user.profile.name;

  Mandrill.messages.sendTemplate({
    template_name: 'welcome-e-mail',
    template_content: [
    ],
    message: {
      to: [
        {
          email: email,
          name: emailName
        }
      ]
    }
  });
};

var emailTypeForUnsubscribe = function(emailType){
  switch(emailType){
    case 'followed-you-back':
      return 'followed-you' // these are effectively the same
      break;
    default:
      return emailType;
  }
};

var getToFromUserIds = function(userIds, emailType){
  var unsubscribeCheck = emailTypeForUnsubscribe(emailType);
  var users = Meteor.users.find({_id: {$in: userIds}, unsubscribes: {$ne: unsubscribeCheck}}, {fields: {'emails': 1, 'profile.name': 1}});
  return users.map(function(user){
    return {
      email: user.emails[0].address,
      name: user.profile.name
    }
  });
};

var getMergeVarsFromObj = function(obj){
  return _.chain(obj)
    .pairs()
    .map(function(pair){
      return {
        name: pair[0],
        content: pair[1]
      }
    })
    .value()
}

var sendEmail = function(emailType, userIds, subject, bareMergeVars){
  var to = getToFromUserIds(userIds, emailType);
  if(to.length === 0){
    return
  }

  console.log(Mandrill.messages.sendTemplate({
    template_name: emailType,
    template_content: [
    ],
    message: {
      to: to,
      subject: subject,
      global_merge_vars: getMergeVarsFromObj(_.extend({ unsubscribeUrl: Meteor.absoluteUrl('unsubscribe?email_type=' + emailTypeForUnsubscribe(emailType))}, bareMergeVars))
    },
    preserve_recipients: false
  }));
}


sendFollowingPublishedEmail = function(userIds, storyId){
  var story = Stories.findOne(storyId, {fields: readStoryFields});

  var title = story.title;
  var authorName = story.authorName;
  var longContentPreview = story.contentPreview();
  var subject = authorName + ' just published "' + title + '" on FOLD';

  var bareMergeVars = {};

  bareMergeVars.title = title;
  bareMergeVars.authorName = authorName;
  bareMergeVars.subject = subject;

  bareMergeVars.headerImageUrl = 'https:' + story.headerImageUrl();
  if(longContentPreview){
    bareMergeVars.contentPreview = longContentPreview.length > 203 ? longContentPreview.substring(0, 200).replace(/\s+\S*$/, "...") : longContentPreview;
  }
  bareMergeVars.profileUrl = Meteor.absoluteUrl('profile/' + (story.authorDisplayUsername || story.authorUsername));
  bareMergeVars.storyUrl = Meteor.absoluteUrl('read/' + story.userPathSegment + '/' + story.storyPathSegment);

  sendEmail('following-published', userIds, subject, bareMergeVars);
};

sendFollowedYouEmail = function(userId, followingUserId){
  var followingUser = Meteor.users.findOne(followingUserId, {fields: {'profile.name': 1,'profile.bio': 1,'profile.profilePicture': 1, 'displayUsername': 1, 'services.twitter.id': 1}});

  var fullName = followingUser.profile.name; // = story.authorName;
  var username = followingUser.displayUsername; // = story.authorName;
  var subject = fullName + ' (' + username + ') just followed you on FOLD';

  var bareMergeVars = {};

  bareMergeVars.fullName = fullName;
  bareMergeVars.subject = subject;
  bareMergeVars.bio = followingUser.profile.bio;
  bareMergeVars.firstName = fullName.split(' ')[0];
  bareMergeVars.profilePicUrl = 'https:' + getProfileImage(followingUser.profile.profilePicture, (followingUser.services && followingUser.services.twitter) ? followingUser.services.twitter.id : null, 'large');
  bareMergeVars.profileUrl = Meteor.absoluteUrl('profile/' + followingUser.displayUsername);


  sendEmail('followed-you', [userId], subject, bareMergeVars);

};

sendFollowedYouBackEmail = function(userId, followingUserId){
  var followingUser = Meteor.users.findOne(followingUserId, {fields: {'profile.name': 1,'profile.bio': 1,'profile.profilePicture': 1, 'displayUsername': 1, 'services.twitter.id': 1}});

  var fullName = followingUser.profile.name; // = story.authorName;
  var username = followingUser.displayUsername; // = story.authorName;
  var subject = fullName + ' (' + username + ') just followed you back on FOLD';

  var bareMergeVars = {};

  bareMergeVars.fullName = fullName;
  bareMergeVars.subject = subject;
  bareMergeVars.bio = followingUser.profile.bio;
  bareMergeVars.firstName = fullName.split(' ')[0];
  bareMergeVars.profilePicUrl = 'https:' + getProfileImage(followingUser.profile.profilePicture, (followingUser.services && followingUser.services.twitter) ? followingUser.services.twitter.id : null, 'large');
  bareMergeVars.profileUrl = Meteor.absoluteUrl('profile/' + followingUser.displayUsername);


  sendEmail('followed-you-back', [userId], subject, bareMergeVars);

};

