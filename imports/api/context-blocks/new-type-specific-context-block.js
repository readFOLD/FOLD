import VideoBlock from './video-block.js'
import TextBlock from './text-block.js'
import MapBlock from './map-block.js'
import ImageBlock from './image-block.js'
import GifBlock from './gif-block.js'
import AudioBlock from './audio-block.js'
import VizBlock from './viz-block.js'
import TwitterBlock from './twitter-block.js'
import LinkBlock from './link-block.js'
import NewsBlock from './news-block.js'
import ActionBlock from './action-block.js'
import ContextBlock from './context-block.js'

export default newTypeSpecificContextBlock = function (doc) {
  switch (doc.type) {
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
    case 'action':
      return new ActionBlock(doc);
    default:
      return new ContextBlock(doc);
  }
};
