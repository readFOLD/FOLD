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



export default TwitterBlock = (function (_super) {
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
