var curatorId;

if (Meteor.users.find().count() === 0) {
  curatorId = Accounts.createUser({
    email: 'curator@example.com',
    username: 'curat0r',
    password: 'password',
    accessPriority: 1,
    profile: {
      name: 'Dr Stream'
    },
    signupCode: 'civic'
  });
  Accounts.createUser({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password',
    profile: {
      name: 'Wonderful Tester'
    },
    signupCode: 'civic'
  });
}

if (Deepstreams.find().count() === 0) {
  [].map(function(e){Deepstreams.insert(e)})
}

// External Services

ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: process.env.TWITTER_API_KEY || Meteor.settings.TWITTER_API_KEY,
      loginStyle: "popup",
      secret: process.env.TWITTER_API_SECRET || Meteor.settings.TWITTER_API_SECRET
    }
  }
);
