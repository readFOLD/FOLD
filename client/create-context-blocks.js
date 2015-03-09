var searchDep = new Tracker.Dependency();

var i = 0;

var count = function(){
  return i++;
};

var createBlockHelpers = {
  startingBlock: function() {
    if (this instanceof ContextBlock) {
      return this;
    }
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
    return false;
  },
  selected: function() {
    return (this.source === Template.instance().source.get());
  },
  loading: function() {
    if (Template.instance().loadingResults)
      return Template.instance().loadingResults.get()
  },
  results: function () {
    searchDep.depend();
    return Template.instance().existingSearchResults()
  }
};


searchScrollFn = function(d, template) {
  var searchContainer = $("ol.search-results-container");

  if ((searchContainer.scrollTop() + searchContainer.height()) === searchContainer[0].scrollHeight && !template.loadingResults.get()) {
    if (template.existingSearchResults().count()){ // confirm there are already results and we're scrolling down{
      template.search();
    }
  }
};

throttledSearchScrollFn = _.throttle(searchScrollFn, 20);

var addContext = function(contextBlock) {
  var contextId = ContextBlocks.insert(contextBlock);
  return window.addContextToStory(Session.get("storyId"), contextId, Session.get("currentY"));
};

var createBlockEvents = {
  "click .data-source": function(d, template) {
    template.source.set(this.source);
  },

  "submit form": function(d, template) {
    d.preventDefault();
    if(!template.loadingResults.get()){
      if (!template.existingSearchResults().count()) {  // confirm there are no results yet
        template.search();
      }
    }
  },

  "scroll ol.search-results-container": throttledSearchScrollFn,

  "click li": function(d, template) {
    template.focusResult.set(this);
  },

  "click .add-button": function(d, template) {
    addContext(template.focusResult.get());
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
      option: this.$('input:radio').val()
    }
  } catch (e) {
    return {};
  }

};


var existingSearchResults = function(){
  inputs = getSearchInput.call(this);
  return SearchResults.find({
    searchQuery: inputs.query,
    searchOption: inputs.option,
    type: this.type,
    source: this.source.get()
  }, {sort: {ordinalId: 1} })
};



var searchAPI = function(query) {
  var source = this.source.get();
  var type = this.type;
  var page;

  var inputs = getSearchInput.call(this);
  var query = inputs.query;
  var option = inputs.option;

  var mostRecentResult = this.existingSearchResults().fetch().slice(-1)[0];


  if (mostRecentResult) {
    page = mostRecentResult.nextPage;
  }

  if (page === 'end'){ // return if at end of possible results
    return;
  }

  this.loadingResults.set(true);
  var that = this;
  searchDep.changed();

  integrationDetails = searchIntegrations[this.type][source];

  Meteor.call(integrationDetails.methodName, query, option, page, function(err, results) {
    var items = results.items;
    var nextPage = results.nextPage;

    if (err) {
      alert(err);
      return;
    }
    if (!items) {
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

    // finish search
    that.loadingResults.set(false);
  });
};

var searchIntegrations = {
  video: {
    youtube: {
      methodName: 'youtubeVideoSearchList',
      mapFn: function(e){
        return {
          title: e.title,
          description: e.description,
          referenceId: e.videoId,
          videoUsername : e.channelTitle,
          videoUsernameId : e.channelId,
          videoCreationDate : e.publishedAt.substring(0,10).replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1")
        }
      }
    }
  },
  image: {
    imgur: {
      methodName: 'imgurImageSearchList',
      mapFn: function(e) {
        return {
          referenceId : e.id,
          fileExtension: e.link.substring(e.link.lastIndexOf('.') + 1),
          section : e.section,
          title : e.title
        }
      }
    },
    flickr: {
      methodName: 'flickrImageSearchList',
      mapFn: function(e) {
        return {
          flickrImgFarm: e.farm,
          flickrImgSecret: e.secret,
          referenceId: e.id,
          flickrServer: e.server,
          title: e.title
        }
      }
    }
  },
  gif: {
    giphy: {
      methodName: 'giphyGifSearchList',
      mapFn: function(e){
        return {
          referenceId: e.id
          //username: "mrdiv",
          //source: "http://mrdiv.tumblr.com/post/48618427039/disco-sphere",
        }
      }
    }
  }
};



createTemplateNames = [
  'create_image_section',
  'create_gif_section',
  'create_video_section',
  'create_map_section',
  'create_text_section'
]

_.each(createTemplateNames, function(templateName){
  Template[templateName].helpers(createBlockHelpers);
  Template[templateName].events(createBlockEvents);
});


Template.create_video_section.events({
  "dblclick li": function (d, template) {
    addContext(this);
  }
});

searchTemplateCreatedBoilerplate = function(type, defaultSource) {
  return function() {
    this.type = type;
    this.source = new ReactiveVar(defaultSource);

    this.loadingResults = new ReactiveVar();
    this.focusResult = new ReactiveVar();
    this.search = _.bind(searchAPI, this);
    this.existingSearchResults = _.bind(existingSearchResults, this);
  };
};

Template.create_video_section.created = searchTemplateCreatedBoilerplate('video', 'youtube');


// TODO autosearch when change between sources
Template.create_image_section.created = searchTemplateCreatedBoilerplate('image', 'flickr');

Template.create_gif_section.created = searchTemplateCreatedBoilerplate('gif', 'giphy');


Template.create_image_section.helpers({
    dataSources: [
      {source: 'flickr', display: 'Flickr'},
      //{source: 'getty', display: 'Getty Images'},
      {source: 'imgur', display: 'Imgur'}
    ]
  }
);


Template.create_gif_section.helpers({
    dataSources: [
      {source: 'giphy', display: 'Giphy'}
    ]
  }
);


Template.create_map_section.created = function() {
  return this.blockPreview = new ReactiveVar();
};

Template.create_map_section.helpers({
  url: function() {
    var preview = Template.instance().blockPreview.get();
    if (preview) {
      return preview.url()
    }
  },
  previewUrl: function() {
    var preview = Template.instance().blockPreview.get();
    if (preview) {
      return preview.previewUrl()
    }
  }
});



Template.create_map_section.events({
  "click .search": function(e, template) {
    var block, previewMapBlock;
    block = AutoForm.getFormValues('createMapSectionForm').insertDoc;
    previewMapBlock = new MapBlock(_.extend(block, {
      source: 'google_maps'
    }));
    return template.blockPreview.set(previewMapBlock);
  },
  "click .cancel": function() {
    Session.set('addingContext', false);
    return Session.set('editingContext', null);
  }
});


Template.create_text_section.helpers({
  startingBlock: function() {
    if (this instanceof ContextBlock) {
      return this;
    }
  }
});

Template.search_form.events({
  'keydown': function(){
    searchDep.changed();
  }
});

Template.search_form.helpers({
  placeholder: function() {
    return 'e.g. ' +
      _.sample([
        'radar technology',
        'competitive fly fishing',
        'net neutrality',
        'synthetic biology',
        'beekeeping',
        'quantum physics',
        'bitcoin mining',
        'glass blowing',
        'falconry',
        'origami',
        'table tennis',
        ]);
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
