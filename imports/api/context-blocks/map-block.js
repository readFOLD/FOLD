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



export default MapBlock = (function (_super) {
  __extends(MapBlock, _super);

  function MapBlock(doc) {
    MapBlock.__super__.constructor.call(this, doc);
    this.type = 'map';
    if (this.source == null) {
      this.source = 'google_maps';
    }
  }

  MapBlock.prototype.longSnippet = function () {
    return this.reference.mapQuery;
  };

  MapBlock.prototype.anchorMenuSnippet = function () {
    return this.reference.mapQuery;
  };

  MapBlock.prototype.escape = function (value) {
    return encodeURIComponent(value).replace(/%20/g, "+");
  };

  MapBlock.prototype.url = function () {
    if (this.source === 'google_maps') {
      return 'https://www.google.com/maps/embed/v1/place?' + 'key=' + GOOGLE_API_CLIENT_KEY + '&q=' + this.escape(this.reference.mapQuery) + '&maptype=' + this.escape(this.reference.mapType);
    }
  };

  MapBlock.prototype.previewUrl = function (height, width) {
    height = height || 300;
    width = width || 520;
    if (this.source === 'google_maps') {
      return 'https://maps.googleapis.com/maps/api/staticmap?' + 'key=' + GOOGLE_API_CLIENT_KEY + '&center=' + this.escape(this.reference.mapQuery) + '&maptype=' + this.escape(this.reference.mapType) + '&size=' + width + 'x' + height + '&markers=color:red|' + this.escape(this.reference.mapQuery);
    }
  };

  return MapBlock;

})(ContextBlock);
