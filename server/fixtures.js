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
    _id: 'someid',
    shortId: 'bbbb',
    userPathSegment: 'curat0r',
    streamPathSegment: 'fish-stream-bbbb',
    curatorId: curatorId,
    title: 'Real Live Fish',
    onAir: true,
    creationStep: null,
    streams: [{
      source: 'youtube',
      _id: 'seahorses',
      reference: {
        id: '6AMTZwJes4M'
      }
    }, {
      source: 'youtube',
      _id: 'sharks',
      reference: {
        id: 'A01g3lrwoGs'
      }
    }],
    contextBlocks: [
      {
        "reference": {
          "ownerName":"San Diego Shooter",
          "uploadDate":new Date("2009-06-07T00:26:43.000Z"),
          "flickrFarm":4,
          "flickrSecret":"51e665ab29",
          "id":"3601426325",
          "flickrServer":"3070",
          "title":"Pot-Bellied Sea Horse"
        },
        "type":"image",
        "source":"flickr",
        "authorId":"XfPKhsYMceWEN5dXE",
        "searchQuery":"seahorses",
        "_id":"27ay4CtwH",
        "description":"A very special seahorse",
        "addedAt":new Date("2015-06-24T08:23:51.068Z"),
        "savedAt":new Date("2015-06-24T08:23:51.068Z")
      }
    ],
    activeStreamId: 'seahorses',
    createdAt: Date.now(),
    savedAt: Date.now(),
    publishedAt: Date.now()
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
