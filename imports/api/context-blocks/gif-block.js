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



export default GifBlock = (function (_super) {
  __extends(GifBlock, _super);

  function GifBlock(doc) {
    GifBlock.__super__.constructor.call(this, doc);
    this.type = 'gif';
  };


  GifBlock.prototype.isGiphy = function () {
    return (this.source === 'giphy');
  };

  GifBlock.prototype.showVideo = function () {
    return this.webMUrl() || this.mp4Url();
  };

  GifBlock.prototype.webMUrl = function () {
    if (this.source === 'cloudinary') {
      return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id + '.webm';
    }
  };

  GifBlock.prototype.mp4Url = function () {
    if (this.source === 'cloudinary') {
      return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id + '.mp4';
    }
  };

  GifBlock.prototype.largeUrl = function () {
    return this.url(); // don't let gifs get large to preserve bandwidth
  };

  GifBlock.prototype.url = function () {
    switch (this.source) {
      case 'giphy':
        return '//media4.giphy.com/media/' + this.reference.id + '/giphy.gif';
      case 'cloudinary':
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id;
    }
  };

  GifBlock.prototype.previewUrl = function () {
    switch (this.source) {
      case 'giphy':
        return '//media4.giphy.com/media/' + this.reference.id + '/giphy.gif';
      case 'cloudinary':
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id + '.jpg';
    }
  };

  GifBlock.prototype.thumbnailUrl = function () {
    switch (this.source) {
      case 'giphy':
        return '//media4.giphy.com/media/' + this.reference.id + '/200_d.gif';
      case 'cloudinary':
        // f_auto is slightly worse quality but less bandwidth
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/f_auto,c_limit,h_150,w_260/' + this.reference.id;
    }
  };

  GifBlock.prototype.anchorMenuSnippet = function () {
    return this.description || this.reference.title || this.reference.description || this.reference.id;
  };

  return GifBlock;

})(ContextBlock);
