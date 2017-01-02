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



export default VizBlock = (function (_super) {
  __extends(VizBlock, _super);

  function VizBlock(doc) {
    VizBlock.__super__.constructor.call(this, doc);
    this.type = 'viz';
  }

  VizBlock.prototype.url = function () {
    switch (this.source) {
      case 'oec':
        return '//atlas.media.mit.edu/en/explore/embed/tree_map/hs/' + this.reference.oecDirection + '/' + this.reference.oecCountry + '/all/show/' + this.reference.oecYear + '/?controls=false&lang=en'
    }
  };

  VizBlock.prototype.linkUrl = function () {
    switch (this.source) {
      case 'oec':
        return '//atlas.media.mit.edu/en/visualize/tree_map/hs/' + this.reference.oecDirection + '/' + this.reference.oecCountry + '/all/show/' + this.reference.oecYear
    }
  };

  VizBlock.countries = [{"id": "ago", "name": "Angola"}, {"id": "bdi", "name": "Burundi"}, {
    "id": "ben",
    "name": "Benin"
  }, {"id": "bfa", "name": "Burkina Faso"}, {"id": "bwa", "name": "Botswana"}, {
    "id": "caf",
    "name": "Central African Republic"
  }, {"id": "civ", "name": "Cote d'Ivoire"}, {"id": "cmr", "name": "Cameroon"}, {
    "id": "cod",
    "name": "Democratic Republic of the Congo"
  }, {"id": "cog", "name": "Republic of the Congo"}, {"id": "com", "name": "Comoros"}, {
    "id": "cpv",
    "name": "Cape Verde"
  }, {"id": "dji", "name": "Djibouti"}, {"id": "dza", "name": "Algeria"}, {"id": "egy", "name": "Egypt"}, {
    "id": "eri",
    "name": "Eritrea"
  }, {"id": "esh", "name": "Western Sahara"}, {"id": "eth", "name": "Ethiopia"}, {
    "id": "gab",
    "name": "Gabon"
  }, {"id": "gha", "name": "Ghana"}, {"id": "gin", "name": "Guinea"}, {"id": "gmb", "name": "Gambia"}, {
    "id": "gnb",
    "name": "Guinea-Bissau"
  }, {"id": "gnq", "name": "Equatorial Guinea"}, {"id": "ken", "name": "Kenya"}, {
    "id": "lbr",
    "name": "Liberia"
  }, {"id": "lby", "name": "Libya"}, {"id": "lso", "name": "Lesotho"}, {"id": "mar", "name": "Morocco"}, {
    "id": "mdg",
    "name": "Madagascar"
  }, {"id": "mli", "name": "Mali"}, {"id": "moz", "name": "Mozambique"}, {
    "id": "mrt",
    "name": "Mauritania"
  }, {"id": "mus", "name": "Mauritius"}, {"id": "mwi", "name": "Malawi"}, {
    "id": "myt",
    "name": "Mayotte"
  }, {"id": "nam", "name": "Namibia"}, {"id": "ner", "name": "Niger"}, {"id": "nga", "name": "Nigeria"}, {
    "id": "reu",
    "name": "Reunion"
  }, {"id": "rwa", "name": "Rwanda"}, {"id": "sdn", "name": "Sudan"}, {"id": "sen", "name": "Senegal"}, {
    "id": "shn",
    "name": "Saint Helena"
  }, {"id": "sle", "name": "Sierra Leone"}, {"id": "som", "name": "Somalia"}, {
    "id": "ssd",
    "name": "South Sudan"
  }, {"id": "stp", "name": "Sao Tome and Principe"}, {"id": "swz", "name": "Swaziland"}, {
    "id": "syc",
    "name": "Seychelles"
  }, {"id": "tcd", "name": "Chad"}, {"id": "tgo", "name": "Togo"}, {"id": "tun", "name": "Tunisia"}, {
    "id": "tza",
    "name": "Tanzania"
  }, {"id": "uga", "name": "Uganda"}, {"id": "zaf", "name": "South Africa"}, {
    "id": "zmb",
    "name": "Zambia"
  }, {"id": "zwe", "name": "Zimbabwe"}, {"id": "ata", "name": "Antarctica"}, {
    "id": "atf",
    "name": "French South Antarctic Territory"
  }, {"id": "bvt", "name": "Bouvet Island"}, {"id": "hmd", "name": "Heard Island and McDonald Islands"}, {
    "id": "sgs",
    "name": "South Georgia South Sandwich Islands"
  }, {"id": "afg", "name": "Afghanistan"}, {"id": "are", "name": "United Arab Emirates"}, {
    "id": "arm",
    "name": "Armenia"
  }, {"id": "aze", "name": "Azerbaijan"}, {"id": "bgd", "name": "Bangladesh"}, {
    "id": "bhr",
    "name": "Bahrain"
  }, {"id": "brn", "name": "Brunei"}, {"id": "btn", "name": "Bhutan"}, {
    "id": "cck",
    "name": "Cocos (Keeling) Islands"
  }, {"id": "chn", "name": "China"}, {"id": "cxr", "name": "Christmas Island"}, {
    "id": "cyp",
    "name": "Cyprus"
  }, {"id": "geo", "name": "Georgia"}, {"id": "hkg", "name": "Hong Kong"}, {
    "id": "idn",
    "name": "Indonesia"
  }, {"id": "ind", "name": "India"}, {"id": "iot", "name": "British Indian Ocean Territory"}, {
    "id": "irn",
    "name": "Iran"
  }, {"id": "irq", "name": "Iraq"}, {"id": "isr", "name": "Israel"}, {"id": "jor", "name": "Jordan"}, {
    "id": "jpn",
    "name": "Japan"
  }, {"id": "kaz", "name": "Kazakhstan"}, {"id": "kgz", "name": "Kyrgyzstan"}, {
    "id": "khm",
    "name": "Cambodia"
  }, {"id": "kor", "name": "South Korea"}, {"id": "kwt", "name": "Kuwait"}, {"id": "lao", "name": "Laos"}, {
    "id": "lbn",
    "name": "Lebanon"
  }, {"id": "lka", "name": "Sri Lanka"}, {"id": "mac", "name": "Macau"}, {
    "id": "mdv",
    "name": "Maldives"
  }, {"id": "mid", "name": "Midway"}, {"id": "mmr", "name": "Burma"}, {"id": "mng", "name": "Mongolia"}, {
    "id": "mys",
    "name": "Malaysia"
  }, {"id": "npl", "name": "Nepal"}, {"id": "omn", "name": "Oman"}, {"id": "pak", "name": "Pakistan"}, {
    "id": "phl",
    "name": "Philippines"
  }, {"id": "prk", "name": "North Korea"}, {"id": "pse", "name": "Palestine"}, {
    "id": "qat",
    "name": "Qatar"
  }, {"id": "sau", "name": "Saudi Arabia"}, {"id": "sgp", "name": "Singapore"}, {
    "id": "syr",
    "name": "Syria"
  }, {"id": "tha", "name": "Thailand"}, {"id": "tjk", "name": "Tajikistan"}, {
    "id": "tkm",
    "name": "Turkmenistan"
  }, {"id": "tls", "name": "Timor-Leste"}, {"id": "tur", "name": "Turkey"}, {
    "id": "twn",
    "name": "Taiwan"
  }, {"id": "uzb", "name": "Uzbekistan"}, {"id": "vnm", "name": "Vietnam"}, {
    "id": "yar",
    "name": "Yemen Arab Republic"
  }, {"id": "yem", "name": "Yemen"}, {"id": "ymd", "name": "Democratic Yemen"}, {
    "id": "alb",
    "name": "Albania"
  }, {"id": "and", "name": "Andorra"}, {"id": "aut", "name": "Austria"}, {"id": "bel", "name": "Belgium"}, {
    "id": "bgr",
    "name": "Bulgaria"
  }, {"id": "bih", "name": "Bosnia and Herzegovina"}, {"id": "blr", "name": "Belarus"}, {
    "id": "blx",
    "name": "Belgium-Luxembourg"
  }, {"id": "che", "name": "Switzerland"}, {"id": "chi", "name": "Channel Islands"}, {
    "id": "csk",
    "name": "Czechoslovakia"
  }, {"id": "cze", "name": "Czech Republic"}, {"id": "ddr", "name": "Democratic Republic of Germany"}, {
    "id": "deu",
    "name": "Germany"
  }, {"id": "dnk", "name": "Denmark"}, {"id": "esp", "name": "Spain"}, {"id": "est", "name": "Estonia"}, {
    "id": "fdr",
    "name": "Federal Republic of Germany"
  }, {"id": "fin", "name": "Finland"}, {"id": "fra", "name": "France"}, {
    "id": "fro",
    "name": "Faroe Islands"
  }, {"id": "gbr", "name": "United Kingdom"}, {"id": "gib", "name": "Gibraltar"}, {
    "id": "grc",
    "name": "Greece"
  }, {"id": "hrv", "name": "Croatia"}, {"id": "hun", "name": "Hungary"}, {
    "id": "imn",
    "name": "Isle of Man"
  }, {"id": "irl", "name": "Ireland"}, {"id": "isl", "name": "Iceland"}, {"id": "ita", "name": "Italy"}, {
    "id": "ksv",
    "name": "Kosovo"
  }, {"id": "lie", "name": "Liechtenstein"}, {"id": "ltu", "name": "Lithuania"}, {
    "id": "lux",
    "name": "Luxembourg"
  }, {"id": "lva", "name": "Latvia"}, {"id": "mco", "name": "Monaco"}, {"id": "mda", "name": "Moldova"}, {
    "id": "mkd",
    "name": "Macedonia"
  }, {"id": "mlt", "name": "Malta"}, {"id": "mne", "name": "Montenegro"}, {
    "id": "nld",
    "name": "Netherlands"
  }, {"id": "nor", "name": "Norway"}, {"id": "pol", "name": "Poland"}, {"id": "prt", "name": "Portugal"}, {
    "id": "rou",
    "name": "Romania"
  }, {"id": "rus", "name": "Russia"}, {"id": "scg", "name": "Serbia and Montenegro"}, {
    "id": "sjm",
    "name": "Svalbard"
  }, {"id": "smr", "name": "San Marino"}, {"id": "srb", "name": "Serbia"}, {"id": "sun", "name": "USSR"}, {
    "id": "svk",
    "name": "Slovakia"
  }, {"id": "svn", "name": "Slovenia"}, {"id": "swe", "name": "Sweden"}, {"id": "ukr", "name": "Ukraine"}, {
    "id": "vat",
    "name": "Holy See (Vatican City)"
  }, {"id": "yug", "name": "Yugoslavia"}, {"id": "abw", "name": "Aruba"}, {
    "id": "aia",
    "name": "Anguilla"
  }, {"id": "ant", "name": "Netherlands Antilles"}, {"id": "atg", "name": "Antigua and Barbuda"}, {
    "id": "bes",
    "name": "Bonaire"
  }, {"id": "bhs", "name": "Bahamas"}, {"id": "blz", "name": "Belize"}, {"id": "bmu", "name": "Bermuda"}, {
    "id": "brb",
    "name": "Barbados"
  }, {"id": "can", "name": "Canada"}, {"id": "cri", "name": "Costa Rica"}, {"id": "cub", "name": "Cuba"}, {
    "id": "cuw",
    "name": "Cura\u00e7ao"
  }, {"id": "cym", "name": "Cayman Islands"}, {"id": "dma", "name": "Dominica"}, {
    "id": "dom",
    "name": "Dominican Republic"
  }, {"id": "grd", "name": "Grenada"}, {"id": "grl", "name": "Greenland"}, {
    "id": "gtm",
    "name": "Guatemala"
  }, {"id": "hnd", "name": "Honduras"}, {"id": "hti", "name": "Haiti"}, {"id": "jam", "name": "Jamaica"}, {
    "id": "kna",
    "name": "Saint Kitts and Nevis"
  }, {"id": "lca", "name": "Saint Lucia"}, {"id": "maf", "name": "Saint Maarten"}, {
    "id": "mex",
    "name": "Mexico"
  }, {"id": "msr", "name": "Montserrat"}, {"id": "mtq", "name": "Martinique"}, {
    "id": "naa",
    "name": "Netherland Antilles and Aruba"
  }, {"id": "nic", "name": "Nicaragua"}, {"id": "pan", "name": "Panama"}, {
    "id": "pci",
    "name": "Pacific Island (US)"
  }, {"id": "pcz", "name": "Panama Canal Zone"}, {"id": "pri", "name": "Puerto Rico"}, {
    "id": "slv",
    "name": "El Salvador"
  }, {"id": "spm", "name": "Saint Pierre and Miquelon"}, {
    "id": "tca",
    "name": "Turks and Caicos Islands"
  }, {"id": "tto", "name": "Trinidad and Tobago"}, {
    "id": "umi",
    "name": "United States Minor Outlying Islands"
  }, {"id": "usa", "name": "United States"}, {"id": "vct", "name": "Saint Vincent and the Grenadines"}, {
    "id": "vgb",
    "name": "British Virgin Islands"
  }, {"id": "vir", "name": "Virgin Islands"}, {"id": "asm", "name": "American Samoa"}, {
    "id": "aus",
    "name": "Australia"
  }, {"id": "cok", "name": "Cook Islands"}, {"id": "fji", "name": "Fiji"}, {
    "id": "fsm",
    "name": "Micronesia"
  }, {"id": "glp", "name": "Guadeloupe"}, {"id": "gum", "name": "Guam"}, {
    "id": "kir",
    "name": "Kiribati"
  }, {"id": "mhl", "name": "Marshall Islands"}, {"id": "mnp", "name": "Northern Mariana Islands"}, {
    "id": "ncl",
    "name": "New Caledonia"
  }, {"id": "nfk", "name": "Norfolk Island"}, {"id": "niu", "name": "Niue"}, {
    "id": "nru",
    "name": "Nauru"
  }, {"id": "nzl", "name": "New Zealand"}, {"id": "pcn", "name": "Pitcairn Islands"}, {
    "id": "plw",
    "name": "Palau"
  }, {"id": "png", "name": "Papua New Guinea"}, {"id": "pyf", "name": "French Polynesia"}, {
    "id": "slb",
    "name": "Solomon Islands"
  }, {"id": "tkl", "name": "Tokelau"}, {"id": "ton", "name": "Tonga"}, {"id": "tuv", "name": "Tuvalu"}, {
    "id": "vut",
    "name": "Vanuatu"
  }, {"id": "wlf", "name": "Wallis and Futuna"}, {"id": "wsm", "name": "Samoa"}, {
    "id": "arg",
    "name": "Argentina"
  }, {"id": "bol", "name": "Bolivia"}, {"id": "bra", "name": "Brazil"}, {"id": "chl", "name": "Chile"}, {
    "id": "col",
    "name": "Colombia"
  }, {"id": "ecu", "name": "Ecuador"}, {"id": "flk", "name": "Falkland Islands"}, {
    "id": "guf",
    "name": "French Guiana"
  }, {"id": "guy", "name": "Guyana"}, {"id": "per", "name": "Peru"}, {"id": "pry", "name": "Paraguay"}, {
    "id": "sur",
    "name": "Suriname"
  }, {"id": "ury", "name": "Uruguay"}, {"id": "ven", "name": "Venezuela"}, {"id": "wld", "name": "World"}, {
    "id": "xxa",
    "name": "Areas"
  }];

  VizBlock.prototype.oecCountryName = function () {
    switch (this.source) {
      case 'oec':
        if (this.reference.oecCountry) {
          return _.findWhere(VizBlock.countries, {id: this.reference.oecCountry})['name'];
        }
    }
  };


  VizBlock.prototype.longSnippet = function () {
    switch (this.source) {
      case 'oec':
        return this.oecCountryName() + " " + this.reference.oecDirection + "s in " + this.reference.oecYear;
    }
  };

  VizBlock.prototype.anchorMenuSnippet = function () {
    switch (this.source) {
      case 'oec':
        return this.oecCountryName() + " (" + this.reference.oecYear + ")";
    }
  };

  return VizBlock;

})(ContextBlock);
