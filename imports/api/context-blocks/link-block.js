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



export default LinkBlock = (function (_super) {
  __extends(LinkBlock, _super);

  function LinkBlock(doc) {
    LinkBlock.__super__.constructor.call(this, doc);
    this.type = 'link';
    if(!this.override){
      this.override = {}; // if needed in more type, probably put this in ContextBlock, or the schema and migrate
    }
  }

  LinkBlock.prototype.title = function () {
    return this.override.title ||this.reference.title || this.reference.originalUrl;
  };

  LinkBlock.prototype.linkDescription = function () {
    return this.override.description || this.reference.description || '';
  };

  LinkBlock.prototype.thumbnailOverride = function () {
    return this.override.thumbnailId ? true : false;
  };

  LinkBlock.prototype.thumbnailOverrideUrl = function () {
    if(this.thumbnailOverride()){
      var url;
      if(this.imageOnLeft()){
        url = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_lfill,g_center,h_130,w_130/' + this.override.thumbnailId;
      } else {
        url = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_lfill,g_center,h_130,w_520/' + this.override.thumbnailId;
      }
      if(this.override.thumbnailFileExtension === 'gif'){
        url += '.jpg'
      }

      return url
    }
  };

  LinkBlock.prototype.thumbnailUrl = function () {
    return this.thumbnailOverrideUrl() || this.reference.thumbnailUrl || this.thumbnailFallback() || '//res.cloudinary.com/fold/image/upload/v1/static/LINK_SQUARE.svg';
  };

  LinkBlock.prototype.thumbnailFallback = function () {
    if(!this.reference.thumbnailFallback){
      return
    }

    var maxWidth = 2048; // make it like the header images
    var maxHeight = 350; // make it like the header images

    var atmosphereMap = {
      1: "SAUCERS",
      2: "OCEAN",
      3: "FLOWERS",
      4: "BUILDING",
      5: "LIGHTNING",
      6: "DANCER",
      7: "CUBES",
      8: "COMPUTER",
      9: "MARSH",
      10: "RINGS",
      11: "MOTH",
      12: "MOUNTAINS",
      13: "AERIAL"
    };

    var atmosphereName = atmosphereMap[this.reference.thumbnailFallback];

    if (!atmosphereName){
      Meteor.defer(function(){
        throw new Meteor.Error('Header atmosphere not found');
      })
    }

    return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_lfill,g_north,h_' + maxHeight + ',w_' + maxWidth + '/static/header_atmosphere_' + atmosphereName
  };

  LinkBlock.prototype.imageOnLeft = function () {
    if (this.thumbnailOverride()) {
      return (this.override.thumbnailWidth / this.override.thumbnailHeight) <= 1.25;
    } else if (this.reference.thumbnailUrl) {
      return (this.reference.thumbnailWidth / this.reference.thumbnailHeight) <= 1.25;
    } else {
      return true
    }
  };

  LinkBlock.prototype.url = function () {
    return this.reference.url || this.reference.originalUrl;
  };

  LinkBlock.prototype.providerUrl = function () {
    return this.reference.providerUrl;
  };

  LinkBlock.prototype.providerTruncatedUrl = function () {
    return this.reference.providerUrl.replace(/(https?:\/\/)?(www\.)?/, "");
  };

  LinkBlock.prototype.anchorMenuSnippet = function () {
    return this.title();
  };
  return LinkBlock;

})(ContextBlock);
