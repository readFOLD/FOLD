var searchDep = new Tracker.Dependency();

var createBlockHelpers = {
  showAddButton(){
    return Template.instance().focusResult.get() ? true : false;
  },
  showSingleResult(){
    return Template.instance().focusResult.get() ? true : false
  },
  isFocused () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      if (this._id === focusResult._id) {
        return true;
      }
    }
  },
  isActive () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      return true;
    }
  },
  selected() {
    return (this.source === Session.get('newHorizontalDataSource'));
  },
  loading() {
    if (Template.instance().loadingResults)
      return Template.instance().loadingResults.get()
  },
  noMoreResults() {
    if (Template.instance().noMoreResults)
      return Template.instance().noMoreResults.get()
  },
  results () {
    searchDep.depend();
    return Template.instance().existingSearchResults()
  },
  focusResult() {
    var focusResult = Template.instance().focusResult.get();
    if (focusResult) { return focusResult; }
  },
  textContent: textContentHelper
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
    if(template.addingFunction){
      template.addingFunction(focusResult, template);
    } else {
      addContext(focusResult);
    }
  }
};

var goBack = function(e, t) {
  var focusResult = t.focusResult.get();

  if (focusResult && (focusResult.searchList || focusResult.type === 'stream')) { // if at the single-mode of a list
    return t.focusResult.set(null);
  } else {
    Session.set('previousMediaDataType', Session.get('mediaDataType'));
    return Session.set('mediaDataType', null);
  }
};

var createBlockEvents = {
  "click .data-source" (d, template) {
    template.focusResult.set(null);
    Session.set('newHorizontalDataSource', this.source);
  },

  "submit form" (d, template) {
    d.preventDefault();
    if(!template.loadingResults.get()){
      if (!template.existingSearchResults || !template.existingSearchResults({reactive: false}).count()) {  // confirm there are no results yet
        template.search();
      }
    }
  },

  "scroll ol.search-results-container": throttledSearchScrollFn,

  "click .search-results-container li:not(.loading-icon)" (d, template) {
    template.focusResult.set(this);
  },

  "click .add-button": addFocusResult,
  "keydown .text-content.editable" (e, t) {
    if (e.which === 13){
      addFocusResult.apply(this,arguments);
    }
  },
  'click .go-back-button': goBack
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
  var selector = {
    searchQuery: inputs.query,
    searchOption: inputs.option,
    type: this.type
  }

  var newHorizontalDataSource = Session.get('newHorizontalDataSource');

  if (newHorizontalDataSource.indexOf('all_') !== 0){ // naming convention...
    _.extend(selector, {
      source: Session.get('newHorizontalDataSource')
    });
  }
  return SearchResults.find(selector, _.extend({}, options, {sort: {ordinalId: 1} }));
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

  integrationDetails = ContextBlock.searchMappings[source];

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
          authorId : Meteor.user()._id,
          searchQuery : query,
          searchOption : option,
          nextPage: nextPage,
          ordinalId: count(),
          fullDetails: items[i] // include all original details from the api
        });
        _.defaults(item, {
          source: source // for multi-source search, may already have a source
        });

        SearchResults.insert(item);
      });
  });
};



var createTemplateNames = [
  'create_image_section',
  'create_video_section',
  'create_stream_section',
  'create_twitter_section',
  'create_map_section',
  'create_audio_section',
  'create_news_section',
  'create_link_section'
];

_.each(createTemplateNames, function(templateName){
  Template[templateName].helpers(createBlockHelpers);
  Template[templateName].events(createBlockEvents);
  Template[templateName].events({
    "dblclick .search-results-container li:not(.loading-icon)" (d, template) {
      addContext(this);
    }
  });
});

Template.create_text_section.helpers(createBlockHelpers);


Template.create_stream_section.onCreated(function(){
  this.addingFunction = window.addStream;
});

Template.create_stream_section.events({
  "dblclick .search-results-container li:not(.loading-icon)" (d, template) {
    addStream(this, template);
  }
});

Template.create_stream_section.helpers({
  "showBackButton" (d, template) {
    return this.creationStep !== 'find_stream';
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


    this.search = _.bind(searchAPI, this);
    this.existingSearchResults = _.bind(existingSearchResults, this);
    this.getSearchInput = _.bind(getSearchInput, this);
    this.setSearchInput = _.bind(setSearchInput, this);


    this.autorun(function(){
      searchDep.depend();
      that.noMoreResults.set(false);
      that.focusResult.set(null);
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
      if (that.getSearchInput().query && !that.existingSearchResults({reactive: false}).count()) {
        that.search();
      }
    });

  };
};


Template.create_video_section.onCreated(searchTemplateCreatedBoilerplate('video', 'youtube'));
Template.create_video_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_stream_section.onCreated(searchTemplateCreatedBoilerplate('stream', 'all_streaming_services'));
Template.create_stream_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_twitter_section.onCreated(searchTemplateCreatedBoilerplate('twitter', 'twitter'));
Template.create_twitter_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_image_section.onCreated(function(){
  var that = this;
  this.uploadPreview = new ReactiveVar();
  this.uploadStatus = new ReactiveVar();
  var query = _cloudinary.find({});
  this.observeCloudinary = query.observeChanges({ // this query stays live until .stop() is called in the onDestroyed hook
    added (id) { // start upload
      that.uploadStatus.set('Uploading...');
    },
    changed (id, changes) { // upload stream updated
      if (changes.public_id){ // if upload successful
        var doc = _cloudinary.findOne(id);
        var cardModel = ImageBlock;
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
      }
    },
    removed (id) {  // upload failed
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
  uploadMode (){
    return Session.get('newHorizontalDataSource') === 'cloudinary';
  },
  uploadStatus (){
    return Template.instance().uploadStatus.get();
  },
  uploadPreview (){
    return Template.instance().uploadPreview.get();
  },
  previewUrl (){

  }
});

Template.create_image_section.events({
  'change input[type=file]' (e, t){
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



Template.create_audio_section.onCreated(searchTemplateCreatedBoilerplate('audio', 'soundcloud'));
Template.create_audio_section.onRendered(searchTemplateRenderedBoilerplate());

var dataSourcesByType = {
  'stream': [{source: 'all_streaming_services', 'display': 'Livestreams'}],
  'image': [{source: 'flickr', 'display': 'Flickr'}, {source: 'imgur', display: 'Imgur'}, {source: 'cloudinary', display: 'Upload Your Own'}],
  //'gif': [{source: 'giphy', display: 'Giphy'}],
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


Template.create_news_section.onCreated(function() {
  this.type = 'link';
  Session.set('newHorizontalDataSource', 'news');
  this.loadingResults = new ReactiveVar();
  this.noMoreResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();

  var that = this;
  this.search = function(){
    var url = this.$('input[type="search"]').val();
    that.loadingResults.set(true);

    Meteor.call('embedlyExtractResult', url, function(error, result) {
      that.loadingResults.set(false);

      if(error){
        that.noMoreResults.set('No results found');
        return
      }

      if(result && !result.content){
        that.noMoreResults.set('No article found to display'); // TO-DO make this a link card or something?
        return
      }

      that.noMoreResults.set(false);

      var primaryAuthor = result.authors[0];

      that.focusResult.set(new NewsBlock({
        fullDetails: result,
        authorId : Meteor.user()._id,
        searchQuery: url,
        fromEmbedly: true,
        version: 'em1',
        reference: {
          title: result.title,
          description: result.description,
          content: cleanNewsHtml(result.content),
          topImage: result.images[0],
          primaryAuthor: primaryAuthor ? primaryAuthor.name : undefined,
          primaryAuthorUrl: primaryAuthor ? primaryAuthor.url : undefined,
          providerName: result.provider_name,
          providerIconUrl: result.favicon_url,
          url: result.url,
          originalUrl: result.originalUrl,
          publishedMs: result.published,
          publishedOffset: result.offset
        },
        source: 'embedly'
      }));
    });
  };
});

Template.create_news_section.onRendered(function() {
  this.$('input[type="search"]').focus();
});

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

      var addPropertiesToBaseline = function(obj){
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

          cardModel = ImageBlock;

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
              that.focusResult.set(new ImageBlock(addPropertiesToBaseline({
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
  preview (){
    return Template.instance().focusResult.get();
  },
  link () {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return (preview.type === 'link');
    }
  },
  image () {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return preview.type === 'image';
    }
  },
  video () {
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
  'change input[type="radio"]' (e, template) {
    template.search();
  }
});

Template.create_map_section.helpers({
  url () {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return preview.url()
    }
  },
  previewUrl (height, width) {
    var preview = Template.instance().focusResult.get();
    if (preview) {
      return preview.previewUrl(height, width);
    }
  }
});

Template.create_text_section.onCreated(function() {
  this.type = 'text';
  this.focusResult = new ReactiveVar(); // just as a stub
  Session.set('newHorizontalDataSource', 'free_text');
});

Template.create_text_section.onRendered(function() {

  this.$('textarea').focus();
});

Template.create_text_section.events({
  'click .add-button' (e, template){
    e.preventDefault()
    addContext(new TextBlock({
      content: template.$('textarea[name=content]').val(),
      authorId: Meteor.user()._id,
      source: 'plaintext'
    }));
  },
  'click .go-back-button': goBack
});

Template.create_twitter_section.helpers({
  twitterUser () {
    var user = Meteor.user();
    return user.services && user.services.twitter && user.services.twitter.id;
  }
});

Template.search_form.events({
  'change, keydown' (){
    searchDep.changed();
  },
  'change input[type="radio"]' (e,t){
    t.$('form').submit();
  }
});

Template.search_form.onRendered(function(){
  this.randomIdPrefix = Random.id(6);
});


Template.search_form.helpers({
  randomIdPrefix (){
    return Template.instance().randomIdPrefix;
  },
  placeholder () {
    switch(Template.instance().data.placeholderType){
      case 'links':
        return 'e.g. ' +
          _.sample([
            'https://twitter.com/readFOLD',
            'http://nytimes.com',
            'http://flickr.com'
          ]);
        break;
      case 'news':
        return 'e.g. ' +
          _.sample([
            'http://nytimes.com'
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

Template.webcam_setup.events({
  'click .go-back-button': function(){
    Session.set('previousMediaDataType', Session.get('mediaDataType'));
    return Session.set('mediaDataType', null)
  }
});
