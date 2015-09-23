Meteor.methods({
  saveProfilePicture: function (userId, pictureId) {
    check(userId, String);
    check(pictureId, String);
    if (this.userId === userId) {
      Meteor.users.update({
        _id: this.userId
      }, {
        $set: {
          "profile.profilePicture": pictureId
        }
      });
    } else {
      throw new Meteor.Error("Only the account owner may edit this profile")
    }
  },
  updateProfile: function (modifier, userId) { // TO-DO cleanup
    check(userId, String);
    check(modifier, Object);

    var bio, name, newName;
    var modifierSet = modifier.$set;
    var modifierUnset = modifier.$unset;

    var setObject = {};
    if (bio = modifierSet['profile.bio']) {
      check(bio, String);
      setObject['profile.bio'] = bio;
    } else if (modifierUnset['profile.bio'] === "") {
      setObject['profile.bio'] = '';
    }

    if (name = modifierSet['profile.name']) {
      check(name, String);
      setObject['profile.name'] = name;
    } else if (modifierUnset['profile.name'] === "") {
      setObject['profile.name'] = '';
    }

    if (this.userId === userId) {
      if (newName = setObject['profile.name']) {
        if (newName !== Meteor.user().profile.name) {
          Stories.update({authorId: this.userId}, { // update authorName on stories if name changed
            $set: {
              authorName: newName
            }
          })
        }
      }

      Meteor.users.update({
        _id: this.userId
      }, {
        $set: setObject
      });
    } else {
      throw new Meteor.Error("Only the account owner may edit this profile")
    }
  }
});


