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



export default TextBlock = (function (_super) {
  __extends(TextBlock, _super);

  function TextBlock(doc) {
    TextBlock.__super__.constructor.call(this, doc);
    this.type = 'text';
    if (!this.source) {
      this.source = 'plaintext';
    }
  }

  TextBlock.prototype.longSnippet = function () {
    var maxLength;
    maxLength = 40;
    if (this.content.length <= maxLength) {
      return this.content;
    } else {
      return this.content.slice(0, maxLength) + '...';
    }
  };

  TextBlock.prototype.anchorMenuSnippet = function () {
    return this.content;
  };

  return TextBlock;

})(ContextBlock);

