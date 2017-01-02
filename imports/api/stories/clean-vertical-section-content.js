import { _ } from 'meteor/underscore';

// TO-DO consider replacing htmlclean with https://github.com/cristo-rabani/meteor-universe-html-purifier/
var cleanHtmlOptions = {
  allowedTags: ['strong', 'em', 'u', 'b', 'a', 'br'], // only allow tags used in fold-editor and
  format: false,
  removeTags: [], // allow u tag
  removeAttrs: ['class', 'id', 'href'], // strip away hrefs and other undesired attributes that might slip into a paste
  allowedAttributes: [["data-context-id"],["data-context-type"],["data-context-source"], ["data-anchor-id"]] // data-context-id is used to direct links to context cards
};

var matchAnchors =  /<a( data-[a-z-]*?=["|'].*?["|'])?( data-[a-z-]*?=["|'].*?["|'])?( data-[a-z-]*?=["|'].*?["|'])?( data-[a-z-]*?=["|'].*?["|'])?.*?>/gm; // match anchors, capture data-context-id and other attributes so it can be kept in string
var matchBlankAnchors = /<a href="javascript:void\(0\);">(.*?)<\/a>/gm; // match anchors that are left over from above if copied from somewhere else, capture contents so can be kept

export default cleanVerticalSectionContent = function(html) {

  var preClean = html // this fixes issues with line-breaks at the edge of other tags
    .replace(new RegExp('<br />', 'g'), '<br>') // just in case
    .replace(new RegExp('<br></strong>', 'g'), '</strong><br>')
    .replace(new RegExp('<br></em>', 'g'), '</em><br>')
    .replace(new RegExp('<br></u>', 'g'), '</u><br>')
    .replace(new RegExp('<br></b>', 'g'), '</b><br>')
    .replace(new RegExp('<br></i>', 'g'), '</i><br>');

  var initialClean = $.htmlClean(preClean, _.extend({}, _.omit(cleanHtmlOptions, 'allowedTags'), {allowEmpty: ['div']})); // do all cleaning except tag removal. allowEmpty means <div><br></div> turns into <div></div> instead of being deleted entirely

  var linebreakClean = initialClean
    .replace(new RegExp('<br />', 'g'), '<br>')
    .replace(new RegExp('<div><br></div>', 'g'), '<br>')
    .replace(new RegExp('<div>', 'g'), '<br>')
    .replace(new RegExp('</div>', 'g'), '');

  return $.htmlClean(linebreakClean, cleanHtmlOptions)
    .replace(matchAnchors, '<a href="javascript:void(0);"$1$2$3$4>') // add js void to all anchors and keep all data-context-ids and other data attributes
    .replace(matchBlankAnchors, '$1') // remove anchors without data-context-ids
    .replace(new RegExp('<br />', 'g'), '<br>');

};
