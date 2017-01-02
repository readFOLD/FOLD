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



export default ImageBlock = (function (_super) {
  __extends(ImageBlock, _super);

  function ImageBlock(doc) {
    ImageBlock.__super__.constructor.call(this, doc);
    this.type = 'image';
    if (!this.source) { // TO-DO Remove
      this.source = 'imgur';
    }
  };

  ImageBlock.prototype.showVideo = function () {
    return this.webMUrl() || this.mp4Url();
  };

  ImageBlock.prototype.webMUrl = function () {
    if (this.source === 'imgur' && this.reference.hasWebM) {
      return '//i.imgur.com/' + this.reference.id + '.webm';
    }
  };

  ImageBlock.prototype.mp4Url = function () {
    if (this.source === 'imgur' && this.reference.hasMP4) {
      return '//i.imgur.com/' + this.reference.id + '.mp4';
    }
  };

  ImageBlock.prototype.url = function () {
    switch (this.source) {
      case 'local':
        return '/' + this.reference.id;
      case 'link':
        return this.reference.url;
      case 'imgur':
        return '//i.imgur.com/' + this.reference.id + '.' + this.reference.fileExtension;
      case 'flickr':
        return '//farm' + this.reference.flickrFarm + '.staticflickr.com/' + this.reference.flickrServer + '/' + this.reference.id + '_' + this.reference.flickrSecret + '.jpg'
      case 'embedly':
        return this.reference.url;
      case 'cloudinary':
        // TO-DO maybe use jpeg instead of png in certain situations
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id;
    }
  };

  ImageBlock.prototype.isFlickr = function () {
    return (this.source === 'flickr');
  };

  ImageBlock.prototype.webUrl = function () {
    switch (this.source) {
      case 'flickr':
        if (this.reference.flickrOwnerId) {
          return '//www.flickr.com/photos/' + this.reference.flickrOwnerId + '/' + this.reference.id;
        } else {
          return encodeFlickrUrl(this.reference.id)
        }
    }
  };

  ImageBlock.prototype.ownerUrl = function () {
    switch (this.source) {
      case 'flickr':
        if (this.reference.flickrOwnerId) {
          return '//www.flickr.com/photos/' + this.reference.flickrOwnerId;
        } else {
          return this.reference.authorUrl; // from embedly
        }
    }
  };

  ImageBlock.prototype.ownerName = function () {
    switch (this.source) {
      case 'flickr':
        return this.reference.ownerName || this.reference.authorName; // author name is from embedly
    }
  };

  ImageBlock.prototype.uploadDate = function () {
    switch (this.source) {
      case 'flickr':
        if (this.reference.uploadDate) {
          return this.reference.uploadDate.toDateString();
        }
    }
  };

  ImageBlock.prototype.largeUrl = function () {
    switch (this.source) {
      case 'flickr':
        if (this.reference.flickrSecretOrig){ // check for original
          return '//farm' + this.reference.flickrFarm + '.staticflickr.com/' + this.reference.flickrServer + '/' + this.reference.id + '_' + this.reference.flickrSecretOrig + '_o.' + this.reference.flickrFormatOrig;
        } else if (this.reference.lgUrl){  // check for largest url available
          return this.reference.lgUrl
        } else { // fallback to size "z"
          return '//farm' + this.reference.flickrFarm + '.staticflickr.com/' + this.reference.flickrServer + '/' + this.reference.id + '_' + this.reference.flickrSecret + '_z.jpg';
        }
      case 'cloudinary':
        // TO-DO maybe use jpeg instead of png in certain situations
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/' + this.reference.id;
      default:
        return this.url();
    }
  };

  ImageBlock.prototype.previewUrl = function () {
    switch (this.source) {
      case 'local':
        return '/' + this.reference.id;
      case 'link':
        return this.reference.url;
      case 'imgur':
        if (this.reference.fileExtension === 'gif') {
          return '//i.imgur.com/' + this.reference.id + 'l' + '.' + this.reference.fileExtension;
        } else {
          return '//i.imgur.com/' + this.reference.id + '.' + this.reference.fileExtension;
        }
      case 'flickr':
        return '//farm' + this.reference.flickrFarm + '.staticflickr.com/' + this.reference.flickrServer + '/' + this.reference.id + '_' + this.reference.flickrSecret + '.jpg'
      case 'embedly':
        return this.reference.url;
      case 'cloudinary':
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id;
    }
  };

  ImageBlock.prototype.thumbnailUrl = function () {
    switch (this.source) {
      case 'local':
        return '/' + this.reference.id;
      case 'imgur':
        return '//i.imgur.com/' + this.reference.id + 't' + '.' + this.reference.fileExtension;
      case 'flickr':
        return '//farm' + this.reference.flickrFarm + '.staticflickr.com/' + this.reference.flickrServer + '/' + this.reference.id + '_' + this.reference.flickrSecret + '_t' + '.jpg';
      case 'embedly':
        return this.reference.thumbnailUrl;
      case 'cloudinary':
        // f_auto is slightly worse quality but less bandwidth
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/f_auto,c_limit,h_150,w_260/' + this.reference.id;
    }
  };

  ImageBlock.prototype.anchorMenuSnippet = function () {
    return this.description || this.reference.title || this.reference.description || this.reference.id;
  };

  return ImageBlock;

})(ContextBlock);
