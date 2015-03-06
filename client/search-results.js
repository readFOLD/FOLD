
SearchResults = new Mongo.Collection(null, {
    transform: function(doc) { return window.newTypeSpecificContextBlock(doc) }
  });
