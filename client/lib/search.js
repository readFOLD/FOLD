var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title', 'description'];

StreamSearch = new SearchSource('streams', fields, options);
