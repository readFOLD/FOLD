SearchResults = new Mongo.Collection(null, {
    transform (doc) { return window.newTypeSpecificContextBlock(doc) }
  });
