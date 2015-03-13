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
  },
  selected: function() {
    return (this.source === Template.instance().source.get());
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
      if (!template.existingSearchResults || !template.existingSearchResults().count()) {  // confirm there are no results yet
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

  if (page === 'end') { // return if at end of possible results
    this.noMoreResults.set(true);
    this.loadingResults.set(false);
    return;
  }

  this.noMoreResults.set(false);
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
    if (!items || !items.length) {
      that.noMoreResults.set(true);
      that.loadingResults.set(false);
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
          referenceUsername : e.channelTitle,
          referenceUserId : e.channelId,
          referenceCreationDate : e.publishedAt.substring(0,10).replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1")
        }
      }
    }
  },
  audio: {
    soundcloud: {
      methodName: 'soundcloudAudioSearchList',
      mapFn: function(e){
        return {
          title: e.title,
          description: e.description,
          referenceId: e.id,
          referenceUsername : e.channelTitle,
          referenceUsernameId : e.user_id,
          referenceCreationDate : e.created_at.substring(0,10).replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"),
          soundcloudArtworkUrl: e.artwork_url
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
          referenceUsername : e.account_url,
          referenceUserId : e.account_id,
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
          referenceId: e.id,
          referenceUsername: e.username,
          referenceSource: e.source
        }
      }
    }
  }
};



var createTemplateNames = [
  'create_image_section',
  'create_gif_section',
  'create_video_section',
  'create_map_section',
  'create_text_section',
  'create_audio_section',
  'create_viz_section'
];

_.each(createTemplateNames, function(templateName){
  Template[templateName].helpers(createBlockHelpers);
  Template[templateName].events(createBlockEvents);
});


Template.create_audio_section.events({
  "dblclick li": function (d, template) {
    addContext(this);
  }
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
    this.noMoreResults = new ReactiveVar();

    this.search = _.bind(searchAPI, this);
    this.existingSearchResults = _.bind(existingSearchResults, this);
    this.getSearchInput = _.bind(getSearchInput, this);
    this.setSearchInput = _.bind(setSearchInput, this);

    var that = this;

    this.autorun(function(){
      searchDep.depend();
      that.noMoreResults.set(false);
      that.loadingResults.set(false);
    });
  };
};

searchTemplateRenderedBoilerplate  = function() {
  return function() {
    var that = this;

    this.autorun(function(){
      searchDep.depend();
      if (that.getSearchInput().query) {
        Session.set('query', that.getSearchInput().query);
      } else {
        that.setSearchInput(Session.get('query'));
      }
    });

  };
};


Template.create_video_section.created = searchTemplateCreatedBoilerplate('video', 'youtube');
Template.create_video_section.rendered = searchTemplateRenderedBoilerplate();


// TODO autosearch when change between sources
Template.create_image_section.created = searchTemplateCreatedBoilerplate('image', 'flickr');
Template.create_image_section.rendered = searchTemplateRenderedBoilerplate();


Template.create_gif_section.created = searchTemplateCreatedBoilerplate('gif', 'giphy');
Template.create_gif_section.rendered = searchTemplateRenderedBoilerplate();


Template.create_audio_section.created = searchTemplateCreatedBoilerplate('audio', 'soundcloud');
Template.create_audio_section.rendered = searchTemplateRenderedBoilerplate();



Template.create_image_section.helpers({
    dataSources: [
      {source: 'flickr', display: 'Flickr'},
      //{source: 'getty', display: 'Getty Images'},
      {source: 'imgur', display: 'Imgur'}
    ]
  }
);

Template.create_viz_section.created = function() {
  this.type = 'viz';
  this.source = new ReactiveVar('oec');

  this.directions = ['import', 'export'];
  this.countries = [{"id": "ago", "name": "Angola"}, {"id": "bdi", "name": "Burundi"}, {"id": "ben", "name": "Benin"}, {"id": "bfa", "name": "Burkina Faso"}, {"id": "bwa", "name": "Botswana"}, {"id": "caf", "name": "Central African Republic"}, {"id": "civ", "name": "Cote d'Ivoire"}, {"id": "cmr", "name": "Cameroon"}, {"id": "cod", "name": "Democratic Republic of the Congo"}, {"id": "cog", "name": "Republic of the Congo"}, {"id": "com", "name": "Comoros"}, {"id": "cpv", "name": "Cape Verde"}, {"id": "dji", "name": "Djibouti"}, {"id": "dza", "name": "Algeria"}, {"id": "egy", "name": "Egypt"}, {"id": "eri", "name": "Eritrea"}, {"id": "esh", "name": "Western Sahara"}, {"id": "eth", "name": "Ethiopia"}, {"id": "gab", "name": "Gabon"}, {"id": "gha", "name": "Ghana"}, {"id": "gin", "name": "Guinea"}, {"id": "gmb", "name": "Gambia"}, {"id": "gnb", "name": "Guinea-Bissau"}, {"id": "gnq", "name": "Equatorial Guinea"}, {"id": "ken", "name": "Kenya"}, {"id": "lbr", "name": "Liberia"}, {"id": "lby", "name": "Libya"}, {"id": "lso", "name": "Lesotho"}, {"id": "mar", "name": "Morocco"}, {"id": "mdg", "name": "Madagascar"}, {"id": "mli", "name": "Mali"}, {"id": "moz", "name": "Mozambique"}, {"id": "mrt", "name": "Mauritania"}, {"id": "mus", "name": "Mauritius"}, {"id": "mwi", "name": "Malawi"}, {"id": "myt", "name": "Mayotte"}, {"id": "nam", "name": "Namibia"}, {"id": "ner", "name": "Niger"}, {"id": "nga", "name": "Nigeria"}, {"id": "reu", "name": "Reunion"}, {"id": "rwa", "name": "Rwanda"}, {"id": "sdn", "name": "Sudan"}, {"id": "sen", "name": "Senegal"}, {"id": "shn", "name": "Saint Helena"}, {"id": "sle", "name": "Sierra Leone"}, {"id": "som", "name": "Somalia"}, {"id": "ssd", "name": "South Sudan"}, {"id": "stp", "name": "Sao Tome and Principe"}, {"id": "swz", "name": "Swaziland"}, {"id": "syc", "name": "Seychelles"}, {"id": "tcd", "name": "Chad"}, {"id": "tgo", "name": "Togo"}, {"id": "tun", "name": "Tunisia"}, {"id": "tza", "name": "Tanzania"}, {"id": "uga", "name": "Uganda"}, {"id": "zaf", "name": "South Africa"}, {"id": "zmb", "name": "Zambia"}, {"id": "zwe", "name": "Zimbabwe"}, {"id": "ata", "name": "Antarctica"}, {"id": "atf", "name": "French South Antarctic Territory"}, {"id": "bvt", "name": "Bouvet Island"}, {"id": "hmd", "name": "Heard Island and McDonald Islands"}, {"id": "sgs", "name": "South Georgia South Sandwich Islands"}, {"id": "afg", "name": "Afghanistan"}, {"id": "are", "name": "United Arab Emirates"}, {"id": "arm", "name": "Armenia"}, {"id": "aze", "name": "Azerbaijan"}, {"id": "bgd", "name": "Bangladesh"}, {"id": "bhr", "name": "Bahrain"}, {"id": "brn", "name": "Brunei"}, {"id": "btn", "name": "Bhutan"}, {"id": "cck", "name": "Cocos (Keeling) Islands"}, {"id": "chn", "name": "China"}, {"id": "cxr", "name": "Christmas Island"}, {"id": "cyp", "name": "Cyprus"}, {"id": "geo", "name": "Georgia"}, {"id": "hkg", "name": "Hong Kong"}, {"id": "idn", "name": "Indonesia"}, {"id": "ind", "name": "India"}, {"id": "iot", "name": "British Indian Ocean Territory"}, {"id": "irn", "name": "Iran"}, {"id": "irq", "name": "Iraq"}, {"id": "isr", "name": "Israel"}, {"id": "jor", "name": "Jordan"}, {"id": "jpn", "name": "Japan"}, {"id": "kaz", "name": "Kazakhstan"}, {"id": "kgz", "name": "Kyrgyzstan"}, {"id": "khm", "name": "Cambodia"}, {"id": "kor", "name": "South Korea"}, {"id": "kwt", "name": "Kuwait"}, {"id": "lao", "name": "Laos"}, {"id": "lbn", "name": "Lebanon"}, {"id": "lka", "name": "Sri Lanka"}, {"id": "mac", "name": "Macau"}, {"id": "mdv", "name": "Maldives"}, {"id": "mid", "name": "Midway"}, {"id": "mmr", "name": "Burma"}, {"id": "mng", "name": "Mongolia"}, {"id": "mys", "name": "Malaysia"}, {"id": "npl", "name": "Nepal"}, {"id": "omn", "name": "Oman"}, {"id": "pak", "name": "Pakistan"}, {"id": "phl", "name": "Philippines"}, {"id": "prk", "name": "North Korea"}, {"id": "pse", "name": "Palestine"}, {"id": "qat", "name": "Qatar"}, {"id": "sau", "name": "Saudi Arabia"}, {"id": "sgp", "name": "Singapore"}, {"id": "syr", "name": "Syria"}, {"id": "tha", "name": "Thailand"}, {"id": "tjk", "name": "Tajikistan"}, {"id": "tkm", "name": "Turkmenistan"}, {"id": "tls", "name": "Timor-Leste"}, {"id": "tur", "name": "Turkey"}, {"id": "twn", "name": "Taiwan"}, {"id": "uzb", "name": "Uzbekistan"}, {"id": "vnm", "name": "Vietnam"}, {"id": "yar", "name": "Yemen Arab Republic"}, {"id": "yem", "name": "Yemen"}, {"id": "ymd", "name": "Democratic Yemen"}, {"id": "alb", "name": "Albania"}, {"id": "and", "name": "Andorra"}, {"id": "aut", "name": "Austria"}, {"id": "bel", "name": "Belgium"}, {"id": "bgr", "name": "Bulgaria"}, {"id": "bih", "name": "Bosnia and Herzegovina"}, {"id": "blr", "name": "Belarus"}, {"id": "blx", "name": "Belgium-Luxembourg"}, {"id": "che", "name": "Switzerland"}, {"id": "chi", "name": "Channel Islands"}, {"id": "csk", "name": "Czechoslovakia"}, {"id": "cze", "name": "Czech Republic"}, {"id": "ddr", "name": "Democratic Republic of Germany"}, {"id": "deu", "name": "Germany"}, {"id": "dnk", "name": "Denmark"}, {"id": "esp", "name": "Spain"}, {"id": "est", "name": "Estonia"}, {"id": "fdr", "name": "Federal Republic of Germany"}, {"id": "fin", "name": "Finland"}, {"id": "fra", "name": "France"}, {"id": "fro", "name": "Faroe Islands"}, {"id": "gbr", "name": "United Kingdom"}, {"id": "gib", "name": "Gibraltar"}, {"id": "grc", "name": "Greece"}, {"id": "hrv", "name": "Croatia"}, {"id": "hun", "name": "Hungary"}, {"id": "imn", "name": "Isle of Man"}, {"id": "irl", "name": "Ireland"}, {"id": "isl", "name": "Iceland"}, {"id": "ita", "name": "Italy"}, {"id": "ksv", "name": "Kosovo"}, {"id": "lie", "name": "Liechtenstein"}, {"id": "ltu", "name": "Lithuania"}, {"id": "lux", "name": "Luxembourg"}, {"id": "lva", "name": "Latvia"}, {"id": "mco", "name": "Monaco"}, {"id": "mda", "name": "Moldova"}, {"id": "mkd", "name": "Macedonia"}, {"id": "mlt", "name": "Malta"}, {"id": "mne", "name": "Montenegro"}, {"id": "nld", "name": "Netherlands"}, {"id": "nor", "name": "Norway"}, {"id": "pol", "name": "Poland"}, {"id": "prt", "name": "Portugal"}, {"id": "rou", "name": "Romania"}, {"id": "rus", "name": "Russia"}, {"id": "scg", "name": "Serbia and Montenegro"}, {"id": "sjm", "name": "Svalbard"}, {"id": "smr", "name": "San Marino"}, {"id": "srb", "name": "Serbia"}, {"id": "sun", "name": "USSR"}, {"id": "svk", "name": "Slovakia"}, {"id": "svn", "name": "Slovenia"}, {"id": "swe", "name": "Sweden"}, {"id": "ukr", "name": "Ukraine"}, {"id": "vat", "name": "Holy See (Vatican City)"}, {"id": "yug", "name": "Yugoslavia"}, {"id": "abw", "name": "Aruba"}, {"id": "aia", "name": "Anguilla"}, {"id": "ant", "name": "Netherlands Antilles"}, {"id": "atg", "name": "Antigua and Barbuda"}, {"id": "bes", "name": "Bonaire"}, {"id": "bhs", "name": "Bahamas"}, {"id": "blz", "name": "Belize"}, {"id": "bmu", "name": "Bermuda"}, {"id": "brb", "name": "Barbados"}, {"id": "can", "name": "Canada"}, {"id": "cri", "name": "Costa Rica"}, {"id": "cub", "name": "Cuba"}, {"id": "cuw", "name": "Cura\u00e7ao"}, {"id": "cym", "name": "Cayman Islands"}, {"id": "dma", "name": "Dominica"}, {"id": "dom", "name": "Dominican Republic"}, {"id": "grd", "name": "Grenada"}, {"id": "grl", "name": "Greenland"}, {"id": "gtm", "name": "Guatemala"}, {"id": "hnd", "name": "Honduras"}, {"id": "hti", "name": "Haiti"}, {"id": "jam", "name": "Jamaica"}, {"id": "kna", "name": "Saint Kitts and Nevis"}, {"id": "lca", "name": "Saint Lucia"}, {"id": "maf", "name": "Saint Maarten"}, {"id": "mex", "name": "Mexico"}, {"id": "msr", "name": "Montserrat"}, {"id": "mtq", "name": "Martinique"}, {"id": "naa", "name": "Netherland Antilles and Aruba"}, {"id": "nic", "name": "Nicaragua"}, {"id": "pan", "name": "Panama"}, {"id": "pci", "name": "Pacific Island (US)"}, {"id": "pcz", "name": "Panama Canal Zone"}, {"id": "pri", "name": "Puerto Rico"}, {"id": "slv", "name": "El Salvador"}, {"id": "spm", "name": "Saint Pierre and Miquelon"}, {"id": "tca", "name": "Turks and Caicos Islands"}, {"id": "tto", "name": "Trinidad and Tobago"}, {"id": "umi", "name": "United States Minor Outlying Islands"}, {"id": "usa", "name": "United States"}, {"id": "vct", "name": "Saint Vincent and the Grenadines"}, {"id": "vgb", "name": "British Virgin Islands"}, {"id": "vir", "name": "Virgin Islands"}, {"id": "asm", "name": "American Samoa"}, {"id": "aus", "name": "Australia"}, {"id": "cok", "name": "Cook Islands"}, {"id": "fji", "name": "Fiji"}, {"id": "fsm", "name": "Micronesia"}, {"id": "glp", "name": "Guadeloupe"}, {"id": "gum", "name": "Guam"}, {"id": "kir", "name": "Kiribati"}, {"id": "mhl", "name": "Marshall Islands"}, {"id": "mnp", "name": "Northern Mariana Islands"}, {"id": "ncl", "name": "New Caledonia"}, {"id": "nfk", "name": "Norfolk Island"}, {"id": "niu", "name": "Niue"}, {"id": "nru", "name": "Nauru"}, {"id": "nzl", "name": "New Zealand"}, {"id": "pcn", "name": "Pitcairn Islands"}, {"id": "plw", "name": "Palau"}, {"id": "png", "name": "Papua New Guinea"}, {"id": "pyf", "name": "French Polynesia"}, {"id": "slb", "name": "Solomon Islands"}, {"id": "tkl", "name": "Tokelau"}, {"id": "ton", "name": "Tonga"}, {"id": "tuv", "name": "Tuvalu"}, {"id": "vut", "name": "Vanuatu"}, {"id": "wlf", "name": "Wallis and Futuna"}, {"id": "wsm", "name": "Samoa"}, {"id": "arg", "name": "Argentina"}, {"id": "bol", "name": "Bolivia"}, {"id": "bra", "name": "Brazil"}, {"id": "chl", "name": "Chile"}, {"id": "col", "name": "Colombia"}, {"id": "ecu", "name": "Ecuador"}, {"id": "flk", "name": "Falkland Islands"}, {"id": "guf", "name": "French Guiana"}, {"id": "guy", "name": "Guyana"}, {"id": "per", "name": "Peru"}, {"id": "pry", "name": "Paraguay"}, {"id": "sur", "name": "Suriname"}, {"id": "ury", "name": "Uruguay"}, {"id": "ven", "name": "Venezuela"}, {"id": "wld", "name": "World"}, {"id": "xxa", "name": "Areas"}];
  this.years = [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];

  this.selectedCountry = new ReactiveVar(this.countries[Math.floor(Math.random() * this.countries.length)].id);
  this.selectedDirection = new ReactiveVar('export');
  this.selectedYear = new ReactiveVar(2012);

  this.focusResult = new ReactiveVar();

  var that = this;
  this.autorun(function() {
    that.focusResult.set(new VizBlock({
      oecCountry: that.selectedCountry.get(),
      oecYear: that.selectedYear.get(),
      oecDirection: that.selectedDirection.get(),
      authorId : Meteor.user()._id,
      type: that.type,
      source: that.source.get()
    }));
  });
};


Template.create_viz_section.rendered = function() {
  $("select").selectOrDie({});
};

Template.create_viz_section.helpers({
    dataSources: [
      {source: 'oec', display: 'Observatory of Economic Complexity'},
    ],
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

Template.create_gif_section.helpers({
    dataSources: [
      {source: 'giphy', display: 'Giphy'}
    ]
  }
);


Template.create_map_section.created = function() {
  this.loadingResults = new ReactiveVar();
  this.focusResult = new ReactiveVar();

  var that = this;
  this.search = function(){
    input = getSearchInput.call(this);

    that.focusResult.set(new MapBlock({
      mapQuery: input.query,
      mapType: input.option,
      authorId : Meteor.user()._id
    }))
  };
};

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
