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



export default ActionBlock = (function (_super) {
  __extends(ActionBlock, _super);

  function ActionBlock(doc) {
    ActionBlock.__super__.constructor.call(this, doc);
    this.type = 'action';
  }

  ActionBlock.prototype.title = function () {
    return this.reference.title;
  };

  ActionBlock.prototype.actionDescription = function () {
    return this.reference.description || '';
  };

  ActionBlock.prototype.thumbnailUrl = function () {
    if(!this.override.thumbnailId){
      return
    }
    var url;
    url = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_lfill,g_center,h_130,w_520/' + this.override.thumbnailId;

    if(this.override.thumbnailFileExtension === 'gif'){
      url += '.jpg'
    }

    return url
  };

  ActionBlock.prototype.actionButtonText = function () {
    return this.reference.buttonText;
  };

  ActionBlock.prototype.actionButtonUrl = function () {
    return this.reference.buttonUrl;
  };

  ActionBlock.prototype.anchorMenuSnippet = function () {
    return this.title();
  };

  return ActionBlock;

})(ContextBlock);
