Template.unsubscribe.onCreated(function(){
  this.unsubscribed = new ReactiveVar(false);
  this.resubscribed = new ReactiveVar(false);

  this.autorun(() => {
    if(Meteor.userId()){
      Meteor.call('unsubscribe', Router.current().params.query.email_type, (err, success) => {
        if(err || !success){
          notifyError('Unsubscribe failed. Please email us at info@fold.cm')
        } else {
          this.unsubscribed.set(true);
        }
      })
    } else {
      openSignInOverlay('Please sign in to unsubscribe from emails');
    }
  })

});

Template.unsubscribe.events({
  'click .resubscribe'  (e, t){
    Meteor.call('resubscribe', Router.current().params.query.email_type, (err, success) => {
      if (err) {
        notifyError('Resubscribe failed. Please email us at info@fold.cm')
      } else {
        t.resubscribed.set(true);
      }
    })
  }
});

Template.unsubscribe.helpers({
  'unsubscribed'  (){
    return Template.instance().unsubscribed.get();
  },
  'resubscribed'  (){
    return Template.instance().resubscribed.get();
  },
  'humanReadableEmailType' (){

    switch (Router.current().params.query.email_type){
      case 'followed-you':
        return 'Follower Notifications';
        break;
      case 'following-published':
        return 'Notifications When Someone You Follow Publishes a Story';
        break;
      default:
        return Router.current().params.query.email_type;
    }
  }
});
