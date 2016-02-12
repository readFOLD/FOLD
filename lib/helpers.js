newTypeSpecificContextBlock = function (doc) {
  switch (doc.type) {
    case 'stream':
      return new Stream(doc);
    case 'video':
      return new VideoBlock(doc);
    case 'text':
      return new TextBlock(doc);
    case 'map':
      return new MapBlock(doc);
    case 'image':
      return new ImageBlock(doc);
    case 'gif':
      return new GifBlock(doc);
    case 'audio':
      return new AudioBlock(doc);
    case 'viz':
      return new VizBlock(doc);
    case 'twitter':
      return new TwitterBlock(doc);
    case 'link':
      return new LinkBlock(doc);
    case 'news':
      return new NewsBlock(doc);
    default:
      return new ContextBlock(doc);
  }
};

idFromPathSegment = function(pathSegment) { // everything after last dash
  return pathSegment.substring(pathSegment.lastIndexOf('-') + 1);
};

sum = function(a,b){ return a+b; };
