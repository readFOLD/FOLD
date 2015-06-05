var curatorId;

if (Meteor.users.find().count() === 0) {
  curatorId = Accounts.createUser({
    email: 'curator@example.com',
    username: 'curat0r',
    password: 'password',
    accessPriority: 1,
    profile: {
      name: 'Dr Stream'
    }
  });
  Accounts.createUser({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password'
  });
}

if (Deepstreams.find().count() === 0) {
  Deepstreams.insert({
    shortId: 'bbbb',
    curatorId: curatorId,
    streams: [{
      source: 'youtube',
      _id: 'ant_stream654',
      reference: {
        id: 'tRn74l0hPp8'
      }
    }],
    activeStreamId: 'ant_stream654'
  });
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
