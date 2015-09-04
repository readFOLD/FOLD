
// DEEPSTREAM

Deepstream = (function() {
  function Deepstream(doc) {
    _.extend(this, doc);
    var that = this;
    this.streams = _.map(this.streams, function(stream){
      return new Stream(stream);
    });
    this.contextBlocks = _.map(this.contextBlocks, function(contextBlock){
      return newTypeSpecificContextBlock(contextBlock);
    });
  }

  Deepstream.prototype.contextCountOfType = function(type) {
    return this.contextBlocks.reduce(function(count, contextBlock){
      if(contextBlock.type === type){
        count++;
      }
      return count;
    }, 0)
  };

  Deepstream.prototype.countContextTypes = function(){
    return _.chain(this.contextBlocks).pluck('type').countBy(_.identity).value()
  };

  Deepstream.prototype.contextOfType = function(type) {
    if (type === 'stream'){
      return []; // streams aren't context
    }

    return _.chain(this.contextBlocks)
      .where({type : type})
      .sortBy('date')
      .sortBy('rank')
      .value();
  };

  Deepstream.prototype.hasContextOfType = function(type) {
    if(type === 'chat'){
      return true // TODO this is a hack
    }
    return this.contextOfType(type).length;
  };

  Deepstream.prototype.mostRecentContext = function() {
    return this.contextBlocks ? _.last(_.sortBy(this.contextBlocks, 'addedAt')) : null;
  };

  Deepstream.prototype.mostRecentContextOfType = function(type) {
    if(this.hasContextOfType(type)){
      return this.contextBlocks ? _.last(_.sortBy(this.contextOfType(type), 'addedAt')) : null;
    }
  };

  Deepstream.prototype.mostRecentContextOfTypes = function(types) {
    var that = this;
    return _.chain(types)
      .map(function(type){
        return that.contextOfType(type)
      })
      .flatten()
      .sortBy('addedAt')
      .last()
      .value()
  };

  Deepstream.prototype.getContextById = function(contextId){
    return _.findWhere(this.contextBlocks, {_id: contextId});
  };

  Deepstream.prototype.nextContext = function(contextId) {
    if(!this.contextBlocks){
      return null;
    }
    var contextBlock = _.findWhere(this.contextBlocks, {_id: contextId});
    if(!contextBlock){
      return null;
    }
    var type = contextBlock.type;
    var contextOfType = this.contextOfType(type);
    if (contextOfType.length < 2){
      return null;
    }
    var index = _.indexOf(contextOfType, contextBlock);
    if (index < contextOfType.length - 1){
      return contextOfType[index + 1];
    } else {
      return _.first(contextOfType);
    }
  };
  Deepstream.prototype.previousContext = function(contextId) {
    if(!this.contextBlocks){
      return null;
    }
    var contextBlock = _.findWhere(this.contextBlocks, {_id: contextId});
    if(!contextBlock){
      return null;
    }
    var type = contextBlock.type;
    var contextOfType = this.contextOfType(type);
    if (contextOfType.length < 2){
      return null;
    }
    var index = _.indexOf(contextOfType, contextBlock);
    if (index > 0){
      return contextOfType[index - 1];
    } else {
      return _.last(contextOfType);
    }
  };

  Deepstream.prototype.activeStream = function(){
    return this.getStream(this.activeStreamId);
  };

  Deepstream.prototype.getStream = function(id){
    return _.findWhere(this.streams, {_id: id});
  };

  Deepstream.prototype.watchPath = function(){
    return '/watch/' + this.userPathSegment + '/' + this.streamPathSegment;
  };

  Deepstream.prototype.curatePath = function(){
    return '/curate/' + this.userPathSegment + '/' + this.streamPathSegment;
  };

  Deepstream.prototype.previewUrl = function(){
    var activeStream = this.activeStream();
    return activeStream ? activeStream.previewUrl() : null;
  };
  Deepstream.prototype.userStreamSwitchAllowed = function(){
    return !this.disallowUserStreamSwitch;
  };

  return Deepstream;

})();
