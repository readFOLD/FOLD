import ContextBlock from './context-block.js'

var __hasProp = {}.hasOwnProperty,
  __extends = function (child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };



export default VideoBlock = (function (_super) {
  __extends(VideoBlock, _super);

  function VideoBlock(doc) {
    VideoBlock.__super__.constructor.call(this, doc);
    this.type = 'video';
    if (this.source == null) {
      this.source = 'youtube';
    }
  }

  VideoBlock.prototype.title = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.title
    }
  };

  VideoBlock.prototype.caption = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.description
    }
  };

  VideoBlock.prototype.username = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.username
    }
  };

  VideoBlock.prototype.creationDate = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.creationDate
    }
  };

  VideoBlock.prototype.url = function () {
    if (this.source === 'youtube') {
      return '//www.youtube.com/embed/' + this.reference.id + '?fs=0&enablejsapi=1';
    } else if (this.source === 'vimeo') {
      return '//player.vimeo.com/video/' + this.reference.id + '?api=1';
    }
  };

  VideoBlock.prototype.autoplayUrl= function () {
    return this.url() + '?autoplay=true'
  };

  VideoBlock.prototype.previewUrl = function () {
    if (this.source === 'youtube') {
      return '//img.youtube.com/vi/' + this.reference.id + '/0.jpg';
    } else if (this.source === 'vimeo') {
      return '//i.vimeocdn.com/video/' + this.reference.previewImage + '_640x359.jpg'
    }
  };

  VideoBlock.prototype.thumbnailUrl = function () {
    if (this.source === 'youtube') {
      return '//i.ytimg.com/vi/' + this.reference.id + '/default.jpg';
    } else if (this.source === 'vimeo') {
      return '//i.vimeocdn.com/video/' + this.reference.previewImage + '_100x75.jpg'
    }
  };

  VideoBlock.prototype.anchorMenuSnippet = function () {
    return this.reference.title;
  };

  return VideoBlock;

})(ContextBlock);
