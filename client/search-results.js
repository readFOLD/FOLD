
VideoSearchResults = new Mongo.Collection(null, {
    transform: function(doc) {
      return new VideoBlock(_.extend(doc, {
          source: 'youtube'
        }))
    },
  });

ImageSearchResults = new Mongo.Collection(null, {
    transform: function(doc) {
      return new ImageBlock(_.extend(doc, {
          source: 'imgur'
        }))
    },
  });
