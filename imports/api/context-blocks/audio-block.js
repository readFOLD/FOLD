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

export default AudioBlock = (function (_super) {
  __extends(AudioBlock, _super);

  function AudioBlock(doc) {
    AudioBlock.__super__.constructor.call(this, doc);
    this.type = 'audio';
    if (this.source == null) {
      this.source = 'soundcloud';
    }
  }

  AudioBlock.prototype.title = function () {
    return this.reference.title;
  };

  AudioBlock.prototype.url = function () {
    if (this.source === 'soundcloud') {
      return '//w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + this.reference.id + '&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_comments=false&show_playcount=false&show_user=true&hide_related=true&visual=true'
    }
  };

  AudioBlock.prototype.artworkUrl = function () {
    if (this.source === 'soundcloud') {
      return this.reference.artworkUrl;
    }
  };

  AudioBlock.prototype.previewUrl = function () {
    if (this.source === 'soundcloud') {
      if(this.reference.artworkUrl){
        return this.reference.artworkUrl.replace(/large\.jpg/, "t500x500.jpg");
      } else {
        return "https://w1.sndcdn.com/AKjJbbNw4Pz6_m.png"; // TODO something else
      }
    }
  };

  AudioBlock.prototype.anchorMenuSnippet = function () {
    return this.reference.title;
  };


  return AudioBlock;

})(ContextBlock);
