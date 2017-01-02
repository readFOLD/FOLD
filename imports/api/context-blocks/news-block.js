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



export default NewsBlock = (function (_super) {
  __extends(NewsBlock, _super);

  function NewsBlock(doc) {
    NewsBlock.__super__.constructor.call(this, doc);
    this.type = 'news';
  }

  NewsBlock.prototype.title = function () {
    return this.reference.title || this.reference.originalUrl;
  };

  NewsBlock.prototype.introduction = function () {
    return this.reference.description || '';
  };

  NewsBlock.prototype.html = function () {
    return this.reference.content;
  };

  NewsBlock.prototype.headerImageUrl = function () {
    return this.reference.topImage ? this.reference.topImage.url : null;
  };

  NewsBlock.prototype.providerName = function () {
    return this.reference.providerName;
  };

  NewsBlock.prototype.providerIconUrl= function () {
    return this.reference.providerIconUrl;
  };
  //
  //NewsBlock.prototype.imageOnLeft = function () {
  //  return !this.reference.thumbnailUrl || (this.reference.thumbnailWidth / this.reference.thumbnailHeight) <= 1.25;
  //};

  NewsBlock.prototype.url = function () {
    return this.reference.url || this.reference.originalUrl;
  };

  NewsBlock.prototype.providerUrl = function () {
    return this.reference.providerUrl;
  };

  NewsBlock.prototype.providerTruncatedUrl = function () {
    return this.reference.providerUrl.replace(/(https?:\/\/)?(www\.)?/, "");
  };

  NewsBlock.prototype.anchorMenuSnippet = function () {
    return this.title();
  };
  return NewsBlock;

})(ContextBlock);
