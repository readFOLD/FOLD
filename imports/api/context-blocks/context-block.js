
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


export default ContextBlock = (function () {
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
    mapFn  (e) {
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
    mapFn  (e) {
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
    mapFn  (e) {
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
    mapFn  (e) {
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
    mapFn  (e) {
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
    mapFn  (e) {
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
    mapFn  (e) {
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
