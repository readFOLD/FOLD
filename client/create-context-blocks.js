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
    return SearchResults.find({
      searchQuery: $('input').val(),
      type: Template.instance().type,
      source: Template.instance().source.get()
    }, {sort: {ordinalId: 1} });
  }
};


searchScrollFn = function(d, template) {
  var searchContainer = $("ol.search-results-container");

  if ((searchContainer.scrollTop() + searchContainer.height()) === searchContainer[0].scrollHeight && !template.loadingResults.get()) {
    if (SearchResults.find({ // confirm there are already results and we're scrolling down
      searchQuery: $('input').val(),
      type: template.type,
      source: template.source.get()
    }).count()){
      template.search($('input').val());
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
    console.log("search button pressed");
    if(!template.loadingResults.get()){
      if (!SearchResults.find({ // confirm there are no results yet
          searchQuery: $('input').val(),
          type: template.type,
          source: template.source.get()
        }).count()) {
        template.search($('input').val());
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


var searchAPI = function(query) {
  var source = this.source.get();
  var type = this.type;
  var page;

  var mostRecentResult = SearchResults.find({
    searchQuery: $('input').val(),
    type: type,
    source: source
  }, {sort: {ordinalId: 1} }).fetch().slice(-1)[0];


  if (mostRecentResult) {
    page = mostRecentResult.nextPage;
  }

  this.loadingResults.set(true);
  var that = this;
  searchDep.changed();

  integrationDetails = searchIntegrations[this.type][source];

  Meteor.call(integrationDetails.methodName, query, page, function(err, results) {
    var items = results.items;
    var nextPage = results.nextPage;
    
    console.log(nextPage);
    console.log(items);

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
  twitter: {
    twitter: {
      methodName: 'twitterSearchList',
      mapFn: function(e){
        return {
          title: e.user.name,
          description: e.text,
          referenceId: e.id,
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
          server: e.server,
          title: e.title
        }
      }
    }
  }
};


Template.create_video_section.helpers(createBlockHelpers);
Template.create_video_section.events(createBlockEvents);

Template.create_video_section.events({
  "dblclick li": function (d, template) {
    addContext(this);
  }
});

Template.create_image_section.helpers(createBlockHelpers);
Template.create_image_section.events(createBlockEvents);

Template.create_map_section.helpers(createBlockHelpers);
Template.create_map_section.events(createBlockEvents);

Template.create_text_section.helpers(createBlockHelpers);
Template.create_text_section.events(createBlockEvents);

Template.create_twitter_section.helpers(createBlockHelpers);
Template.create_twitter_section.events(createBlockEvents);


Template.create_twitter_section.created = function() {
  this.type = 'twitter';
  this.source = new ReactiveVar('twitter');

  this.loadingResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();
  this.search = _.bind(searchAPI, this);
};

Template.create_video_section.created = function() {
  this.type = 'video';
  this.source = new ReactiveVar('youtube');

  this.loadingResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();
  this.search = _.bind(searchAPI, this);
};


// TODO autosearch when change between sources
Template.create_image_section.created = function() {
  this.type = 'image';
  this.source = new ReactiveVar('flickr');

  this.loadingResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();
  this.search = _.bind(searchAPI, this)
};


Template.create_image_section.helpers({
    dataSources: [
      {source: 'flickr', display: 'Flickr'},
      //{source: 'getty', display: 'Getty Images'},
      {source: 'imgur', display: 'Imgur'}
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
