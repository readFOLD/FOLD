var ContextBlock, MapBlock, Schema, Story, TextBlock, VideoBlock, ImageBlock, AudioBlock, VizBlock, checkOwner,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var checkOwner = function(userId, doc) {
  return userId && userId === doc.authorId;
};

SimpleSchema.debug = true; // TODO Remove after launch

Schema = {};

Story = (function() {
  function Story(doc) {
    _.extend(this, doc);
    if (this.verticalSections == null) {
      this.verticalSections = [];
    }
    if (this.published == null) {
      this.published = false;
    }
    if (this.verticalSections.length === 0) {
      this.verticalSections.push({
        _id: Random.id(8),
        contextBlocks: [],
        title: "",
        content: ""
      });
    }
  }

  Story.prototype.contentPreview = function() {
    var content;
    if (content = this.verticalSections[0].content) {
      return content.replace(/(<([^>]+)>)/ig, "");
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


  Story.prototype.publish = function() {
    var dasherizedTitle;
    if (!this.savedAt) {
      throw new Meteor.Error('not-yet-saved');
    }
    if (this.published) {
      throw new Meteor.Error('already-published');
    }
    dasherizedTitle = _s.slugify(this.title.toLowerCase());
    alert('TODO actually do this')
    //if (confirm('Your story will have the url path: /' + dasherizedTitle)) {
    //  return Stories.update({
    //    _id: this._id
    //  }, {
    //    $set: {
    //      published: true,
    //      publishedDate: new Date,
    //      savedAt: new Date
    //    }
    //  });
    //}
  };

  var sum = function(a,b){ return a+b; };

  Story.prototype.contextCountOfType = function(type) {
    return this.verticalSections.map(function(verticalSection){
      return verticalSection.contextBlocks.reduce(function(count, contextBlock){
        if(contextBlock.type === type){
          count++;
        }
        return count;
      }, 0)
    }).reduce(sum, 0)
  };

  return Story;

})();


var cleanHtmlOptions = {
  allowedTags: ['strong', 'em', 'u', 'a'], // only allow tags used in fold-editor
  format: false,
  removeAttrs: ['class', 'id', 'href'], // strip away hrefs and other undesired attributes that might slip into a paste
  allowedAttributes: [["data-context-id"],["data-context-type"],["data-context-source"]] // data-context-id is used to direct links to context cards
};

var matchAnchors =  /<a( data-context-id=["|'].*?["|'])?( data-context-type=["|'].*?["|'])?( data-context-source=["|'].*?["|'])?.*?>/gm; // match anchors, capture data-context-id and other attributes so it can be kept in string
var matchBlankAnchors = /<a href="javascript:void\(0\);">(.*?)<\/a>/gm; // match anchors that are left over from above if copied from somewhere else, capture contents so can be kept

cleanVerticalSectionContent = function(html) {
  
  return $.htmlClean(html, cleanHtmlOptions)
    .replace(matchAnchors, '<a href="javascript:void(0);"$1$2$3>') // add js void to all anchors and keep all data-context-ids and other data attributes
    .replace(matchBlankAnchors, '$1'); // remove anchors without data-context-ids
};

if (Meteor.isClient) {
  window.Story = Story;
  window.cleanVerticalSectionContent = cleanVerticalSectionContent;
}

this.Stories = new Meteor.Collection("stories", {
  transform: function(doc) {
    if (doc.draftStory){
      _.extend(doc.draftStory, {
        unpublishedChanges: (!doc.publishedAt || doc.savedAt > doc.publishedAt),
        savedAt: doc.savedAt,
        contextCountOfType: function(){} // stub out method for now
      });
    }
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

Schema.Stories = new SimpleSchema({
  draftStory: {
    type: Object,
    optional: true,
    blackbox: true
  },
  backgroundImage: {
    type: String,
    optional: true
  },
  shortId: {
    type: String
  },
  headerImageAttribution: {
    type: String,
    optional: true
  },
  savedAt: {
    type: Date
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
    }
  },
  published: {
    type: Boolean,
    defaultValue: false
  },
  userPathSegment: {
    type: String
  },
  storyPathSegment: {
    type: String
  },
  title: {
    type: String,
    defaultValue: ''
  },
  authorId: {
    type: String
  },
  authorName: {
    type: String
  },
  keywords:{
    type: [String],
    defaultValue: []
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
  views: {
    type: Number,
    defaultValue: 0
  },
  shared: {
    type: Number,
    defaultValue: 0
  },
  verticalSections: {
    type: [Object],
    minCount: 1,
    maxCount: 1000,
    blackbox: true // TODO remove this when stops causing errors! (after Mongo 2.6 and use position operators?)
  },
  'verticalSections.$._id': {
    type: String
  },
  'verticalSections.$.title': {
    type: String,
    optional: true
  },
  'verticalSections.$.hasTitle': {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  'verticalSections.$.content': {
    type: String
  },
  'verticalSections.$.contextBlocks': {
    type: [Object],
    defaultValue: [],
    blackbox: true // TODO actually define schema
  }
});

this.Stories.attachSchema(Schema.Stories);

ContextBlock = (function() {
  function ContextBlock(doc) {
    _.extend(this, doc);
  }

  return ContextBlock;

})();

VideoBlock = (function(_super) {
  __extends(VideoBlock, _super);

  function VideoBlock(doc) {
    VideoBlock.__super__.constructor.call(this, doc);
    this.type = 'video';
    if (this.source == null) {
      this.source = 'youtube';
    }
  }

  VideoBlock.prototype.url = function() {
    if (this.source === 'youtube') {
      return '//www.youtube.com/embed/' + this.reference.id;
    } else if (this.source === 'vimeo') {
      return '//player.vimeo.com/video/' + this.reference.id;
    }
  };

  VideoBlock.prototype.previewUrl = function() {
    if (this.source === 'youtube') {
      return '//img.youtube.com/vi/' + this.reference.id + '/0.jpg';
    }
  };

  VideoBlock.prototype.thumbnailUrl = function() {
    if (this.source === 'youtube') {
      return '//i.ytimg.com/vi/' + this.reference.id + '/default.jpg';
    }
  };

  VideoBlock.prototype.anchorMenuSnippet = function() {
    return this.reference.title;
  };

  return VideoBlock;

})(ContextBlock);

AudioBlock = (function(_super) {
  __extends(AudioBlock, _super);

  function AudioBlock(doc) {
    AudioBlock.__super__.constructor.call(this, doc);
    this.type = 'audio';
    if (this.source == null) {
      this.source = 'soundcloud';
    }
  }

  AudioBlock.prototype.url = function() {
    if (this.source === 'soundcloud') {
      return '//w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + this.reference.id + '&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true'
    }
  };

  AudioBlock.prototype.artworkUrl = function() {
    if (this.source === 'soundcloud') {
      return this.reference.artworkUrl;
    }
  };

  AudioBlock.prototype.anchorMenuSnippet = function() {
    return this.reference.title;
  };


  return AudioBlock;

})(ContextBlock);

ImageBlock = (function(_super) {
  __extends(ImageBlock, _super);

  function ImageBlock(doc) {
    ImageBlock.__super__.constructor.call(this, doc);
    this.type = 'image';
    if (!this.source) { // TO-DO Remove
      this.source = 'imgur';
    }
  }

  ImageBlock.prototype.url = function() {
    switch (this.source) {
      case 'local':
        return '/' + this.reference.id;
      case 'imgur':
        return '//i.imgur.com/' + this.reference.id + '.' + this.reference.fileExtension;
      case 'flickr':
        return '//farm' + this.reference.imgFarm + '.staticflickr.com/' + this.reference.server + '/' + this.reference.id + '_' + this.reference.imgSecret + '.jpg'
    }
  };

  ImageBlock.prototype.thumbnailUrl = function() {
    switch (this.source) {
      case 'local':
        return '/' + this.reference.id;
      case 'imgur':
        return '//i.imgur.com/' + this.reference.id + 't' + '.' + this.reference.fileExtension;
      case 'flickr':
        return '//farm' + this.reference.imgFarm + '.staticflickr.com/' + this.reference.server + '/' + this.reference.id + '_' + this.reference.imgSecret + '_t' + '.jpg'
    }
  };

  ImageBlock.prototype.anchorMenuSnippet = function() {
    return this.title;
  };

  return ImageBlock;

})(ContextBlock);

GifBlock = (function(_super) {
  __extends(GifBlock, _super);

  function GifBlock(doc) {
    GifBlock.__super__.constructor.call(this, doc);
    this.type = 'gif';
  }

  GifBlock.prototype.url = function() {
    switch (this.source) {
      case 'giphy':
        return 'http://media4.giphy.com/media/' + this.reference.id + '/giphy.gif'
    }
  };

  GifBlock.prototype.thumbnailUrl = function() {
    switch (this.source) {
      case 'giphy':
        return 'http://media4.giphy.com/media/' + this.reference.id + '/200_d.gif'
    }
  };

  GifBlock.prototype.anchorMenuSnippet = function() {
    return this.reference.id;
  };

  return GifBlock;

})(ContextBlock);


VizBlock = (function(_super) {
  __extends(VizBlock, _super);

  function VizBlock(doc) {
    VizBlock.__super__.constructor.call(this, doc);
    this.type = 'viz';
  }

  VizBlock.prototype.url = function() {
    switch (this.source) {
      case 'oec':
        return 'http://atlas.media.mit.edu/explore/embed/tree_map/hs/' + this.oecDirection + '/' + this.oecCountry + '/all/show/' + this.oecYear + '/?controls=false&lang=en'
    }
  };

  VizBlock.countries = [{"id": "ago", "name": "Angola"}, {"id": "bdi", "name": "Burundi"}, {"id": "ben", "name": "Benin"}, {"id": "bfa", "name": "Burkina Faso"}, {"id": "bwa", "name": "Botswana"}, {"id": "caf", "name": "Central African Republic"}, {"id": "civ", "name": "Cote d'Ivoire"}, {"id": "cmr", "name": "Cameroon"}, {"id": "cod", "name": "Democratic Republic of the Congo"}, {"id": "cog", "name": "Republic of the Congo"}, {"id": "com", "name": "Comoros"}, {"id": "cpv", "name": "Cape Verde"}, {"id": "dji", "name": "Djibouti"}, {"id": "dza", "name": "Algeria"}, {"id": "egy", "name": "Egypt"}, {"id": "eri", "name": "Eritrea"}, {"id": "esh", "name": "Western Sahara"}, {"id": "eth", "name": "Ethiopia"}, {"id": "gab", "name": "Gabon"}, {"id": "gha", "name": "Ghana"}, {"id": "gin", "name": "Guinea"}, {"id": "gmb", "name": "Gambia"}, {"id": "gnb", "name": "Guinea-Bissau"}, {"id": "gnq", "name": "Equatorial Guinea"}, {"id": "ken", "name": "Kenya"}, {"id": "lbr", "name": "Liberia"}, {"id": "lby", "name": "Libya"}, {"id": "lso", "name": "Lesotho"}, {"id": "mar", "name": "Morocco"}, {"id": "mdg", "name": "Madagascar"}, {"id": "mli", "name": "Mali"}, {"id": "moz", "name": "Mozambique"}, {"id": "mrt", "name": "Mauritania"}, {"id": "mus", "name": "Mauritius"}, {"id": "mwi", "name": "Malawi"}, {"id": "myt", "name": "Mayotte"}, {"id": "nam", "name": "Namibia"}, {"id": "ner", "name": "Niger"}, {"id": "nga", "name": "Nigeria"}, {"id": "reu", "name": "Reunion"}, {"id": "rwa", "name": "Rwanda"}, {"id": "sdn", "name": "Sudan"}, {"id": "sen", "name": "Senegal"}, {"id": "shn", "name": "Saint Helena"}, {"id": "sle", "name": "Sierra Leone"}, {"id": "som", "name": "Somalia"}, {"id": "ssd", "name": "South Sudan"}, {"id": "stp", "name": "Sao Tome and Principe"}, {"id": "swz", "name": "Swaziland"}, {"id": "syc", "name": "Seychelles"}, {"id": "tcd", "name": "Chad"}, {"id": "tgo", "name": "Togo"}, {"id": "tun", "name": "Tunisia"}, {"id": "tza", "name": "Tanzania"}, {"id": "uga", "name": "Uganda"}, {"id": "zaf", "name": "South Africa"}, {"id": "zmb", "name": "Zambia"}, {"id": "zwe", "name": "Zimbabwe"}, {"id": "ata", "name": "Antarctica"}, {"id": "atf", "name": "French South Antarctic Territory"}, {"id": "bvt", "name": "Bouvet Island"}, {"id": "hmd", "name": "Heard Island and McDonald Islands"}, {"id": "sgs", "name": "South Georgia South Sandwich Islands"}, {"id": "afg", "name": "Afghanistan"}, {"id": "are", "name": "United Arab Emirates"}, {"id": "arm", "name": "Armenia"}, {"id": "aze", "name": "Azerbaijan"}, {"id": "bgd", "name": "Bangladesh"}, {"id": "bhr", "name": "Bahrain"}, {"id": "brn", "name": "Brunei"}, {"id": "btn", "name": "Bhutan"}, {"id": "cck", "name": "Cocos (Keeling) Islands"}, {"id": "chn", "name": "China"}, {"id": "cxr", "name": "Christmas Island"}, {"id": "cyp", "name": "Cyprus"}, {"id": "geo", "name": "Georgia"}, {"id": "hkg", "name": "Hong Kong"}, {"id": "idn", "name": "Indonesia"}, {"id": "ind", "name": "India"}, {"id": "iot", "name": "British Indian Ocean Territory"}, {"id": "irn", "name": "Iran"}, {"id": "irq", "name": "Iraq"}, {"id": "isr", "name": "Israel"}, {"id": "jor", "name": "Jordan"}, {"id": "jpn", "name": "Japan"}, {"id": "kaz", "name": "Kazakhstan"}, {"id": "kgz", "name": "Kyrgyzstan"}, {"id": "khm", "name": "Cambodia"}, {"id": "kor", "name": "South Korea"}, {"id": "kwt", "name": "Kuwait"}, {"id": "lao", "name": "Laos"}, {"id": "lbn", "name": "Lebanon"}, {"id": "lka", "name": "Sri Lanka"}, {"id": "mac", "name": "Macau"}, {"id": "mdv", "name": "Maldives"}, {"id": "mid", "name": "Midway"}, {"id": "mmr", "name": "Burma"}, {"id": "mng", "name": "Mongolia"}, {"id": "mys", "name": "Malaysia"}, {"id": "npl", "name": "Nepal"}, {"id": "omn", "name": "Oman"}, {"id": "pak", "name": "Pakistan"}, {"id": "phl", "name": "Philippines"}, {"id": "prk", "name": "North Korea"}, {"id": "pse", "name": "Palestine"}, {"id": "qat", "name": "Qatar"}, {"id": "sau", "name": "Saudi Arabia"}, {"id": "sgp", "name": "Singapore"}, {"id": "syr", "name": "Syria"}, {"id": "tha", "name": "Thailand"}, {"id": "tjk", "name": "Tajikistan"}, {"id": "tkm", "name": "Turkmenistan"}, {"id": "tls", "name": "Timor-Leste"}, {"id": "tur", "name": "Turkey"}, {"id": "twn", "name": "Taiwan"}, {"id": "uzb", "name": "Uzbekistan"}, {"id": "vnm", "name": "Vietnam"}, {"id": "yar", "name": "Yemen Arab Republic"}, {"id": "yem", "name": "Yemen"}, {"id": "ymd", "name": "Democratic Yemen"}, {"id": "alb", "name": "Albania"}, {"id": "and", "name": "Andorra"}, {"id": "aut", "name": "Austria"}, {"id": "bel", "name": "Belgium"}, {"id": "bgr", "name": "Bulgaria"}, {"id": "bih", "name": "Bosnia and Herzegovina"}, {"id": "blr", "name": "Belarus"}, {"id": "blx", "name": "Belgium-Luxembourg"}, {"id": "che", "name": "Switzerland"}, {"id": "chi", "name": "Channel Islands"}, {"id": "csk", "name": "Czechoslovakia"}, {"id": "cze", "name": "Czech Republic"}, {"id": "ddr", "name": "Democratic Republic of Germany"}, {"id": "deu", "name": "Germany"}, {"id": "dnk", "name": "Denmark"}, {"id": "esp", "name": "Spain"}, {"id": "est", "name": "Estonia"}, {"id": "fdr", "name": "Federal Republic of Germany"}, {"id": "fin", "name": "Finland"}, {"id": "fra", "name": "France"}, {"id": "fro", "name": "Faroe Islands"}, {"id": "gbr", "name": "United Kingdom"}, {"id": "gib", "name": "Gibraltar"}, {"id": "grc", "name": "Greece"}, {"id": "hrv", "name": "Croatia"}, {"id": "hun", "name": "Hungary"}, {"id": "imn", "name": "Isle of Man"}, {"id": "irl", "name": "Ireland"}, {"id": "isl", "name": "Iceland"}, {"id": "ita", "name": "Italy"}, {"id": "ksv", "name": "Kosovo"}, {"id": "lie", "name": "Liechtenstein"}, {"id": "ltu", "name": "Lithuania"}, {"id": "lux", "name": "Luxembourg"}, {"id": "lva", "name": "Latvia"}, {"id": "mco", "name": "Monaco"}, {"id": "mda", "name": "Moldova"}, {"id": "mkd", "name": "Macedonia"}, {"id": "mlt", "name": "Malta"}, {"id": "mne", "name": "Montenegro"}, {"id": "nld", "name": "Netherlands"}, {"id": "nor", "name": "Norway"}, {"id": "pol", "name": "Poland"}, {"id": "prt", "name": "Portugal"}, {"id": "rou", "name": "Romania"}, {"id": "rus", "name": "Russia"}, {"id": "scg", "name": "Serbia and Montenegro"}, {"id": "sjm", "name": "Svalbard"}, {"id": "smr", "name": "San Marino"}, {"id": "srb", "name": "Serbia"}, {"id": "sun", "name": "USSR"}, {"id": "svk", "name": "Slovakia"}, {"id": "svn", "name": "Slovenia"}, {"id": "swe", "name": "Sweden"}, {"id": "ukr", "name": "Ukraine"}, {"id": "vat", "name": "Holy See (Vatican City)"}, {"id": "yug", "name": "Yugoslavia"}, {"id": "abw", "name": "Aruba"}, {"id": "aia", "name": "Anguilla"}, {"id": "ant", "name": "Netherlands Antilles"}, {"id": "atg", "name": "Antigua and Barbuda"}, {"id": "bes", "name": "Bonaire"}, {"id": "bhs", "name": "Bahamas"}, {"id": "blz", "name": "Belize"}, {"id": "bmu", "name": "Bermuda"}, {"id": "brb", "name": "Barbados"}, {"id": "can", "name": "Canada"}, {"id": "cri", "name": "Costa Rica"}, {"id": "cub", "name": "Cuba"}, {"id": "cuw", "name": "Cura\u00e7ao"}, {"id": "cym", "name": "Cayman Islands"}, {"id": "dma", "name": "Dominica"}, {"id": "dom", "name": "Dominican Republic"}, {"id": "grd", "name": "Grenada"}, {"id": "grl", "name": "Greenland"}, {"id": "gtm", "name": "Guatemala"}, {"id": "hnd", "name": "Honduras"}, {"id": "hti", "name": "Haiti"}, {"id": "jam", "name": "Jamaica"}, {"id": "kna", "name": "Saint Kitts and Nevis"}, {"id": "lca", "name": "Saint Lucia"}, {"id": "maf", "name": "Saint Maarten"}, {"id": "mex", "name": "Mexico"}, {"id": "msr", "name": "Montserrat"}, {"id": "mtq", "name": "Martinique"}, {"id": "naa", "name": "Netherland Antilles and Aruba"}, {"id": "nic", "name": "Nicaragua"}, {"id": "pan", "name": "Panama"}, {"id": "pci", "name": "Pacific Island (US)"}, {"id": "pcz", "name": "Panama Canal Zone"}, {"id": "pri", "name": "Puerto Rico"}, {"id": "slv", "name": "El Salvador"}, {"id": "spm", "name": "Saint Pierre and Miquelon"}, {"id": "tca", "name": "Turks and Caicos Islands"}, {"id": "tto", "name": "Trinidad and Tobago"}, {"id": "umi", "name": "United States Minor Outlying Islands"}, {"id": "usa", "name": "United States"}, {"id": "vct", "name": "Saint Vincent and the Grenadines"}, {"id": "vgb", "name": "British Virgin Islands"}, {"id": "vir", "name": "Virgin Islands"}, {"id": "asm", "name": "American Samoa"}, {"id": "aus", "name": "Australia"}, {"id": "cok", "name": "Cook Islands"}, {"id": "fji", "name": "Fiji"}, {"id": "fsm", "name": "Micronesia"}, {"id": "glp", "name": "Guadeloupe"}, {"id": "gum", "name": "Guam"}, {"id": "kir", "name": "Kiribati"}, {"id": "mhl", "name": "Marshall Islands"}, {"id": "mnp", "name": "Northern Mariana Islands"}, {"id": "ncl", "name": "New Caledonia"}, {"id": "nfk", "name": "Norfolk Island"}, {"id": "niu", "name": "Niue"}, {"id": "nru", "name": "Nauru"}, {"id": "nzl", "name": "New Zealand"}, {"id": "pcn", "name": "Pitcairn Islands"}, {"id": "plw", "name": "Palau"}, {"id": "png", "name": "Papua New Guinea"}, {"id": "pyf", "name": "French Polynesia"}, {"id": "slb", "name": "Solomon Islands"}, {"id": "tkl", "name": "Tokelau"}, {"id": "ton", "name": "Tonga"}, {"id": "tuv", "name": "Tuvalu"}, {"id": "vut", "name": "Vanuatu"}, {"id": "wlf", "name": "Wallis and Futuna"}, {"id": "wsm", "name": "Samoa"}, {"id": "arg", "name": "Argentina"}, {"id": "bol", "name": "Bolivia"}, {"id": "bra", "name": "Brazil"}, {"id": "chl", "name": "Chile"}, {"id": "col", "name": "Colombia"}, {"id": "ecu", "name": "Ecuador"}, {"id": "flk", "name": "Falkland Islands"}, {"id": "guf", "name": "French Guiana"}, {"id": "guy", "name": "Guyana"}, {"id": "per", "name": "Peru"}, {"id": "pry", "name": "Paraguay"}, {"id": "sur", "name": "Suriname"}, {"id": "ury", "name": "Uruguay"}, {"id": "ven", "name": "Venezuela"}, {"id": "wld", "name": "World"}, {"id": "xxa", "name": "Areas"}];

  VizBlock.prototype.oecCountryName = function() {
    switch (this.source) {
      case 'oec':
        if (this.oecCountry) {
          return _.findWhere(VizBlock.countries, {id: this.oecCountry})['name'];
        }
    }
  };


  VizBlock.prototype.description = function() {
    switch (this.source) {
      case 'oec':
        return this.oecCountryName() + " " + this.oecDirection + "s in " + this.oecYear;
    }
  };

  VizBlock.prototype.anchorMenuSnippet = function() {
    switch (this.source) {
      case 'oec':
        return this.oecCountryName() + " (" + this.oecYear + ")";
    }
  };

  return VizBlock;

})(ContextBlock);


MapBlock = (function(_super) {
  __extends(MapBlock, _super);

  function MapBlock(doc) {
    MapBlock.__super__.constructor.call(this, doc);
    this.type = 'map';
    if (this.source == null) {
      this.source = 'google_maps';
    }
  }

  MapBlock.prototype.description = function() {
    return this.mapQuery;
  };

  MapBlock.prototype.anchorMenuSnippet = function() {
    return this.mapQuery;
  };

  MapBlock.prototype.escape = function(value) {
    return encodeURIComponent(value).replace(/%20/g, "+");
  };

  MapBlock.prototype.url = function() {
    if (this.source === 'google_maps') {
      return 'https://www.google.com/maps/embed/v1/place?' + 'key=' + GOOGLE_API_CLIENT_KEY + '&q=' + this.escape(this.mapQuery) + '&maptype=' + this.escape(this.mapType);
    }
  };

  MapBlock.prototype.previewUrl = function() {
    if (this.source === 'google_maps') {
      return 'https://maps.googleapis.com/maps/api/staticmap?' + 'key=' + GOOGLE_API_CLIENT_KEY + '&center=' + this.escape(this.mapQuery) + '&maptype=' + this.escape(this.mapType) + '&size=' + '520x300';
    }
  };

  return MapBlock;

})(ContextBlock);

TextBlock = (function(_super) {
  __extends(TextBlock, _super);

  function TextBlock(doc) {
    TextBlock.__super__.constructor.call(this, doc);
    this.type = 'text';
  }

  TextBlock.prototype.description = function() {
    var maxLength;
    maxLength = 40;
    if (this.content.length <= maxLength) {
      return this.content;
    } else {
      return this.content.slice(0, maxLength) + '...';
    }
  };

  TextBlock.prototype.anchorMenuSnippet = function() {
    return this.content;
  };

  return TextBlock;

})(ContextBlock);


var newTypeSpecificContextBlock =  function(doc) {
  switch (doc.type) {
    case 'video':
      return new VideoBlock(doc);
    case 'text':
      return new TextBlock(doc);
    case 'map':
      return new MapBlock(doc);
    case 'image':
      return new ImageBlock(doc);
    case 'gif':
      return new GifBlock(doc);
    case 'audio':
      return new AudioBlock(doc);
    case 'viz':
      return new VizBlock(doc);
    default:
      return new ContextBlock(doc);
  }
};

if (Meteor.isClient) {
  window.VideoBlock = VideoBlock;
  window.MapBlock = MapBlock;
  window.ContextBlock = ContextBlock;
  window.TextBlock = TextBlock;
  window.ImageBlock = ImageBlock;
  window.AudioBlock = AudioBlock;
  window.VizBlock = VizBlock;
  window.newTypeSpecificContextBlock = newTypeSpecificContextBlock
}


this.ContextBlocks = new Meteor.Collection("context_blocks", {
  transform: newTypeSpecificContextBlock
});

this.ContextBlocks.allow({
  insert: function(userId, doc) {
    return checkOwner(userId, doc);
  },
  update: function(userId, doc) {
    if (_.contains(fieldNames, 'authorId')) {
      return false;
    }
    return checkOwner(userId, doc);
  },
  remove: function(userId, doc) {
    return checkOwner(userId, doc);
  }
});

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

  imgFarm: {
    type: String,
    optional: true
  },
  imgSecret: {
    type: String,
    optional: true
  },
  server: {
  type: String,
    optional: true
  },


})

Schema.ContextBlocks = new SimpleSchema({
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
  fullDetails: {
    type: Object,
    optional: true,
    blackbox: true
  },
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
    defaultValue: 'satellite',
    optional: true,
    autoform: {
      afFieldInput: {
        firstOption: false,
        options: 'allowed'
      }
    }
  },
  content: {
    type: String,
    label: "Text",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        "class": "text-input"
      }
    }
  },
  url: {
    type: String,
    optional: true
  },
  reference: {
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

this.ContextBlocks.attachSchema(Schema.ContextBlocks);

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String,
    regEx: /^[a-z0-9A-Z\s]*$/,
    optional: true,
    min: 2,
    max: 127
  },
  bio: {
    type: String,
    optional: true,
    max: 2000,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        "class": "bio"
      }
    }
  },
  favorites: {
    type: [String],
    optional: true,
    defaultValue: []
  },
  displayUsername: { // allows for caps
    type: String,
    optional: true,
    autoValue: function () { // TODO ensure this matches username except for capitalization
      if (this.isSet && typeof this.value === "string") {
        return this.value.trim();
      } else {
        this.unset()
      }
    }
  },
  twitterUser: {
    type: Boolean,
    optional: true
  }
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9_]{3,15}$/,
    optional: true,
    autoValue: function () {
      if (this.isSet && typeof this.value === "string") {
        return this.value.toLowerCase().trim();
      } else {
        this.unset()
      }
    }
  },
  tempUsername: {
    type: String,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email address",
    autoValue: function () {
      if (this.isSet && typeof this.value === "string") {
        return this.value.toLowerCase();
      } else {
        this.unset()
      }
    },
    autoform: {
      afFieldInput: {
        readOnly: true,
        disabled: true
      }
    }
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Schema.UserProfile,
    optional: true,
    defaultValue: {}
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(Schema.User);

SimpleSchema.messages({
  "regEx username": "Username must be at least 3 letters long and may only contain letters, numbers, and underscores"
});
