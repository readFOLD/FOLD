var searchDep = new Tracker.Dependency();

var i = 0;

var count = function(){
  return i++;
};

var createBlockHelpers = {
  showAddButton (){
    return Template.instance().focusResult.get() ? true : false;
  },
  isFocused  () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      if (this._id === focusResult._id) {
        return true;
      }
    }
  },
  isActive  () {
    var focusResult = Template.instance().focusResult.get();
    if (_.isObject(focusResult)) {
      return true;
    }
  },
  selected () {
    return (this.source === Session.get('newHorizontalDataSource'));
  },
  loading () {
    if (Template.instance().loadingResults)
      return Template.instance().loadingResults.get()
  },
  noMoreResults () {
    if (Template.instance().noMoreResults)
      return Template.instance().noMoreResults.get()
  },
  results  () {
    searchDep.depend();
    return Template.instance().existingSearchResults()
  },
  addingDescription () {
    return Template.instance().addingDescription.get();
  },
  focusResult () {
    var focusResult = Template.instance().focusResult.get();
    if (focusResult) { return focusResult; }
  }
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
  "click .data-source" (d, template) {
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

  "click .add-desc-button"  (d, template) {
    template.addingDescription.set(true);
  },
  "click .back-button"  (d, template) {
    template.addingDescription.set(false);
  },

  "click .add-button": addFocusResult,
  "keydown .text-content.editable" (e, t) {
    if (e.which === 13){
      addFocusResult.apply(this,arguments);
    }
  },
  "click .cancel" () {
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

  searchDep.changed();

  integrationDetails = ContextBlock.searchMappings[source];

  if (integrationDetails.notSearch){ // don't search if it's not a search integration
    return
  }

  Meteor.call(integrationDetails.methodName, query, option, page, (err, results) => {
    this.loadingResults.set(false);
    if (err) {
      this.noMoreResults.set('No more results'); // TO-DO - surface error to user?
      throw(err);
      return;
    }

    var items = results.items;
    var nextPage = results.nextPage;

    if (!items || !items.length) {
      this.noMoreResults.set('No results found');
      return;
    }
    _.chain(items)
      .map(integrationDetails.mapFn || _.identity)
      .each(function(item, i) {
        _.extend(item, {
          type : type,
          source: source,
          authorId : Meteor.userId(),
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



var createTemplateNames = [
  'create_image_section',
  'create_gif_section',
  'create_video_section',
  'create_twitter_section',
  'create_map_section',
  'create_audio_section',
  'create_link_section'
];

_.each(createTemplateNames, function(templateName){
  Template[templateName].helpers(createBlockHelpers);
  Template[templateName].events(createBlockEvents);
});


Template.create_audio_section.events({
  "dblclick .search-results-container li:not(.loading-icon)"  (d, template) {
    addContext(this);
  }
});

Template.create_video_section.events({
  "dblclick .search-results-container li:not(.loading-icon)"  (d, template) {
    addContext(this);
  }
});

Template.create_twitter_section.events({
  "dblclick .search-results-container li:not(.loading-icon)"  (d, template) {
    addContext(this);
  }
});

Template.create_image_section.events({
  "dblclick .search-results-container li:not(.loading-icon)"  (d, template) {
    template.addingDescription.set(true);
  }
});

Template.create_gif_section.events({
  "dblclick .search-results-container li:not(.loading-icon)"  (d, template) {
    template.addingDescription.set(true);
  }
});

searchTemplateCreatedBoilerplate = function(type, defaultSource) {
  return function() {

    this.type = type;
    var previousSource = Session.get('newHorizontalDataSource');
    if (!_.contains(_.pluck(dataSourcesByType[type], 'source'), previousSource)){
      Session.set('newHorizontalDataSource', defaultSource)
    }

    this.loadingResults = new ReactiveVar();
    this.focusResult = new ReactiveVar();
    this.noMoreResults = new ReactiveVar();

    this.addingDescription = new ReactiveVar(false);

    this.autorun(() =>{
      if(this.addingDescription.get()){
        Meteor.setTimeout(function(){
          this.$('textarea').focus();
        });
      }
    });

    this.search = _.bind(searchAPI, this);
    this.existingSearchResults = _.bind(existingSearchResults, this);
    this.getSearchInput = _.bind(getSearchInput, this);
    this.setSearchInput = _.bind(setSearchInput, this);


    this.autorun(() => {
      searchDep.depend();
      this.noMoreResults.set(false);
    });
  };
};

searchTemplateRenderedBoilerplate  = function() {
  return function() {

    // set initial search query to session query
    this.setSearchInput(Session.get('query'));
    searchDep.changed();

    // focus search box
    this.$('input[type="search"]').focus();

    // update session query whenever search input changes
    this.autorun(() => {
      searchDep.depend();
      Session.set('query', this.getSearchInput().query);
    });

    // search when initially arrive and when source changes (if there aren't already results)
    this.autorun(() => {
      Session.get('newHorizontalDataSource');
      if (Session.get('addingContext') && this.getSearchInput().query && !this.existingSearchResults({reactive: false}).count()) {
        this.search();
      }
    });

  };
};


Template.create_video_section.onCreated(searchTemplateCreatedBoilerplate('video', 'youtube'));
Template.create_video_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_twitter_section.onCreated(searchTemplateCreatedBoilerplate('twitter', 'twitter'));
Template.create_twitter_section.onRendered(searchTemplateRenderedBoilerplate());

Template.create_image_section.onCreated(function(){
  this.uploadPreview = new ReactiveVar();
  this.uploadStatus = new ReactiveVar();
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
  }
});

Template.create_image_section.events({
  'change input[type=file]' (e, t){
    var file = _.first(e.target.files);
    if (file){
      if(file.size > CLOUDINARY_FILE_SIZE){
        return notifyImageSizeError();
      }
      t.uploadStatus.set('Uploading...');

      // immediate preview
      var reader = new FileReader;
      reader.onload = function(upload){
        t.uploadPreview.set(upload.target.result);
      };
      reader.readAsDataURL(file);

      // actual upload
      Cloudinary.upload([file], {}, function(err, doc) {
        if(err){
          var input = t.$('input[type=file]');
          t.uploadStatus.set('Upload failed');
          input.val(null);
          input.change(); // trigger change event
        } else {
          var cardModel = doc.format === 'gif' ? GifBlock : ImageBlock;
          // TO-DO consider how to do attribution
          t.uploadStatus.set('Upload successful');
          t.focusResult.set(new cardModel({
            reference: {
              id: doc.public_id,
              fileExtension: doc.format,
              width: doc.width,
              height: doc.height
            },
            source: Session.get('newHorizontalDataSource'),
            authorId : Meteor.userId(),
            fullDetails: doc
          }));
          t.addingDescription.set(true);
        }

      })
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
          authorId : Meteor.userId(),
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

        if(!newObj.reference.thumbnailUrl){
          newObj.reference.thumbnailFallback = _.random(1,13).toString();
        }
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
      return (preview.type === 'image' || preview.type === 'gif');
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
      authorId : Meteor.userId()
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
  previewUrl () {
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

Template.create_text_section.events({
  'click .add-button' (e, template){
    e.preventDefault()
    addContext(new TextBlock({
      content: template.$('textarea[name=content]').val(),
      authorId: Meteor.userId(),
      source: 'plaintext'
    }));
  }
});



Template.create_action_section.onCreated(function(){
  this.editingThumbnail = new ReactiveVar();
  this.uploadingThumbnail = new ReactiveVar();
});
Template.create_action_section.helpers({
  uploadingThumbnail (){
    return Template.instance().uploadingThumbnail.get();
  }
});
Template.create_action_section.events({
  'blur textarea.title' (e,t){
    Session.set('saveState', 'saving');
    Meteor.call('editActionTitle', this._id, t.$('textarea.title').val(), (err, result) => {
      saveCallback(err, result)
    });
  },
  'blur textarea.description' (e,t){
    Session.set('saveState', 'saving');
    Meteor.call('editActionDescription', this._id, t.$('textarea.description').val(), (err, result) => {
      saveCallback(err, result)
    });
  },
  'blur textarea.button-text' (e,t){
    Session.set('saveState', 'saving');
    Meteor.call('editActionButtonText', this._id, t.$('textarea.button-text').val(), (err, result) => {
      saveCallback(err, result)
    });
  },
  'blur textarea.button-url' (e,t){
    Session.set('saveState', 'saving');
    Meteor.call('editActionButtonUrl', this._id, t.$('textarea.button-url').val(), (err, result) => {
      saveCallback(err, result)
    });
  },
  "click input[type=file]" (d, template) {
    return template.editingThumbnail.set(true);
  },
  "change input[type=file]" (e, template){
    var finish = function(){
      template.uploadingThumbnail.set(false);
      return template.editingThumbnail.set(false);
    };

    var file = _.first(e.target.files);
    if (file) {
      if(file.size > CLOUDINARY_FILE_SIZE){
        notifyImageSizeError();
        return finish()
      }
      template.uploadingThumbnail.set(true);
      Cloudinary.upload([file], {}, (err, doc) => {
        if(err){
          var input = template.$('input[type=file]');
          input.val(null);
          input.change();
          saveCallback(err);
          return finish();
        } else {
          var cloudinaryImageInfo = {
            id: doc.public_id,
            fileExtension: doc.format,
            width: doc.width,
            height: doc.height
          };
          Meteor.call('editLinkThumbnail', this._id, cloudinaryImageInfo, (err, result) => {
            saveCallback(err, result);
            return finish()
          });
        }
      })
    } else {
      return finish()
    }
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

Template.search_form.helpers({
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
