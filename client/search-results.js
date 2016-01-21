
SearchResults = new Mongo.Collection(null, {
    transform: function(doc) { return window.newTypeSpecificContextBlock(doc) }
  });

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};
var fields = ['title', 'keywords', 'authorName', 'authorDisplayUsername'];

StorySearch = new SearchSource('stories', fields, options);
