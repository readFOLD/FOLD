
VideoSearchResults = new Mongo.Collection(null, {
    transform: function(doc) {
      return new VideoBlock(_.extend(doc, {
          service: 'youtube'
        }))
    },
  });