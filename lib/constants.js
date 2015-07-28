PUB_SIZE = 30;
if (Meteor.isClient){
  window.PUB_SIZE = PUB_SIZE;
}


CREATION_STEPS = [
  'find_stream',
  'add_cards',
  'go_on_air',
  'title_description'
];
