import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

if (Meteor.isServer){
  import cheerio from 'cheerio';
}

export const Story = (function() {
  function Story(doc) {
    _.extend(this, doc);
    if (this.draftStory){
      _.extend(this.draftStory, {
        unpublishedChanges: (!this.published || !this.publishedAt || this.savedAt > this.publishedAt),
        savedAt: this.savedAt,
        userPathSegment: this.userPathSegment,
        authorUsername: this.authorUsername,
        authorDisplayUsername: this.authorDisplayUsername,
        authorId: this.authorId,
        authorName: this.authorName,
        contextCountOfType (){}, // stub out for now
        narrativeCount (){}, // stub out for now
        countContextTypes (){}, // stub out for now
        headerImageUrl: this.headerImageUrl.bind(this.draftStory),
        headerImageVideoObject: this.headerImageVideoObject.bind(this.draftStory),
        _id: this._id
      });
    }
  }

  Story.prototype.readPath = function(){
    return '/read/' + this.userPathSegment + '/' + this.storyPathSegment;
  };

  Story.prototype.contentPreview = function() {
    var content;
    if (content = this.verticalSections[0].content) {
      if(Meteor.isClient){
        return $($.parseHTML(content)).text();
      } else {
        return cheerio.load('<body>' + content + '</body>')('body').text();
      }
    }
  };

  Story.prototype.updateAuthor = function(user) {
    if (user == null) {
      user = Meteor.user();
    }
    this.authorId = user._id;
    this.authorName = user.profile.name;
    return this.title = "";
  };

  Story.prototype.narrativeCount = function() {
    return this.verticalSections ? this.verticalSections.length : null;
  };

  Story.prototype.contextCount = function() {
    return this.contextBlocks.length;
  };

  Story.prototype.contextCountOfType = function(type) {
    return this.contextBlocks.reduce(function(count, contextBlock){
      if(contextBlock.type === type){
        count++;
      }
      return count;
    }, 0)
  };

  Story.prototype.countContextTypes = function(){
    return _.chain(this.contextBlocks).pluck('type').countBy(_.identity).value()
  };

  Story.prototype.headerImageUrl = function(size){
    return Story.getHeaderImageUrl(this.headerImage, size);
  };

  Story.prototype.headerImageVideoObject = function(size){
    return // looping video has chops occasionally, don't show it for now
    if (this.headerImageFormat ==='gif' && !Meteor.Device.isPhone()){
      var headerImageUrl = this.headerImageUrl(size);
      return {
        previewUrl: headerImageUrl + '.jpg',
        mp4Url: headerImageUrl + '.mp4',
        webMUrl: headerImageUrl + '.webm'
      }
    }
  };

  Story.prototype.maxActiveHeartbeats = function(){
    if(!this.analytics.heartbeats){
      return 0;
    }
    return _.chain(this.analytics.heartbeats.active)
      .omit(['story', 'header', 'footer'])
      .values()
      .max()
      .value()
  };

  Story.prototype.maxActiveNarrativeHeartbeats = function(){
    if(!this.analytics.heartbeats){
      return 0;
    }
    return _.chain(this.analytics.heartbeats.active)
      .pick(_.pluck(this.verticalSections, '_id'))
      .values()
      .max()
      .value()
  };

  Story.prototype.maxActiveContextHeartbeats = function(){
    if(!this.analytics.heartbeats){
      return 0;
    }
    return _.chain(this.analytics.heartbeats.active)
      .pick(this.contextBlockIds)
      .values()
      .max()
      .value()
  };

  Story.prototype.maxAnchorClicks = function(){
    if(!this.analytics.anchorClicks){
      return 0
    }
    return _.chain(this.analytics.anchorClicks)
      .values()
      .max()
      .value()
  };

  Story.getHeaderImageUrl = function(headerImageId, size){
    var image, imageFormat, url;
    image = headerImageId;


    var maxWidth = (size === 'small') ? 800 : 2048;
    var maxHeight = (size === 'small') ? 230 : 350;

    if (image) {
      if (image <= 13){ // if it's a placeholder image

        var headerAtmosphereMap = {
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

        var headerAtmosphereName = headerAtmosphereMap[image];

        if (!headerAtmosphereName){
          Meteor.defer(function(){
            throw new Meteor.Error('Header atmosphere not found');
          })
        }

        url = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_lfill,g_north,h_' + maxHeight + ',w_' + maxWidth + '/static/header_atmosphere_' + headerAtmosphereName

      } else {
        url = '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_lfill,g_north,h_' + maxHeight + ',w_' + maxWidth + '/' + image
      }
    }
    if(this.headerImageFormat === 'gif'){ // animated header image is static jpg on phone for now //if(Meteor.Device.isPhone() && this.headerImageFormat ==='gif'){
      url += '.jpg'; // TODO, this could conflict with headerImageVideoObject if conditional changes
    }
    return url
  };

  Story.prototype.embedCode = function(){
    return '<iframe width="100%" height="600" src="' + Meteor.absoluteUrl('embed/' + this.userPathSegment + '/' + this.storyPathSegment) + '" frameborder="0" allowfullscreen></iframe>' +
      '<script async src="' + Meteor.absoluteUrl('js/responsive-embed.js') + '"></script>'
  };

  return Story;

})();
