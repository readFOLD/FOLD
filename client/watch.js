Template.watch.helpers({
  streamUrl: function(){
    if (FlowRouter.subsReady()){
      return Deepstreams.findOne().activeStream().url()
    }
  }
});

Template.watch.events({
  'click .walrus': function(){
    Deepstreams.update({_id: 'someid'}, {$set: {activeStreamId: 'walrus_stream123'}});
  },
  'click .ant': function(){
    Deepstreams.update({_id: 'someid'}, {$set: {activeStreamId: 'ant_stream654'}});
  }
});
