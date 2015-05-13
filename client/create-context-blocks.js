var searchDep = new Tracker.Dependency();

var i = 0;

var count = function(){
  return i++;
};

var getIdFromUrl = function(url){
  return _.chain(url.split('/')).compact().last().value().match(/[\d]*/)[0]
};

var parseDate = function(date) {
  return date.substring(0,10).replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1");
};

var createBlockHelpers = {
  startingBlock: function() {
    if (this instanceof ContextBlock) {
      return this;
    }
  },
  showAddButton: function(){
    return Template.instance().focusResult.get() ? true : false;
  },
  isFocused: function () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      if (this._id === focusResult._id) {
        return true;
      }
    }
  },
  isActive: function () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      return true;
    }
  },
  selected: function() {
    return (this.source === Session.get('newHorizontalDataSource'));
  },
  loading: function() {
    if (Template.instance().loadingResults)
      return Template.instance().loadingResults.get()
  },
  noMoreResults: function() {
    if (Template.instance().noMoreResults)
      return Template.instance().noMoreResults.get()
  },
  results: function () {
    searchDep.depend();
    return Template.instance().existingSearchResults()
  },
  addingDescription: function() {
    return Template.instance().addingDescription.get();
  },
  focusResult: function() {
    var focusResult = Template.instance().focusResult.get();
    if (focusResult) { return focusResult; }
  },
};


searchScrollFn = function(d, template) {
  var searchContainer = $("ol.search-results-container");

  if ((searchContainer.scrollTop() + searchContainer.height()) === searchContainer[0].scrollHeight && !template.loadingResults.get()) {
    if (template.existingSearchResults({reactive: false}).count()){ // confirm there are already results and we're scrolling down{
      template.search();
    }
  }
};

throttledSearchScrollFn = _.throttle(searchScrollFn, 20);

var addFocusResult = function(d, template) {
  var focusResult = template.focusResult.get();
  if (focusResult) {
    var textAreaContent = template.$('textarea[name=content]').val();
    focusResult.description = textAreaContent;

    template.focusResult.set(focusResult);
    addContext(focusResult);
  }
};

var createBlockEvents = {
  "click .data-source": function(d, template) {
    Session.set('newHorizontalDataSource', this.source);
  },

  "submit form": function(d, template) {
    d.preventDefault();
    if(!template.loadingResults.get()){
      if (!template.existingSearchResults || !template.existingSearchResults({reactive: false}).count()) {  // confirm there are no results yet
        template.search();
      }
    }
  },

  "scroll ol.search-results-container": throttledSearchScrollFn,

  "click .search-results-container li": function(d, template) {
    template.focusResult.set(this);
  },

  "click .add-desc-button": function (d, template) {
    template.addingDescription.set(true);
  },
  "click .back-button": function (d, template) {
    template.addingDescription.set(false);
  },

  "click .add-button": addFocusResult,
  "keydown .text-content.editable": function(e, t) {
    if (e.which === 13){
      addFocusResult.apply(this,arguments);
    }
  },
  "click .cancel": function() {
    Session.set('addingContext', false);
    return Session.set('editingContext', null);
  }
};

var getSearchInput = function(){
  try { // wrap in try in case dom isn't ready
    return {
      query: this.$('input[type="search"]').val(),
      option: this.$('input[name=option]:checked').val()
    }
  } catch (e) {
    return {};
  }

};

var setSearchInput = function(query){
  try { // wrap in try in case dom isn't ready
    this.$('input[type="search"]').val(query);
  } catch (e) {
    return {};
  }

};


var existingSearchResults = function(options){
  inputs = getSearchInput.call(this);
  return SearchResults.find({
    searchQuery: inputs.query,
    searchOption: inputs.option,
    type: this.type,
    source: Session.get('newHorizontalDataSource')
  }, _.extend({}, options, {sort: {ordinalId: 1} }))
};



var searchAPI = function(query) {
  var source = Session.get('newHorizontalDataSource');
  var type = this.type;
  var page;

  var inputs = getSearchInput.call(this);
  var query = inputs.query;

  if (!query){
    return this.noMoreResults.set('Please enter a search query');
  }

  var option = inputs.option;

  var mostRecentResult = this.existingSearchResults({reactive:false}).fetch().slice(-1)[0];


  if (mostRecentResult) {
    page = mostRecentResult.nextPage;
  }

  if (page === 'end') { // return if at end of possible results
    this.noMoreResults.set('No more results');
    this.loadingResults.set(false);
    return;
  }

  this.noMoreResults.set(false);
  this.loadingResults.set(true);


  var that = this;
  searchDep.changed();

  integrationDetails = searchIntegrations[this.type][source];

  if (integrationDetails.notSearch){ // don't search if it's not a search integration
    return
  }

  Meteor.call(integrationDetails.methodName, query, option, page, function(err, results) {
    that.loadingResults.set(false);
    if (err) {
      that.noMoreResults.set('No more results'); // TO-DO - surface error to user?
      throw(err);
      return;
    }

    var items = results.items;
    var nextPage = results.nextPage;

    if (!items || !items.length) {
      that.noMoreResults.set('No results found');
      return;
    }
    _.chain(items)
      .map(integrationDetails.mapFn || _.identity)
      .each(function(item, i) {
        _.extend(item, {
          type : type,
          source: source,
          authorId : Meteor.user()._id,
          searchQuery : query,
          searchOption : option,
          nextPage: nextPage,
          ordinalId: count(),
          fullDetails: items[i] // include all original details from the api
        });

        SearchResults.insert(item);
      });
  });
};


var searchIntegrations = {
  video: {
    youtube: {
      methodName: 'youtubeVideoSearchList',
      mapFn: function(e){
        return {
          reference: {
            title: e.title,
            description: e.description,
            id: e.videoId,
            username : e.channelTitle,
            userId : e.channelId,
            creationDate : parseDate(e.publishedAt) 
          }
        }
      }
    },
    vimeo: {
      methodName: 'vimeoVideoSearchList',
      mapFn: function(e){
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
    }
  },
  audio: {
    soundcloud: {
      methodName: 'soundcloudAudioSearchList',
      mapFn: function(e){
        return {
          reference: {
            title: e.title,
            description: e.description,
            id: e.id,
            username : e.channelTitle,
            userId : e.user_id,
            creationDate : parseDate(e.created_at),
            artworkUrl: e.artwork_url
          }
        }
      }
    }
  },
  twitter: {
    twitter: {
      methodName: 'twitterSearchList',
      mapFn: function(e){
        var item = {
          reference: {
            text : e.text,
            extendedEntities: e.extended_entities,
            retweetedStatus: e.retweeted_status,
            entities: e.entities,
            id : e.id_str,
            username : e.user.name,
            screenname : e.user.screen_name,
            userPic : e.user.profile_image_url_https,
            creationDate : e.created_at.substring(0, 19)
          }
        };
        return item;
      }
    }
  },
  image: {
    imgur: {
      methodName: 'imgurImageSearchList',
      mapFn: function(e) {
        return {
          reference: {
            id : e.id,
            username : e.account_url,
            userId : e.account_id,
            fileExtension: e.link.substring(e.link.lastIndexOf('.') + 1),
            title : e.title,
            hasMP4: e.mp4 ? true : false,
            hasWebM: e.webm ? true : false
          }
        }
      }
    },
    flickr: {
      methodName: 'flickrImageSearchList',
      mapFn: function(e) {
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
    }
  },
  gif: {
    giphy: {
      methodName: 'giphyGifSearchList',
      mapFn: function(e){
        return {
          reference: {
            id: e.id,
            username: e.username,
            source: e.source
          }
        }
      }
    }
  }
};



var createTemplateNames = [
  'create_image_section',
  'create_gif_section',
  'create_video_section',
  'create_twitter_section',
  'create_map_section',
  'create_audio_section',
  'create_viz_section',
  'create_link_section'
];

_.each(createTemplateNames, function(templateName){
  Template[templateName].helpers(createBlockHelpers);
  Template[templateName].events(createBlockEvents);
});


Template.create_audio_section.events({
  "dblclick .search-results-container li": function (d, template) {
    addContext(this);
  }
});

Template.create_video_section.events({
  "dblclick .search-results-container li": function (d, template) {
    addContext(this);
  }
});

Template.create_twitter_section.events({
  "dblclick .search-results-container li": function (d, template) {
    addContext(this);
  }
});

Template.create_image_section.events({
  "dblclick .search-results-container li": function (d, template) {
    template.addingDescription.set(true);
  }
});

Template.create_gif_section.events({
  "dblclick .search-results-container li": function (d, template) {
    template.addingDescription.set(true);
  }
});

searchTemplateCreatedBoilerplate = function(type, defaultSource) {
  return function() {
    var that = this;

    this.type = type;
    var previousSource = Session.get('newHorizontalDataSource');
    if (!_.contains(_.pluck(dataSourcesByType[type], 'source'), previousSource)){
      Session.set('newHorizontalDataSource', defaultSource)
    }

    this.loadingResults = new ReactiveVar();
    this.focusResult = new ReactiveVar();
    this.noMoreResults = new ReactiveVar();

    this.addingDescription = new ReactiveVar(false);

    this.autorun(function(){
      if(that.addingDescription.get()){
        Meteor.setTimeout(function(){
          that.$('textarea').focus();
        });
      }
    });

    this.search = _.bind(searchAPI, this);
    this.existingSearchResults = _.bind(existingSearchResults, this);
    this.getSearchInput = _.bind(getSearchInput, this);
    this.setSearchInput = _.bind(setSearchInput, this);


    this.autorun(function(){
      searchDep.depend();
      that.noMoreResults.set(false);
    });
  };
};

searchTemplateRenderedBoilerplate  = function() {
  return function() {
    var that = this;

    // set initial search query to session query
    this.setSearchInput(Session.get('query'));
    searchDep.changed();

    // focus search box
    this.$('input[type="search"]').focus();

    // update session query whenever search input changes
    this.autorun(function(){
      searchDep.depend();
      Session.set('query', that.getSearchInput().query);
    });

    // search when initially arrive and when source changes (if there aren't already results)
    this.autorun(function(){
      Session.get('newHorizontalDataSource');
      if (Session.get('addingContext') && that.getSearchInput().query && !that.existingSearchResults({reactive: false}).count()) {
        that.search();
      }
    });

  };
};


Template.create_video_section.onCreated(searchTemplateCreatedBoilerplate('video', 'youtube'));
Template.create_video_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_twitter_section.onCreated(searchTemplateCreatedBoilerplate('twitter', 'twitter'));
Template.create_twitter_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_image_section.onCreated(function(){
  var that = this;
  this.uploadPreview = new ReactiveVar();
  this.uploadStatus = new ReactiveVar();
  var query = _cloudinary.find({});
  this.observeCloudinary = query.observeChanges({ // this query stays live until .stop() is called in the onDestroyed hook
    added: function (id) { // start upload
      that.uploadStatus.set('Uploading...');
    },
    changed: function (id, changes) { // upload stream updated
      if (changes.public_id){ // if upload successful
        var doc = _cloudinary.findOne(id);
        var cardModel = doc.format === 'gif' ? GifBlock : ImageBlock;
        // TO-DO consider how to do attribution
        that.uploadStatus.set('Upload successful');
        that.focusResult.set(new cardModel({
          reference: {
            id: doc.public_id,
            fileExtension: doc.format,
            width: doc.width,
            height: doc.height
          },
          source: Session.get('newHorizontalDataSource'),
          authorId : Meteor.user()._id,
          fullDetails: doc
        }));
        that.addingDescription.set(true);
      }
    },
    removed: function (id) {  // upload failed
      var input = that.$('input[type=file]');
      that.uploadStatus.set('Upload failed');
      input.val(null);
      input.change(); // trigger change event
    }
  });
});

Template.create_image_section.onDestroyed(function(){
  this.observeCloudinary.stop();
});

Template.create_image_section.helpers({
  uploadMode: function(){
    return Session.get('newHorizontalDataSource') === 'cloudinary';
  },
  uploadStatus: function(){
    return Template.instance().uploadStatus.get();
  },
  uploadPreview: function(){
    return Template.instance().uploadPreview.get();
  }
});

Template.create_image_section.events({
  'change input[type=file]': function(e, t){
    var file = _.first(e.target.files);
    if (file){
      var reader = new FileReader;
      reader.onload = function(upload){
        t.uploadPreview.set(upload.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      t.uploadPreview.set(null);
    }
  }
});

Template.create_image_section.onCreated(searchTemplateCreatedBoilerplate('image', 'flickr'));
Template.create_image_section.onRendered(searchTemplateRenderedBoilerplate());


Template.create_gif_section.onCreated(searchTemplateCreatedBoilerplate('gif', 'giphy'));
Template.create_gif_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_audio_section.onCreated(searchTemplateCreatedBoilerplate('audio', 'soundcloud'));
Template.create_audio_section.onRendered(searchTemplateRenderedBoilerplate());

var dataSourcesByType = {
  'image': [{source: 'flickr', 'display': 'Flickr'}, {source: 'imgur', display: 'Imgur'}, {source: 'cloudinary', display: 'Upload Your Own'}],
  'viz': [{source: 'oec', display: 'Observatory of Economic Complexity'}],
  'gif': [{source: 'giphy', display: 'Giphy'}],
  'video': [{source: 'youtube', display: 'Youtube'}, {source: 'vimeo', display: 'Vimeo'}],
  'audio': [{source: 'soundcloud', display: 'SoundCloud'}],
  'twitter': [{source: 'twitter', display: 'Twitter'}],
  'map': [{source: 'google_maps', display: 'Google Maps'}],
  'text': [{source: 'free_text', display: 'Free Text'}],
  'link': [{source: 'link', display: 'Link'}]
};


_.each(dataSourcesByType, function(dataSources, type){
  var templateName = 'create_' + type + '_section';
  Template[templateName].helpers({dataSources: dataSources});
});


Template.create_viz_section.onCreated(function() {
  this.type = 'viz';
  Session.set('newHorizontalDataSource', 'oec');

  this.directions = ['import', 'export'];
  this.countries = VizBlock.countries;
  this.years = [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];

  this.selectedCountry = new ReactiveVar(_.sample(this.countries).id);
  this.selectedDirection = new ReactiveVar('export');
  this.selectedYear = new ReactiveVar(2012);

  this.focusResult = new ReactiveVar();

  var that = this;
  this.autorun(function() {
    var oecYear = that.selectedYear.get();
    var oecCountryCode = that.selectedCountry.get();
    var oecDirection = that.selectedDirection.get();

    that.focusResult.set(new VizBlock({
      reference: {
        oecCountry: oecCountryCode,
        oecYear: oecYear,
        oecDirection: oecDirection
      },
      authorId : Meteor.user()._id,
      type: that.type,
      source: Session.get('newHorizontalDataSource')
    }));
  });
});


Template.create_viz_section.onRendered(function() {
  $("select").selectOrDie({size: 8});
});

Template.create_viz_section.helpers({
    cardWidth: function() { return Session.get('cardWidth') - 40; } ,
    directions: function() { return Template.instance().directions; },
    countries: function() { return Template.instance().countries; },
    years: function() { return Template.instance().years; },
    selectedYear: function() { return Template.instance().selectedYear.get(); },
    selectedCountry: function() { return Template.instance().selectedCountry.get(); },
    selectedDirection: function() { return Template.instance().selectedDirection.get(); },
    isSelectedYear: function() { return (this == Template.instance().selectedYear.get()); },
    isSelectedCountry: function() { return (this.id === Template.instance().selectedCountry.get()); },
    isSelectedDirection: function() { return (this === Template.instance().selectedDirection.get()); },
    url: function() {
      var preview = Template.instance().focusResult.get();
      if (preview) {
        return preview.url()
      }
    }
  }
);

Template.create_viz_section.events({
  "change select.countries": function(e, t) {
    t.selectedCountry.set($(e.target).find('option:selected').data('id'));
  },
  "change select.years": function(e, t) {
    t.selectedYear.set($(e.target).val());
  }
})

Template.create_link_section.onCreated(function() {
  this.type = 'link';
  Session.set('newHorizontalDataSource', 'link');
  this.loadingResults = new ReactiveVar();
  this.noMoreResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();

  var that = this;
  this.search = function(){
    var url = this.$('input[type="search"]').val();
    that.loadingResults.set(true);

    Meteor.call('embedlyEmbedResult', url, function(error, result) {
      that.loadingResults.set(false);

      if(error){
        that.noMoreResults.set('No results found');
        return
      }
      that.noMoreResults.set(false);

      addPropertiesToBaseline = function(obj){
        var newObj = _.extend({}, obj, {
          fullDetails: result,
          authorId : Meteor.user()._id,
          searchQuery: url,
          fromEmbedly: true,
          version: 'em1'
        });

        if (!newObj.reference){
          newObj.reference = {};
        }

        _.extend(newObj.reference, {
          title: result.title,
          description: result.description,
          providerName: result.provider_name,
          providerUrl: result.provider_url,
          url: result.url,
          originalUrl: url,
          authorUrl: result.author_url,
          authorName: result.author_name,
          thumbnailUrl: result.thumbnail_url,
          thumbnailWidth: result.thumbnail_width,
          thumbnailHeight: result.thumbnail_height,
          embedlyType: result.type
        });
        return newObj
      };

      switch(result.type) {
        case 'rich':
          // fall through to the link
        case 'link':
          that.focusResult.set(new LinkBlock(addPropertiesToBaseline({
            type: 'link',
            source: 'embedly'
          })));
          break;
        case 'photo':
          var source, reference;

          switch(result.provider_name) {
            case 'Imgur':
              source = 'imgur';
              var info = _.chain(result.url.split('/')).compact().last().value().split('.');
              reference = {
                id: info[0],
                fileExtension: info[1]
              };
              break;
            case 'Giphy':
              source = 'giphy';
              var info = result.url.match(/\/media\/(.*)?\/giphy/);
              reference = {
                id: info[1]
              };
              break;
            case 'Flickr':
              source = 'flickr';
              var info = result.url.match(/\/\/farm(.*)?\.staticflickr\.com\/(.*)?\/(.*)?_(.*)?_/);
              reference = {
                flickrFarm: info[1],
                flickrServer: info[2],
                id: info[3],
                flickrSecret: info[4]
              };
              break;
            default:
              source = 'embedly';
              reference = {};
          }

          cardModel = source === 'giphy' ? GifBlock : ImageBlock;

          that.focusResult.set(new cardModel(addPropertiesToBaseline({
            reference: reference,
            type: 'image',
            source: source
          })));
          break;

        case 'video':
          switch (result.provider_name){
            case "YouTube":
              var id = result.url.split("v=")[1];
              that.focusResult.set(new VideoBlock(addPropertiesToBaseline({
                reference:  {
                  id: id,
                  username: result.author_name
                },
                source: 'youtube'
              })));
              break;
            case "Vimeo":
              var id = result.html.match(/%2Fvideo%2F(\d*)/)[1];
              var previewImage = result.thumbnail_url.match(/\/video\/(.*)?_/)[1];
              that.focusResult.set(new VideoBlock(addPropertiesToBaseline({
                reference:  {
                  id: id,
                  previewImage: previewImage,
                  username: result.author_name
                },
                source: 'vimeo'
              })));
              break;
            case 'Giphy':
              source = 'giphy';
              var info = result.url.match(/\/media\/(.*)?\/giphy/);
              that.focusResult.set(new GifBlock(addPropertiesToBaseline({
                reference: {
                  id: info[1]
                },
                source: source
              })));
              break;
            default:
              that.focusResult.set(new LinkBlock(addPropertiesToBaseline({
                reference: reference,
                source: 'embedly'
              })));
              break;
          }
          break;
      }
    });
  };
});

Template.create_link_section.onRendered(function() {
  this.$('input[type="search"]').focus();
});

Template.create_link_section.helpers({
  preview: function(){
    return Template.instance().focusResult.get();
  },
  link: function() {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return (preview.type === 'link');
    }
  },
  image: function() {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return (preview.type === 'image' || preview.type === 'gif');
    }
  },
  video: function() {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return (preview.type === 'video');
    }
  }
});


Template.create_map_section.onCreated(function() {
  this.type = 'map';
  Session.set('newHorizontalDataSource', 'google_maps');
  this.loadingResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();

  var that = this;
  this.search = function(){
    var inputs = getSearchInput.call(that);

    if (!inputs.query){
      return
    }

    that.focusResult.set(new MapBlock({
      reference: {
        mapQuery: inputs.query,
        mapType: inputs.option
      },
      authorId : Meteor.user()._id
    }))
  };
});

Template.create_map_section.onRendered(function() {
  this.$('input[type="search"]').focus();
});

Template.create_map_section.events({
  'change input[type="radio"]': function(e, template) {
    template.search();
  }
});

Template.create_map_section.helpers({
  url: function() {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return preview.url()
    }
  },
  previewUrl: function() {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return preview.previewUrl()
    }
  }
});

Template.create_text_section.onCreated(function() {
  this.type = 'text';
  Session.set('newHorizontalDataSource', 'free_text');
});

Template.create_text_section.onRendered(function() {
  this.$('textarea').focus();
});

Template.create_text_section.helpers({
  startingBlock: function() {
    if (this instanceof ContextBlock) {
      return this;
    }
  }
});

Template.create_text_section.events({
  'click .add-button': function(e, template){
    e.preventDefault()
    addContext(new TextBlock({
      content: template.$('textarea[name=content]').val(),
      authorId: Meteor.user()._id,
      source: 'plaintext'
    }));
  }
});

Template.create_twitter_section.helpers({
  twitterUser: function() {
    return Meteor.user().services && Meteor.user().services.twitter && Meteor.user().services.twitter.id;
  }
})

Template.search_form.events({
  'keydown': function(){
    searchDep.changed();
  }
});

Template.search_form.helpers({
  placeholder: function() {
    switch(Template.instance().data.placeholderType){
      case 'links':
        return 'e.g. ' +
          _.sample([
            'https://twitter.com/readFOLD',
            'http://nytimes.com',
            'http://flickr.com'
          ]);
        break;
      case 'locations':
        return 'e.g. ' +
          _.sample([
            'waffle tower',
            'aoshima island',
            'area 51',
            'the south pole',
            'twin peaks',
            'neutral zone',
            'cal anderson park'
          ]);
        break;
      default:
        return 'e.g. ' +
          _.sample([
            'radar',
            'competitive fly fishing',
            'net neutrality',
            'synthetic biology',
            'beekeeping',
            'quantum mechanics',
            'bitcoin mining',
            'glass blowing',
            'falconry',
            'origami',
            'table tennis',
            'llama training',
          ]);
    }
  }
});


// Template.create_image_section.events({
//   "click div.save": function(d) {
//     var context, description, horizontalIndex, horizontalSections, newDocument, parentSection, srcE, url;
//     srcE = d.srcElement ? d.srcElement : d.target;
//     parentSection = $(srcE).closest('section');
//     horizontalIndex = parentSection.data('index');
//     url = parentSection.find('input.image-url-input').val();
//     description = parentSection.find('input.image-description-input').val();
//     newDocument = {
//       type: 'image',
//       url: url,
//       description: description,
//       index: horizontalIndex
//     };
//     horizontalSections = Session.get('horizontalSections');
//     horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument;
//     Session.set('horizontalSections', horizontalSections);
//     context = newDocument;
//     return renderTemplate(d, Template.display_image_section, context);
//   }
// });
