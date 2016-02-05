var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };


SimpleSchema.debug = true; // TODO Remove after launch

if(!this.Schema){
  Schema = {};
};

Story = (function() {
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
        contextCountOfType:  function(){}, // stub out for now
        countContextTypes:  function(){}, // stub out for now
        headerImageUrl: this.headerImageUrl.bind(this.draftStory),
        headerImageVideoObject: this.headerImageVideoObject.bind(this.draftStory),
        _id: this._id
      });
    }
  }

  Story.prototype.contentPreview = function() {
    var content;
    if (content = this.verticalSections[0].content) {
      return $($.parseHTML(content)).text();
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

  var sum = function(a,b){ return a+b; };

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
    var image, imageFormat, url;
    image = this.headerImage;


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
          throw new Meteor.Error('Header atmosphere not found');
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
  }

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
  }

  Story.prototype.maxActiveHeartbeats = function(){
    return _.chain(this.analytics.heartbeats.active)
      .omit(['story', 'header', 'footer'])
      .values()
      .max()
      .value()
  }

  return Story;

})();

// TO-DO consider replacing htmlclean with https://github.com/cristo-rabani/meteor-universe-html-purifier/
var cleanHtmlOptions = {
  allowedTags: ['strong', 'em', 'u', 'b', 'a', 'br'], // only allow tags used in fold-editor and
  format: false,
  removeTags: [], // allow u tag
  removeAttrs: ['class', 'id', 'href'], // strip away hrefs and other undesired attributes that might slip into a paste
  allowedAttributes: [["data-context-id"],["data-context-type"],["data-context-source"]] // data-context-id is used to direct links to context cards
};

var matchAnchors =  /<a( data-context-[a-z]*?=["|'].*?["|'])?( data-context-[a-z]*?=["|'].*?["|'])?( data-context-[a-z]*?=["|'].*?["|'])?.*?>/gm; // match anchors, capture data-context-id and other attributes so it can be kept in string
var matchBlankAnchors = /<a href="javascript:void\(0\);">(.*?)<\/a>/gm; // match anchors that are left over from above if copied from somewhere else, capture contents so can be kept

cleanVerticalSectionContent = function(html) {


  var initialClean = $.htmlClean(html, _.extend({}, _.omit(cleanHtmlOptions, 'allowedTags'), {allowEmpty: ['div']})); // do all cleaning except tag removal. allowEmpty means <div><br></div> turns into <div></div> instead of being deleted entirely
  
  var linebreakClean = initialClean
    .replace(new RegExp('<br />', 'g'), '<br>')
    .replace(new RegExp('<div><br></div>', 'g'), '<br>')
    .replace(new RegExp('<div>', 'g'), '<br>')
    .replace(new RegExp('</div>', 'g'), '');

  return $.htmlClean(linebreakClean, cleanHtmlOptions)
    .replace(matchAnchors, '<a href="javascript:void(0);"$1$2$3>') // add js void to all anchors and keep all data-context-ids and other data attributes
    .replace(matchBlankAnchors, '$1') // remove anchors without data-context-ids
    .replace(new RegExp('<br />', 'g'), '<br>');

};

if (Meteor.isClient) {
  window.Story = Story;
  window.cleanVerticalSectionContent = cleanVerticalSectionContent;
}

this.Stories = new Mongo.Collection("stories", {
  transform: function(doc) {
    return new Story(doc);
  }
});

this.Stories.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true
  },
  remove: function() {
    return true;
  }
});

ContextBlocks = new Mongo.Collection("context_blocks", {
  transform: newTypeSpecificContextBlock
});



this.ContextBlocks.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true
  },
  remove: function() {
    return true
  }
});

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

var getIdFromUrl = function(url){
  return _.chain(url.split('/')).compact().last().value().match(/[\d]*/)[0]
};

var parseDate = function(date) {
  return date.substring(0,10).replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1");
};


ContextBlock = (function () {
  function ContextBlock(doc) {
    _.extend(this, doc);
  }

  return ContextBlock;
})();


youtubeMapFn = function (e) {
  return {
    reference: {
      title: e.title,
      description: e.description,
      id: e.videoId,
      username: e.channelTitle,
      userId: e.channelId,
      creationDate: parseDate(e.publishedAt)
    },
    source: 'youtube'
  }
};

ustreamMapFn = function (e) { // this is post-insert from pre-loading ustream results
  return {
    reference: {
      title: e.title,
      description: $($.parseHTML(e.description)).text(),
      id: e.id,
      username: e.username,
      currentViewers: e.currentViewers,
      thumbnailUrl: e.imageUrl.small,
      previewUrl: e.imageUrl.medium,
      totalViews: e.totalViews,
      userId: e.userId,
      creationDate: parseDate(e.createdAt) // TODO: is this a correct way to parse these dates... at all...
    },
    source: 'ustream'
  }
};

bambuserMapFn = function (e) {
  return {
    reference: {
      title: e.title,
      id: e.vid,
      username: e.username,
      currentViewers: e.currentViewers,
      totalViews: e.totalViews,
      userId: e.owner.uid,
      creationDate: new Date(e.created)
    },
    source: 'bambuser'
  }
};

ContextBlock.searchMappings = {
  all_streaming_services: {
    methodName: 'streamSearchList',
    mapFn: function (e) {
      switch (e._source) {
        case 'youtube':
          return youtubeMapFn(e);
        case 'bambuser':
          return bambuserMapFn(e);
        case 'ustream':
          return ustreamMapFn(e);
        default:
          throw new Meteor.Error('Unknown stream source')
      }
    }
  },
  youtube: {
    methodName: 'youtubeVideoSearchList',
    mapFn: youtubeMapFn
  },
  bambuser: {
    methodName: 'bambuserVideoSearchList',
    mapFn: bambuserMapFn
  },
  ustream: {
    methodName: 'ustreamVideoSearchList',
    mapFn: ustreamMapFn
  },
  vimeo: {
    methodName: 'vimeoVideoSearchList',
    mapFn: function (e) {
      return {
        reference: {
          title: e.name,
          description: e.description,
          id: getIdFromUrl(e.uri),
          username: e.user.name,
          creationDate: parseDate(e.created_time),
          previewImage: getIdFromUrl(e.pictures.uri)
        }
      }
    }
  },
  soundcloud: {
    methodName: 'soundcloudAudioSearchList',
    mapFn: function (e) {
      return {
        reference: {
          title: e.title,
          description: e.description,
          id: e.id,
          username: e.channelTitle,
          userId: e.user_id,
          creationDate: parseDate(e.created_at),
          artworkUrl: e.artwork_url
        }
      }
    }
  },
  twitter: {
    methodName: 'twitterSearchList',
    mapFn: function (e) {
      var item = {
        reference: {
          text: e.text,
          extendedEntities: e.extended_entities,
          retweetedStatus: e.retweeted_status,
          entities: e.entities,
          id: e.id_str,
          username: e.user.name,
          screenname: e.user.screen_name,
          userPic: e.user.profile_image_url_https,
          creationDate: e.created_at.substring(0, 19)
        }
      };
      return item;
    }
  },
  imgur: {
    methodName: 'imgurImageSearchList',
    mapFn: function (e) {
      return {
        reference: {
          id: e.id,
          username: e.account_url,
          userId: e.account_id,
          fileExtension: e.link.substring(e.link.lastIndexOf('.') + 1),
          title: e.title,
          hasMP4: e.mp4 ? true : false,
          hasWebM: e.webm ? true : false
        }
      }
    }
  },
  flickr: {
    methodName: 'flickrImageSearchList',
    mapFn: function (e) {
      var username, uploadDate, title, lgUrl, lgHeight, lgWidth, flickrSecretOrig, formatOrig;
      if (e.media) {
        //if single image result
        ownername = e.owner.username;
        flickrOwnerId = e.owner.nsid;
        uploadDate = e.dateuploaded;
        title = e.title._content;
      } else {
        //if search result
        ownername = e.ownername;
        flickrOwnerId = e.owner;
        uploadDate = e.dateupload;
        title = e.title;
      }

      var info = {
        reference: {
          ownerName: ownername,
          flickrOwnerId: flickrOwnerId,
          uploadDate: new Date(parseInt(uploadDate) * 1000),
          flickrFarm: e.farm,
          flickrSecret: e.secret,
          id: e.id,
          flickrServer: e.server,
          title: title
        }
      };

      if(e.originalsecret && e.originalformat){ // check if original is available
        _.extend(info.reference, {
          flickrSecretOrig: e.originalsecret,
          flickrFormatOrig:  e.originalformat
        })
      } else {
        // find the largest version of image available
        _.each(['z', 'c', 'l', 'h', 'k', 'o'], function(sizeSuffix){
          if(e['url_'+ sizeSuffix]){
            lgUrl = e['url_'+ sizeSuffix];
            lgHeight = e['height_'+ sizeSuffix];
            lgWidth = e['width_'+ sizeSuffix];
          }
        });
        if(lgUrl){
          _.extend(info.reference, {
            lgUrl: lgUrl,
            lgHeight: lgHeight,
            lgWidth: lgWidth
          })
        }
      }

      return info
    }
  },
  cloudinary: {
    notSearch: true
  },
  giphy: {
    methodName: 'giphyGifSearchList',
    mapFn: function (e) {
      return {
        reference: {
          id: e.id,
          username: e.username,
          source: e.source
        }
      }
    }
  }
};

Stream = (function (_super) {
  __extends(Stream, _super);

  function Stream(doc) {
    Stream.__super__.constructor.call(this, doc);
    this.type = 'stream';
  }

  Stream.prototype.videoId = function () {
    //if (this.source === 'youtube') {
    return this.reference.id;
    //}
  };

  Stream.prototype.title = function () {
    //if (this.source === 'youtube') {
    return this.reference.title;
    //}
  };

  Stream.prototype.createdAtString = function () {
    return this.reference.creationDate;
  };

  Stream.prototype.caption = function () {
    //if (this.source === 'youtube') {
    return this.reference.description;
    //}
  };

  Stream.prototype.username = function () {
    //if (this.source === 'youtube') {
    return this.reference.username;
    //}
  };

  Stream.prototype.currentViewers = function () {
    if(this.source ==='youtube'){ // TODO get this for each video
      return 431;
    }
    return this.reference.currentViewers;
  };
  Stream.prototype.totalViews = function () {
    if(this.source ==='youtube'){ // TODO get this for each video
      return 59274;
    }
    return this.reference.totalViews;
  };

  Stream.prototype.creationDate = function () {
    if (this.source === 'youtube') {
      return this.reference.creationDate
    }
  };

  Stream.prototype.autoplayUrl = function(){
    if (this.source === 'bambuser') {
      return this.url() + "&autoplay=1";
    } else {
      return this.url() + "&autoplay=true";
    }
  };

  Stream.prototype.url = function () {
    if (this.source === 'youtube') {
      return '//www.youtube.com/embed/' + this.reference.id + '?enablejsapi=1&modestbranding=1&rel=0&iv_load_policy=3&autohide=1';
    } else if (this.source === 'ustream') {
      return 'https://www.ustream.tv/embed/' + this.reference.id + '?v=3&wmode=direct';
    } else if (this.source === 'bambuser') {
      return '//embed.bambuser.com/broadcast/' + this.reference.id + '?chat=0';
    }
  };

  Stream.prototype.previewUrl = function () {
    if (this.source === 'youtube') {
      return '//img.youtube.com/vi/' + this.reference.id + '/0.jpg';
    } else {
      return this.reference.previewUrl;
    }
  };

  Stream.prototype.thumbnailUrl = function () {
    if (this.source === 'youtube') {
      return '//i.ytimg.com/vi/' + this.reference.id + '/default.jpg';
    } else {
      return this.reference.thumbnailUrl;
    }
  };

  Stream.prototype.sourceUrl = function () {
    if (this.source === 'youtube') {
      return 'https://www.youtube.com/watch?v=' + this.reference.id;
    } else if (this.source === 'ustream') {
      return 'https://www.ustream.tv/channel/' + this.reference.id;
    }
  };

  return Stream;

})(ContextBlock);



VideoBlock = (function (_super) {
  __extends(VideoBlock, _super);

  function VideoBlock(doc) {
    VideoBlock.__super__.constructor.call(this, doc);
    this.type = 'video';
    if (this.source == null) {
      this.source = 'youtube';
    }
  }

  VideoBlock.prototype.title = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.title
    }
  };

  VideoBlock.prototype.caption = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.description
    }
  };

  VideoBlock.prototype.username = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.username
    }
  };

  VideoBlock.prototype.creationDate = function () {
    if (this.source === 'youtube' || this.source === 'vimeo') {
      return this.reference.creationDate
    }
  };

  VideoBlock.prototype.url = function () {
    if (this.source === 'youtube') {
      return '//www.youtube.com/embed/' + this.reference.id + '?fs=0';
    } else if (this.source === 'vimeo') {
      return '//player.vimeo.com/video/' + this.reference.id;
    }
  };

  VideoBlock.prototype.autoplayUrl= function () {
    return this.url() + '?autoplay=true'
  };

  VideoBlock.prototype.previewUrl = function () {
    if (this.source === 'youtube') {
      return '//img.youtube.com/vi/' + this.reference.id + '/0.jpg';
    } else if (this.source === 'vimeo') {
      return '//i.vimeocdn.com/video/' + this.reference.previewImage + '_640x359.jpg'
    }
  };

  VideoBlock.prototype.thumbnailUrl = function () {
    if (this.source === 'youtube') {
      return '//i.ytimg.com/vi/' + this.reference.id + '/default.jpg';
    } else if (this.source === 'vimeo') {
      return '//i.vimeocdn.com/video/' + this.reference.previewImage + '_100x75.jpg'
    }
  };

  VideoBlock.prototype.anchorMenuSnippet = function () {
    return this.reference.title;
  };

  return VideoBlock;

})(ContextBlock);

AudioBlock = (function (_super) {
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

TwitterBlock = (function (_super) {
  __extends(TwitterBlock, _super);

  function TwitterBlock(doc) {
    TwitterBlock.__super__.constructor.call(this, doc);
    this.type = 'twitter';
    if (this.source == null) {
      this.source = 'twitter';
    }
  }

  TwitterBlock.prototype.userpic = function () {
    return this.reference.userPic
  };

  TwitterBlock.prototype.username = function () {
    return this.reference.username
  };

  TwitterBlock.prototype.screenname = function () {
    return this.reference.screenname
  };

  TwitterBlock.prototype.text = function () {
    return this.reference.userPic
  };

  TwitterBlock.prototype.date = function () {
    return this.reference.creationDate
  };

  TwitterBlock.prototype.tweet_url = function () {
    return '//twitter.com/' + this.reference.screenname + '/status/' + this.reference.id
  };

  TwitterBlock.prototype.user_url = function () {
    return '//twitter.com/' + this.reference.screenname
  };

  TwitterBlock.prototype.twitter_url = function () {
    return '//twitter.com/'
  };

  TwitterBlock.prototype.retweet_action = function () {
    return '//twitter.com/intent/retweet?tweet_id=' + this.reference.id
  };

  TwitterBlock.prototype.reply_action = function () {
    return '//twitter.com/intent/tweet?in_reply_to=' + this.reference.id
  };

  TwitterBlock.prototype.favorite_action = function () {
    return '//twitter.com/intent/favorite?tweet_id=' + this.reference.id
  };

  TwitterBlock.prototype.imgUrl = function () {
    var imgUrl;
    if (this.extendedEntities) {
      imgUrl = this.extendedEntities.media[0].media_url_https;
    }
    if (this.reference.retweetedStatus) {
      if (this.reference.retweetedStatus.entities.media) {
        imgUrl = this.reference.retweetedStatus.entities.media[0].media_url
      }
    } else {
      if (this.reference.entities.media) {
        imgUrl = this.reference.entities.media[0].media_url
      }
    }
    return imgUrl
  };

  TwitterBlock.prototype.retweet_url = function () {
    return '//twitter.com/' + this.reference.retweetedStatus.user.screen_name
  };

  TwitterBlock.prototype.retweetUser = function () {
    if (this.reference.retweetedStatus) {
      return this.reference.retweetedStatus.user.screen_name;
    }
  };

  TwitterBlock.prototype.anchorMenuSnippet = function () {
    return this.reference.text;
  };

  TwitterBlock.prototype.links = function () {

    if (this.reference.retweetedStatus) {
      var urls = this.reference.retweetedStatus.entities.urls;
    } else {
      var urls = this.reference.entities.urls;
    }
    return urls
  };

  TwitterBlock.prototype.formattedTweet = function () {
    var text = this.reference.text; // twttr seems to be escaping appropriately itself

    if (this.imgUrl()) {
      var imgIndex = text.lastIndexOf("https://") || text.lastIndexOf("http://");
      text = text.substring(0, imgIndex);
    }

    return twttr.txt.autoLink(text, {
      urlEntities: this.links(),
      targetBlank: true
    });
  };

  return TwitterBlock;

})(ContextBlock);

ImageBlock = (function (_super) {
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

GifBlock = (function (_super) {
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


VizBlock = (function (_super) {
  __extends(VizBlock, _super);

  function VizBlock(doc) {
    VizBlock.__super__.constructor.call(this, doc);
    this.type = 'viz';
  }

  VizBlock.prototype.url = function () {
    switch (this.source) {
      case 'oec':
        return '//atlas.media.mit.edu/en/explore/embed/tree_map/hs/' + this.reference.oecDirection + '/' + this.reference.oecCountry + '/all/show/' + this.reference.oecYear + '/?controls=false&lang=en'
    }
  };

  VizBlock.prototype.linkUrl = function () {
    switch (this.source) {
      case 'oec':
        return '//atlas.media.mit.edu/en/visualize/tree_map/hs/' + this.reference.oecDirection + '/' + this.reference.oecCountry + '/all/show/' + this.reference.oecYear
    }
  };

  VizBlock.countries = [{"id": "ago", "name": "Angola"}, {"id": "bdi", "name": "Burundi"}, {
    "id": "ben",
    "name": "Benin"
  }, {"id": "bfa", "name": "Burkina Faso"}, {"id": "bwa", "name": "Botswana"}, {
    "id": "caf",
    "name": "Central African Republic"
  }, {"id": "civ", "name": "Cote d'Ivoire"}, {"id": "cmr", "name": "Cameroon"}, {
    "id": "cod",
    "name": "Democratic Republic of the Congo"
  }, {"id": "cog", "name": "Republic of the Congo"}, {"id": "com", "name": "Comoros"}, {
    "id": "cpv",
    "name": "Cape Verde"
  }, {"id": "dji", "name": "Djibouti"}, {"id": "dza", "name": "Algeria"}, {"id": "egy", "name": "Egypt"}, {
    "id": "eri",
    "name": "Eritrea"
  }, {"id": "esh", "name": "Western Sahara"}, {"id": "eth", "name": "Ethiopia"}, {
    "id": "gab",
    "name": "Gabon"
  }, {"id": "gha", "name": "Ghana"}, {"id": "gin", "name": "Guinea"}, {"id": "gmb", "name": "Gambia"}, {
    "id": "gnb",
    "name": "Guinea-Bissau"
  }, {"id": "gnq", "name": "Equatorial Guinea"}, {"id": "ken", "name": "Kenya"}, {
    "id": "lbr",
    "name": "Liberia"
  }, {"id": "lby", "name": "Libya"}, {"id": "lso", "name": "Lesotho"}, {"id": "mar", "name": "Morocco"}, {
    "id": "mdg",
    "name": "Madagascar"
  }, {"id": "mli", "name": "Mali"}, {"id": "moz", "name": "Mozambique"}, {
    "id": "mrt",
    "name": "Mauritania"
  }, {"id": "mus", "name": "Mauritius"}, {"id": "mwi", "name": "Malawi"}, {
    "id": "myt",
    "name": "Mayotte"
  }, {"id": "nam", "name": "Namibia"}, {"id": "ner", "name": "Niger"}, {"id": "nga", "name": "Nigeria"}, {
    "id": "reu",
    "name": "Reunion"
  }, {"id": "rwa", "name": "Rwanda"}, {"id": "sdn", "name": "Sudan"}, {"id": "sen", "name": "Senegal"}, {
    "id": "shn",
    "name": "Saint Helena"
  }, {"id": "sle", "name": "Sierra Leone"}, {"id": "som", "name": "Somalia"}, {
    "id": "ssd",
    "name": "South Sudan"
  }, {"id": "stp", "name": "Sao Tome and Principe"}, {"id": "swz", "name": "Swaziland"}, {
    "id": "syc",
    "name": "Seychelles"
  }, {"id": "tcd", "name": "Chad"}, {"id": "tgo", "name": "Togo"}, {"id": "tun", "name": "Tunisia"}, {
    "id": "tza",
    "name": "Tanzania"
  }, {"id": "uga", "name": "Uganda"}, {"id": "zaf", "name": "South Africa"}, {
    "id": "zmb",
    "name": "Zambia"
  }, {"id": "zwe", "name": "Zimbabwe"}, {"id": "ata", "name": "Antarctica"}, {
    "id": "atf",
    "name": "French South Antarctic Territory"
  }, {"id": "bvt", "name": "Bouvet Island"}, {"id": "hmd", "name": "Heard Island and McDonald Islands"}, {
    "id": "sgs",
    "name": "South Georgia South Sandwich Islands"
  }, {"id": "afg", "name": "Afghanistan"}, {"id": "are", "name": "United Arab Emirates"}, {
    "id": "arm",
    "name": "Armenia"
  }, {"id": "aze", "name": "Azerbaijan"}, {"id": "bgd", "name": "Bangladesh"}, {
    "id": "bhr",
    "name": "Bahrain"
  }, {"id": "brn", "name": "Brunei"}, {"id": "btn", "name": "Bhutan"}, {
    "id": "cck",
    "name": "Cocos (Keeling) Islands"
  }, {"id": "chn", "name": "China"}, {"id": "cxr", "name": "Christmas Island"}, {
    "id": "cyp",
    "name": "Cyprus"
  }, {"id": "geo", "name": "Georgia"}, {"id": "hkg", "name": "Hong Kong"}, {
    "id": "idn",
    "name": "Indonesia"
  }, {"id": "ind", "name": "India"}, {"id": "iot", "name": "British Indian Ocean Territory"}, {
    "id": "irn",
    "name": "Iran"
  }, {"id": "irq", "name": "Iraq"}, {"id": "isr", "name": "Israel"}, {"id": "jor", "name": "Jordan"}, {
    "id": "jpn",
    "name": "Japan"
  }, {"id": "kaz", "name": "Kazakhstan"}, {"id": "kgz", "name": "Kyrgyzstan"}, {
    "id": "khm",
    "name": "Cambodia"
  }, {"id": "kor", "name": "South Korea"}, {"id": "kwt", "name": "Kuwait"}, {"id": "lao", "name": "Laos"}, {
    "id": "lbn",
    "name": "Lebanon"
  }, {"id": "lka", "name": "Sri Lanka"}, {"id": "mac", "name": "Macau"}, {
    "id": "mdv",
    "name": "Maldives"
  }, {"id": "mid", "name": "Midway"}, {"id": "mmr", "name": "Burma"}, {"id": "mng", "name": "Mongolia"}, {
    "id": "mys",
    "name": "Malaysia"
  }, {"id": "npl", "name": "Nepal"}, {"id": "omn", "name": "Oman"}, {"id": "pak", "name": "Pakistan"}, {
    "id": "phl",
    "name": "Philippines"
  }, {"id": "prk", "name": "North Korea"}, {"id": "pse", "name": "Palestine"}, {
    "id": "qat",
    "name": "Qatar"
  }, {"id": "sau", "name": "Saudi Arabia"}, {"id": "sgp", "name": "Singapore"}, {
    "id": "syr",
    "name": "Syria"
  }, {"id": "tha", "name": "Thailand"}, {"id": "tjk", "name": "Tajikistan"}, {
    "id": "tkm",
    "name": "Turkmenistan"
  }, {"id": "tls", "name": "Timor-Leste"}, {"id": "tur", "name": "Turkey"}, {
    "id": "twn",
    "name": "Taiwan"
  }, {"id": "uzb", "name": "Uzbekistan"}, {"id": "vnm", "name": "Vietnam"}, {
    "id": "yar",
    "name": "Yemen Arab Republic"
  }, {"id": "yem", "name": "Yemen"}, {"id": "ymd", "name": "Democratic Yemen"}, {
    "id": "alb",
    "name": "Albania"
  }, {"id": "and", "name": "Andorra"}, {"id": "aut", "name": "Austria"}, {"id": "bel", "name": "Belgium"}, {
    "id": "bgr",
    "name": "Bulgaria"
  }, {"id": "bih", "name": "Bosnia and Herzegovina"}, {"id": "blr", "name": "Belarus"}, {
    "id": "blx",
    "name": "Belgium-Luxembourg"
  }, {"id": "che", "name": "Switzerland"}, {"id": "chi", "name": "Channel Islands"}, {
    "id": "csk",
    "name": "Czechoslovakia"
  }, {"id": "cze", "name": "Czech Republic"}, {"id": "ddr", "name": "Democratic Republic of Germany"}, {
    "id": "deu",
    "name": "Germany"
  }, {"id": "dnk", "name": "Denmark"}, {"id": "esp", "name": "Spain"}, {"id": "est", "name": "Estonia"}, {
    "id": "fdr",
    "name": "Federal Republic of Germany"
  }, {"id": "fin", "name": "Finland"}, {"id": "fra", "name": "France"}, {
    "id": "fro",
    "name": "Faroe Islands"
  }, {"id": "gbr", "name": "United Kingdom"}, {"id": "gib", "name": "Gibraltar"}, {
    "id": "grc",
    "name": "Greece"
  }, {"id": "hrv", "name": "Croatia"}, {"id": "hun", "name": "Hungary"}, {
    "id": "imn",
    "name": "Isle of Man"
  }, {"id": "irl", "name": "Ireland"}, {"id": "isl", "name": "Iceland"}, {"id": "ita", "name": "Italy"}, {
    "id": "ksv",
    "name": "Kosovo"
  }, {"id": "lie", "name": "Liechtenstein"}, {"id": "ltu", "name": "Lithuania"}, {
    "id": "lux",
    "name": "Luxembourg"
  }, {"id": "lva", "name": "Latvia"}, {"id": "mco", "name": "Monaco"}, {"id": "mda", "name": "Moldova"}, {
    "id": "mkd",
    "name": "Macedonia"
  }, {"id": "mlt", "name": "Malta"}, {"id": "mne", "name": "Montenegro"}, {
    "id": "nld",
    "name": "Netherlands"
  }, {"id": "nor", "name": "Norway"}, {"id": "pol", "name": "Poland"}, {"id": "prt", "name": "Portugal"}, {
    "id": "rou",
    "name": "Romania"
  }, {"id": "rus", "name": "Russia"}, {"id": "scg", "name": "Serbia and Montenegro"}, {
    "id": "sjm",
    "name": "Svalbard"
  }, {"id": "smr", "name": "San Marino"}, {"id": "srb", "name": "Serbia"}, {"id": "sun", "name": "USSR"}, {
    "id": "svk",
    "name": "Slovakia"
  }, {"id": "svn", "name": "Slovenia"}, {"id": "swe", "name": "Sweden"}, {"id": "ukr", "name": "Ukraine"}, {
    "id": "vat",
    "name": "Holy See (Vatican City)"
  }, {"id": "yug", "name": "Yugoslavia"}, {"id": "abw", "name": "Aruba"}, {
    "id": "aia",
    "name": "Anguilla"
  }, {"id": "ant", "name": "Netherlands Antilles"}, {"id": "atg", "name": "Antigua and Barbuda"}, {
    "id": "bes",
    "name": "Bonaire"
  }, {"id": "bhs", "name": "Bahamas"}, {"id": "blz", "name": "Belize"}, {"id": "bmu", "name": "Bermuda"}, {
    "id": "brb",
    "name": "Barbados"
  }, {"id": "can", "name": "Canada"}, {"id": "cri", "name": "Costa Rica"}, {"id": "cub", "name": "Cuba"}, {
    "id": "cuw",
    "name": "Cura\u00e7ao"
  }, {"id": "cym", "name": "Cayman Islands"}, {"id": "dma", "name": "Dominica"}, {
    "id": "dom",
    "name": "Dominican Republic"
  }, {"id": "grd", "name": "Grenada"}, {"id": "grl", "name": "Greenland"}, {
    "id": "gtm",
    "name": "Guatemala"
  }, {"id": "hnd", "name": "Honduras"}, {"id": "hti", "name": "Haiti"}, {"id": "jam", "name": "Jamaica"}, {
    "id": "kna",
    "name": "Saint Kitts and Nevis"
  }, {"id": "lca", "name": "Saint Lucia"}, {"id": "maf", "name": "Saint Maarten"}, {
    "id": "mex",
    "name": "Mexico"
  }, {"id": "msr", "name": "Montserrat"}, {"id": "mtq", "name": "Martinique"}, {
    "id": "naa",
    "name": "Netherland Antilles and Aruba"
  }, {"id": "nic", "name": "Nicaragua"}, {"id": "pan", "name": "Panama"}, {
    "id": "pci",
    "name": "Pacific Island (US)"
  }, {"id": "pcz", "name": "Panama Canal Zone"}, {"id": "pri", "name": "Puerto Rico"}, {
    "id": "slv",
    "name": "El Salvador"
  }, {"id": "spm", "name": "Saint Pierre and Miquelon"}, {
    "id": "tca",
    "name": "Turks and Caicos Islands"
  }, {"id": "tto", "name": "Trinidad and Tobago"}, {
    "id": "umi",
    "name": "United States Minor Outlying Islands"
  }, {"id": "usa", "name": "United States"}, {"id": "vct", "name": "Saint Vincent and the Grenadines"}, {
    "id": "vgb",
    "name": "British Virgin Islands"
  }, {"id": "vir", "name": "Virgin Islands"}, {"id": "asm", "name": "American Samoa"}, {
    "id": "aus",
    "name": "Australia"
  }, {"id": "cok", "name": "Cook Islands"}, {"id": "fji", "name": "Fiji"}, {
    "id": "fsm",
    "name": "Micronesia"
  }, {"id": "glp", "name": "Guadeloupe"}, {"id": "gum", "name": "Guam"}, {
    "id": "kir",
    "name": "Kiribati"
  }, {"id": "mhl", "name": "Marshall Islands"}, {"id": "mnp", "name": "Northern Mariana Islands"}, {
    "id": "ncl",
    "name": "New Caledonia"
  }, {"id": "nfk", "name": "Norfolk Island"}, {"id": "niu", "name": "Niue"}, {
    "id": "nru",
    "name": "Nauru"
  }, {"id": "nzl", "name": "New Zealand"}, {"id": "pcn", "name": "Pitcairn Islands"}, {
    "id": "plw",
    "name": "Palau"
  }, {"id": "png", "name": "Papua New Guinea"}, {"id": "pyf", "name": "French Polynesia"}, {
    "id": "slb",
    "name": "Solomon Islands"
  }, {"id": "tkl", "name": "Tokelau"}, {"id": "ton", "name": "Tonga"}, {"id": "tuv", "name": "Tuvalu"}, {
    "id": "vut",
    "name": "Vanuatu"
  }, {"id": "wlf", "name": "Wallis and Futuna"}, {"id": "wsm", "name": "Samoa"}, {
    "id": "arg",
    "name": "Argentina"
  }, {"id": "bol", "name": "Bolivia"}, {"id": "bra", "name": "Brazil"}, {"id": "chl", "name": "Chile"}, {
    "id": "col",
    "name": "Colombia"
  }, {"id": "ecu", "name": "Ecuador"}, {"id": "flk", "name": "Falkland Islands"}, {
    "id": "guf",
    "name": "French Guiana"
  }, {"id": "guy", "name": "Guyana"}, {"id": "per", "name": "Peru"}, {"id": "pry", "name": "Paraguay"}, {
    "id": "sur",
    "name": "Suriname"
  }, {"id": "ury", "name": "Uruguay"}, {"id": "ven", "name": "Venezuela"}, {"id": "wld", "name": "World"}, {
    "id": "xxa",
    "name": "Areas"
  }];

  VizBlock.prototype.oecCountryName = function () {
    switch (this.source) {
      case 'oec':
        if (this.reference.oecCountry) {
          return _.findWhere(VizBlock.countries, {id: this.reference.oecCountry})['name'];
        }
    }
  };


  VizBlock.prototype.longSnippet = function () {
    switch (this.source) {
      case 'oec':
        return this.oecCountryName() + " " + this.reference.oecDirection + "s in " + this.reference.oecYear;
    }
  };

  VizBlock.prototype.anchorMenuSnippet = function () {
    switch (this.source) {
      case 'oec':
        return this.oecCountryName() + " (" + this.reference.oecYear + ")";
    }
  };

  return VizBlock;

})(ContextBlock);


MapBlock = (function (_super) {
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

TextBlock = (function (_super) {
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

LinkBlock = (function (_super) {
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
    return this.thumbnailOverrideUrl() || this.reference.thumbnailUrl || '//res.cloudinary.com/fold/image/upload/v1/static/LINK_SQUARE.svg';
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

NewsBlock = (function (_super) {
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


Schema.ContextReferenceProfile = new SimpleSchema({
  id: {
    type: String,
    optional: true
  },

  creationDate: {
    type: String,
    optional: true
  },

  username: {
    type: String,
    optional: true
  },

  userId: {
    type: String,
    optional: true
  },

  source: {
    type: String,
    optional: true
  },

  artworkUrl: {
    type: String,
    optional: true
  },

  previewImage: {
    type: String,
    optional: true
  },

  title: {
    type: String,
    optional: true,
    defaultValue: ''
  },

  description: {
    type: String,
    optional: true,
    defaultValue: ''
  },
  fileExtension: {
    type: String,
    optional: true
  },

  // Image


  flickrOwnerId: {
    type: String,
    optional: true
  },
  flickrFarm: {
    type: String,
    optional: true
  },
  flickrSecret: {
    type: String,
    optional: true
  },
  flickrServer: {
    type: String,
    optional: true
  },
  flickrSecretOrig: {
    type: String,
    optional: true
  },
  flickrFormatOrig: {
    type: String,
    optional: true
  },
  lgUrl: {
    type: String,
    optional: true
  },
  lgHeight: {
    type: String,
    optional: true
  },
  lgWidth: {
    type: String,
    optional: true
  },
  uploadDate: {
    type: Date,
    optional: true
  },
  ownerName: {
    type: String,
    optional: true
  },

  hasWebM: {
    type: Boolean,
    optional: true
  },

  hasMP4: {
    type: Boolean,
    optional: true
  },



  // Image upload
  width: {
    type: Number,
    optional: true
  },
  height: {
    type: Number,
    optional: true
  },

  // twitter
  retweet: {
    type: String,
    optional: true
  },
  creationDate: {
    type: String,
    optional: true
  },
  username: {
    type: String,
    optional: true
  },
  screenname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  userPic: {
    type: String,
    optional: true
  },
  text: {
    type: String,
    optional: true
  },
  entities: {
    type: Object,
    optional: true,
    blackbox: true
  },
  extendedEntities: {
    type: Object,
    optional: true,
    blackbox: true
  },
  retweetedStatus: {
    type: Object,
    optional: true,
    blackbox: true
  },

  // Link
  title: { type: String, optional: true },
  thumbnailUrl: { type: String, optional: true },
  url: { type: String, optional: true },
  originalUrl: { type: String, optional: true },
  providerName: { type: String, optional: true },
  providerUrl: { type: String, optional: true },
  authorUrl: { type: String, optional: true },
  authorName: { type: String, optional: true },
  thumbnailHeight: { type: Number, optional: true },
  thumbnailWidth: { type: Number, optional: true },
  embedlyType: { type: String, optional: true },
  imageOnLeft: { type: Boolean, optional: true },

  // Rich or Extract
  html: { type: String, optional: true },

  // OEC
  oecYear: {
    type: String,
    optional: true
  },
  oecCountry: {
    type: String,
    optional: true
  },
  oecDirection: {
    type: String,
    optional: true
  },

  mapQuery: {
    type: String,
    optional: true
  },
  mapType: {
    type: String,
    allowedValues: ['roadmap', 'satellite'],
    optional: true,
    autoform: {
      afFieldInput: {
        firstOption: false,
        options: 'allowed'
      }
    }
  },
  // link override
  thumbnailId: {
    type: String,
    optional: true
  },
  thumbnailFileExtension: {
    type: String,
    optional: true
  },


});

Schema.ContextBlocks = new SimpleSchema({
  storyId: {
    type: String
  },
  storyShortId: {
    type: String
  },
  authorId: {
    type: String
  },
  type: {
    type: String
  },
  source: {
    type: String,
    optional: true
  },
  fromEmbedly: {
    type: Boolean,
    optional: true
  },
  version: {
    type: String,
    optional: true
  },
  savedAt: {
    type: Date,
    optional: true
  },
  publishedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    optional: true // optional because only added this fieldjust before launch
  },
  fullDetails: {
    type: Object,
    optional: true,
    blackbox: true
  },
  description: {
    type: String,
    optional: true
  },
  content: {
    type: String,
    trim: false,
    label: " ",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        "class": "text-input"
      }
    }
  },
  published: {
    type: Boolean,
    defaultValue: false
  },
  everPublished: {
    type: Boolean,
    defaultValue: false
  },
  reference: {
    type: Schema.ContextReferenceProfile,
    optional: true
  },
  override: {
    type: Schema.ContextReferenceProfile,
    optional: true
  },
  searchQuery: {
    type:String,
    optional:true
  },
  searchOption: {
    type: String,
    optional:true
  }
});

ContextBlocks.attachSchema(Schema.ContextBlocks);






var verticalSectionSchema = new SimpleSchema({
  '_id': {
    type: String
  },
  'title': {
    type: String,
    optional: true
  },
  'hasTitle': {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  'content': {
    type: String,
    trim: false
  },
  'contextBlocks': {
    type: [String],
    defaultValue: []
  }
});

var sharedStorySchema = function(options) {
  options = options || {};
  return {
    headerImageFormat: {
      type: String,
      optional: true
    },
    headerImageAttribution: {
      type: String,
      optional: true
    },
    headerImage: {
      type: String,
      optional: true,
      autoValue: function() {
        if(options.draft){
          if (this.isSet) {
            return this.value;
          } else {
            return this.unset();
          }
        }
        var placeholderNumber = _.random(1,13).toString();
        if (this.isSet) {
          return this.value;
        } else if (this.isInsert) {
          return placeholderNumber;
        } else if (this.isUpsert) {
          return {$setOnInsert: placeholderNumber};
        } else {
          this.unset();
        }
      }
    },
    storyPathSegment: {
      type: String
    },
    title: {
      type: String,
      defaultValue: ''
    },
    keywords:{
      type: [String],
      defaultValue: []
    },
    narrativeRightsReserved: {
      type: Boolean,
      optional: true
    },
    verticalSections: {
      type: [verticalSectionSchema],
      minCount: 1,
      maxCount: 1000
    }
  }
};

var draftStorySchema = new SimpleSchema(sharedStorySchema({draft: true}));



var analyticsSchema = new SimpleSchema({
  byConnection: {
    type: Number,
    defaultValue: 0
  },
  byIP: {
    type: Number,
    defaultValue: 0
  },
  byId: {
    type: Number,
    defaultValue: 0
  },
  total: {
    type: Number,
    defaultValue: 0
  }
});

Schema.Stories = new SimpleSchema(_.extend({}, sharedStorySchema(), {
    shortId: {
      type: String
    },
    savedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date;
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date};
        } else {
          this.unset();
        }
      }
    },
    publishedAt: {
      type: Date,
      optional: true
    },
    firstPublishedAt: {
      type: Date,
      optional: true
    },
    published: {
      type: Boolean,
      defaultValue: false
    },
    everPublished: {
      type: Boolean,
      defaultValue: false
    },
    userPathSegment: {
      type: String
    },
    authorId: {
      type: String
    },
    authorName: {
      type: String
    },
    authorUsername: {
      type: String
    },
    authorDisplayUsername: {
      type: String,
      optional: true
    },

    deleted: {
      type: Boolean,
      defaultValue: false
    },
    deletedAt: {
      type: Date,
      optional: true
    },

    favorited: {
      type: [String],
      defaultValue: []
    },
    favoritedTotal: {
      type: Number,
      defaultValue: 0
    },
    editorsPick: {
      type: Boolean,
      optional: true
    },
    editorsPickAt: {
      type: Date,
      optional: true
    },

    analytics: {
      type: Object
    },
    'analytics.views': {
      type: analyticsSchema
    },
    'analytics.shares': {
      type: analyticsSchema
    },
    'analytics.reads': {
      type: analyticsSchema
    },
    'analytics.heartbeats': {
      type: Object,
      optional: true
    },
    'analytics.heartbeats.active': {
      type: Object,
      optional: true,
      blackbox: true
    },
    contextBlocks: {
      type: [ContextBlock], // TODO this should really be Schema.ContextBlocks, but would need to be converted to a regular object, otherwise simple-schema complains
      minCount: 0,
      maxCount: 1000,
      defaultValue: []
    },
    contextBlockIds: {
      type: [String],
      minCount: 0,
      maxCount: 1000,
      defaultValue: []
    },
    contextBlockTypeCount:{
      type: Object,
      optional: true,
      blackbox: true
    },
    draftStory: {
      type: draftStorySchema
    },
    'version': {
      type: String,
      optional: true
    }
  })
);

this.Stories.attachSchema(Schema.Stories);



this.StoryStats = new Mongo.Collection("story_stats");


this.StoryStats.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true
  },
  remove: function() {
    return true
  }
});

var deepAnalyticsSchema = new SimpleSchema({
  uniqueViewersByConnection: {
    type: [String],
    defaultValue: []
  },
  uniqueViewersByIP: {
    type: [String],
    defaultValue: []
  },
  uniqueViewersByUserId: {
    type: [String],
    defaultValue: []
  },
  all: {
    type: [Object],
    blackbox: true
  }
});

Schema.StoryStats = new SimpleSchema({
  storyId: {
    type: String
  },
  deepAnalytics: {
    type: Object,
    optional: true
  },
  'deepAnalytics.views': {
    type: deepAnalyticsSchema
  },
  'deepAnalytics.shares': {
    type: deepAnalyticsSchema
  },
  'deepAnalytics.reads': {
    type: deepAnalyticsSchema
  },
  analytics: {
    type: analyticsSchema,
    optional: true
  },
  'analytics.views': {
    type: analyticsSchema
  },
  'analytics.shares': {
    type: analyticsSchema
  },
  'analytics.reads': {
    type: analyticsSchema
  },
  'analytics.heartbeats': {
    type: Object,
    optional: true
  },
  'analytics.heartbeats.active': {
    type: Object,
    optional: true,
    blackbox: true
  },
});

this.StoryStats.attachSchema(Schema.StoryStats);


this.StoryHistories = new Mongo.Collection("story_histories");


this.Activities = new Mongo.Collection("activities");

var objectSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['Person', 'Story', 'ContextCard']
  },
  id: {
    type: String
  },
  name: {
    type: String
  }
});

Schema.Activities = new SimpleSchema({
  type: { // follow, favorite etc...
    type: String,
    allowedValues: ['Favorite', 'Follow', 'FollowBack']
  },
  content: { // for ex., message contents
    type: String,
    optional: true
  },
  published: { // when this happened
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  },
  fanout: { // fanout status
    type: String,
    defaultValue: 'pending',
    allowedValues: ['pending', 'in_progress', 'done']
  },
  actor: {
    type: objectSchema,
    optional: true
  },
  object: {
    type: objectSchema,
    optional: true
  },
  //target: {
  //  type: objectSchema,
  //  optional: true
  //}
});

this.Activities.attachSchema(Schema.Activities);



this.ActivityFeedItems = new Mongo.Collection("activity_feed_items");

Schema.ActivityFeedItems = new SimpleSchema({
  uId: { // userId
    type: String
  },
  aId: { // actionId
    type: String
  },
  r: { // relevancy
    type: Date
  }
});

this.ActivityFeedItems.attachSchema(Schema.ActivityFeedItems);
