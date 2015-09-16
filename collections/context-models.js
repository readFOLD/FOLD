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
      creationDate: new Date(e.publishedAt),
      noPreview: !e.thumbnails
    },
    live: e.liveBroadcastContent === 'live',
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
      userId: e.user.id,
      creationDate: new Date(e.createdAt)
    },
    live: e.live,
    source: 'ustream'
  }
};

bambuserMapFn = function (e) {
  return {
    reference: {
      title: e.title,
      id: e.vid,
      username: e.username, // for some reason, username always comes back null
      totalViews: e.totalViews,
      userId: e.owner.uid,
      creationDate: new Date(parseInt(e.created)),
      tags: e.tags,
      previewUrl: e.preview
    },
    live: e.live,
    source: 'bambuser'
  }
};

ContextBlock.searchMappings = {
  all_streaming_services: {
    methodName: 'streamSearchList',
    mapFn: function (e) {
      var stream;
      switch (e._streamSource) {
        case 'youtube':
          stream = youtubeMapFn(e);
          break;
        case 'bambuser':
          stream = bambuserMapFn(e);
          break;
        case 'ustream':
          stream = ustreamMapFn(e);
          break;
        default:
          console.error(e);
          throw new Meteor.Error('Unknown stream source')
      }
      delete stream._streamSource; // this was only for internal use
      return stream;
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
          creationDate: new Date(e.created_time),
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
          creationDate: new Date(e.created_at),
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
          creationDate: new Date(e.created_at)
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
          hasWebM: e.webm ? true : false,
          height: e.height,
          width: e.width
        }
      }
    }
  },
  flickr: {
    methodName: 'flickrImageSearchList',
    mapFn: function (e) {
      var username, uploadDate, title;
      if (e.media) {
        //if single image result
        ownername = e.owner.username;
        uploadDate = e.dateuploaded;
        title = e.title._content;
      } else {
        //if search result
        ownername = e.ownername;
        uploadDate = e.dateupload;
        title = e.title;
      }
      return {
        reference: {
          ownerName: ownername,
          uploadDate: new Date(parseInt(uploadDate) * 1000),
          flickrFarm: e.farm,
          flickrSecret: e.secret,
          id: e.id,
          flickrServer: e.server,
          title: title
        }
      }
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
    if (_.contains('youtube', 'ustream'), this.source) {
      return this.reference.description;
    }
  };

  Stream.prototype.username = function () {
    return this.reference.username;
  };

  Stream.prototype.currentViewers = function () {
    switch (this.source){
      case 'youtube':
        return 431;
      case 'ustream':
        return this.reference.currentViewers;
      case 'bambuser':
        return null
    }
  };
  Stream.prototype.totalViews = function () {
    switch (this.source){
      case 'youtube':
        return 59274;
      case 'ustream':
        return this.reference.totalViews;
      case 'bambuser':
        return this.reference.totalViews;
    }
  };


  Stream.prototype.creationDate = function () {
    return this.reference.creationDate
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
      return 'https://www.ustream.tv/embed/' + this.reference.id + '?html5ui';
    } else if (this.source === 'bambuser') {
      return '//embed.bambuser.com/broadcast/' + this.reference.id + '?chat=0';
    }
  };

  Stream.prototype.flashVars = function(){
    if (this.source === 'bambuser') {
      //return 'vid=' + Template.instance().activeStream.get().reference.id + '&autostart=yes';
      return 'username=' + this.reference.username + '&autostart=yes';
    }
  };

  Stream.prototype.previewUrl = function () {
    switch (this.source){
      case 'youtube':
        // TO-DO - if this.noPreview, show something nice instead of blank youtube thing
        return '//img.youtube.com/vi/' + this.reference.id + '/0.jpg';
      case 'ustream':
        // TO-DO - if contains /images/defaults, show something nice instead of blank ustream thing
        return this.reference.previewUrl;
      case 'bambuser':
        return this.reference.previewUrl;
    }
  };

  Stream.prototype.thumbnailUrl = function () {
    switch (this.source){
      case 'youtube':
        return '//i.ytimg.com/vi/' + this.reference.id + '/default.jpg';
      case 'ustream':
        return this.reference.thumbnailUrl;
      case 'bambuser':
        return this.reference.previewUrl;
    }
  };

  Stream.prototype.sourceUrl = function () {
    if (this.source === 'youtube') {
      return 'https://www.youtube.com/watch?v=' + this.reference.id;
    } else if (this.source === 'ustream') {
      return 'https://www.ustream.tv/channel/' + this.reference.id;
    } else if (this.source === 'bambuser'){
      return 'http://bambuser.com/channel/' + this.reference.username;
    }
  };

  Stream.prototype.searchList = true;
  Stream.prototype.searchListTemplate = 'create_stream_section';
  Stream.prototype.searchSoloTemplate = 'create_stream_section';


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
      return '//www.youtube.com/embed/' + this.reference.id;
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

  VideoBlock.prototype.previewHeightAtGivenWidth = function(width){
    if (this.source === 'youtube') {
      return Math.floor(width * 360 / 480);
    } else if (this.source === 'vimeo') {
      return Math.floor(width * 359 / 640);
    }
  };

  VideoBlock.prototype.soloModeLocation = 'overlay';
  VideoBlock.prototype.soloModeTemplate = 'display_video_section';
  VideoBlock.prototype.listModeItemTemplate = 'preview_video_section';
  VideoBlock.prototype.countListModeViewAsRead = true;
  VideoBlock.prototype.searchList = true;
  VideoBlock.prototype.searchListTemplate = 'create_video_section';
  VideoBlock.prototype.searchSoloTemplate = 'create_video_section';
  VideoBlock.prototype.homepagePreview = false;
  VideoBlock.prototype.homepagePreviewTemplate = null;

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

  AudioBlock.prototype.url = function () {
    if (this.source === 'soundcloud') {
      return '//w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + this.reference.id + '&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true'
    }
  };

  AudioBlock.prototype.artworkUrl = function () {
    if (this.source === 'soundcloud') {
      return this.reference.artworkUrl;
    }
  };

  AudioBlock.prototype.previewUrl = function () {
    if (this.source === 'soundcloud' && this.reference.artworkUrl) {
      return this.reference.artworkUrl.replace(/large\.jpg/, "t500x500.jpg");
    }
  };

  AudioBlock.prototype.anchorMenuSnippet = function () {
    return this.reference.title;
  };


  AudioBlock.prototype.soloModeLocation = null;
  AudioBlock.prototype.soloModeTemplate = 'display_audio_section';
  AudioBlock.prototype.listModeItemTemplate = 'display_audio_section';
  AudioBlock.prototype.countListModeViewAsRead = true;
  AudioBlock.prototype.searchList = true;
  AudioBlock.prototype.searchListTemplate = 'create_audio_section';
  AudioBlock.prototype.searchSoloTemplate = 'create_audio_section';
  AudioBlock.prototype.homepagePreview = false;
  AudioBlock.prototype.homepagePreviewTemplate = null;

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
      var imgIndex = text.lastIndexOf("http://");
      text = text.substring(0, imgIndex);
    }

    return twttr.txt.autoLink(text, {
      urlEntities: this.links(),
      targetBlank: true
    });
  };

  TwitterBlock.prototype.soloModeLocation = null;
  TwitterBlock.prototype.soloModeTemplate = null;
  TwitterBlock.prototype.listModeItemTemplate = 'display_twitter_section';
  TwitterBlock.prototype.countListModeViewAsRead = true;
  TwitterBlock.prototype.searchList = true;
  TwitterBlock.prototype.searchListTemplate = 'create_twitter_section';
  TwitterBlock.prototype.searchSoloTemplate = 'create_twitter_section';
  TwitterBlock.prototype.homepagePreview = true;
  TwitterBlock.prototype.homepagePreviewTemplate = 'homepage_preview_twitter_section';

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
      case 'giphy':
        return '//media4.giphy.com/media/' + this.reference.id + '/giphy.gif';
      case 'embedly':
        return this.reference.url;
      case 'cloudinary':
        // TO-DO maybe use jpeg instead of png in certain situations
        return '//res.cloudinary.com/' + Meteor.settings['public'].CLOUDINARY_CLOUD_NAME + '/image/upload/c_limit,h_300,w_520/' + this.reference.id;
    }
  };

  ImageBlock.prototype.isFlickr = function () {
    return (this.source === 'flickr');
  }

  ImageBlock.prototype.webUrl = function () {
    switch (this.source) {
      case 'flickr':
        if (this.reference.ownerName) {
          return '//www.flickr.com/photos/' + this.reference.ownerName + '/' + this.reference.id;
        } else {
          return encodeFlickrUrl(this.reference.id)
        }
    }
  }

  ImageBlock.prototype.ownerName = function () {
    switch (this.source) {
      case 'flickr':
        return this.reference.ownerName;
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
        return '//farm' + this.reference.flickrFarm + '.staticflickr.com/' + this.reference.flickrServer + '/' + this.reference.id + '_' + this.reference.flickrSecret + '.jpg';
      case 'giphy':
        return '//media4.giphy.com/media/' + this.reference.id + '/giphy.gif';
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
      case 'giphy':
        return '//media4.giphy.com/media/' + this.reference.id + '/200_d.gif';
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

  ImageBlock.prototype.heightAtGivenWidth = function(width){
    var height;
    if (height = this.reference.height){
      return height * width / this.reference.width;
    } else {
      return null;
    }
  };

  ImageBlock.prototype.soloModeLocation = 'overlay';
  ImageBlock.prototype.soloModeTemplate = 'display_image_section';
  ImageBlock.prototype.listModeItemTemplate = 'preview_image_section';
  ImageBlock.prototype.countListModeViewAsRead = true;
  ImageBlock.prototype.searchList = true;
  ImageBlock.prototype.searchListTemplate = 'create_image_section';
  ImageBlock.prototype.searchSoloTemplate = 'create_image_section';
  ImageBlock.prototype.homepagePreview = false;
  ImageBlock.prototype.homepagePreviewTemplate = null;

  return ImageBlock;

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

  MapBlock.prototype.soloModeLocation = 'overlay';
  MapBlock.prototype.soloModeTemplate = 'display_map_section';
  MapBlock.prototype.listModeItemTemplate = 'preview_map_section';
  MapBlock.prototype.countListModeViewAsRead = true;
  MapBlock.prototype.searchList = false;
  MapBlock.prototype.searchListTemplate = null;
  MapBlock.prototype.searchSoloTemplate = 'create_map_section';
  MapBlock.prototype.homepagePreview = false;
  MapBlock.prototype.homepagePreviewTemplate = null;

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

  TextBlock.prototype.soloModeLocation = 'sidebar';
  TextBlock.prototype.soloModeTemplate = 'display_text_section';
  TextBlock.prototype.listModeItemTemplate = 'preview_text_section';
  TextBlock.prototype.countListModeViewAsRead = false;
  TextBlock.prototype.searchList = false;
  TextBlock.prototype.searchListTemplate = null;
  TextBlock.prototype.searchSoloTemplate = 'create_text_section';
  TextBlock.prototype.homepagePreview = true;
  TextBlock.prototype.homepagePreviewTemplate = 'homepage_preview_text_section';

  return TextBlock;

})(ContextBlock);

LinkBlock = (function (_super) {
  __extends(LinkBlock, _super);

  function LinkBlock(doc) {
    LinkBlock.__super__.constructor.call(this, doc);
    this.type = 'link';
  }

  LinkBlock.prototype.title = function () {
    return this.reference.title || this.reference.originalUrl;
  };

  LinkBlock.prototype.linkDescription = function () {
    return this.reference.description || '';
  };

  LinkBlock.prototype.thumbnailUrl = function () {
    return this.reference.thumbnailUrl || '//res.cloudinary.com/fold/image/upload/v1/static/LINK_SQUARE.svg';
  };

  LinkBlock.prototype.imageOnLeft = function () {
    return !this.reference.thumbnailUrl || (this.reference.thumbnailWidth / this.reference.thumbnailHeight) <= 1.25;
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

  LinkBlock.prototype.soloModeLocation = null;
  LinkBlock.prototype.soloModeTemplate = null;
  LinkBlock.prototype.listModeItemTemplate = 'display_link_section';
  LinkBlock.prototype.countListModeViewAsRead = true;
  LinkBlock.prototype.searchList = false;
  LinkBlock.prototype.searchListTemplate = null;
  LinkBlock.prototype.searchSoloTemplate = 'create_link_section';
  LinkBlock.prototype.homepagePreview = false;
  LinkBlock.prototype.homepagePreviewTemplate = null;

  return LinkBlock;

})(ContextBlock);


if(Meteor.isClient){
  var cleanNewsHtmlOptions = {
    allowedTags: ['p'], // only allow p
    format: false,
    removeAttrs: ['class', 'id']
  };

  window.cleanNewsHtml = function(html){
    return $.htmlClean(html, cleanNewsHtmlOptions);
  };
}


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
    return cleanNewsHtml(this.reference.content);
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

  NewsBlock.prototype.publicationDate = function(){
    return this.reference.publishedOffset ? new Date(this.reference.publishedMs + this.reference.publishedOffset) : new Date(this.reference.publishedMs);
  };

  NewsBlock.prototype.soloModeLocation = 'sidebar';
  NewsBlock.prototype.soloModeTemplate = 'display_news_section';
  NewsBlock.prototype.listModeItemTemplate = 'preview_news_section';
  NewsBlock.prototype.countListModeViewAsRead = false;
  NewsBlock.prototype.searchList = false;
  NewsBlock.prototype.searchListTemplate = null;
  NewsBlock.prototype.searchSoloTemplate = 'create_news_section';
  NewsBlock.prototype.homepagePreview = true;
  NewsBlock.prototype.homepagePreviewTemplate = 'homepage_preview_news_section';

  return NewsBlock;

})(ContextBlock);
