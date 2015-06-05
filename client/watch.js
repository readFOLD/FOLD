Template.watch.helpers({
  streamUrl: function(){
    if (FlowRouter.subsReady()){
      return Deepstreams.findOne().activeStream().url()
    }
  }
})
