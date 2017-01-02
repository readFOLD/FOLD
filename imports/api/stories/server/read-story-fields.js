export default readStoryFields = {
  draftStory: 0,
  history: 0,
  narrativeRightsReserved: 0,
  //savedAt: 0, // used in analytics
  //createdAt:0, // used in analytics
  everPublished:0,
  //analyticsBeforeReads:0, // need this to calculate read percentage TODO be more specific & ideally don't send to everyone
  //deleted: 0, // currently always blank so no need to filter
  //deletedAt: 0, // currently always blank so no need to filter
  //'analytics.shares': 0,
  //'contextBlocks.authorId': 0, // used in analytics
  //'contextBlocks.storyShortId': 0, // used in analytics
  'contextBlocks.storyId': 0,
  'contextBlocks.version': 0,
  'contextBlocks.savedAt': 0,
  'contextBlocks.publishedAt': 0,
  'contextBlocks.createdAt': 0,
  'contextBlocks.fullDetails': 0,
  'contextBlocks.published': 0,
  'contextBlocks.everPublished': 0,
  'contextBlocks.searchQuery': 0,
  'contextBlocks.searchOption': 0
};
