window.readyToMigrate = new ReactiveVar(false);

var reloadDelay = Meteor.settings['public'].NODE_ENV === 'development' ? 0 : 2000;

Reload._onMigrate('fold', function (retry) {
  if (readyToMigrate.get()) {
    return [true, {codeReloaded: true}];
  } else {
    //if (Router.current().route.getName() === 'edit') {
    if (!Meteor.settings['public'].NODE_ENV === 'development') { // true
      notifyDeploy("We've just made an improvement! Click here to sync up the latest code.", true);
      analytics.track('Reload notification happened', {label: 'Reload on click'});
      $('.migration-notification').click(function () {
        saveCallback(null, true);
        setTimeout(function () {
          readyToMigrate.set(true);
          retry();
        }, 300);
      });
      Router.onRun(function () {
        readyToMigrate.set(true);
        retry();
      });
      return [false];
    } else {
      notifyDeploy("We've just made an improvement! Wait just a moment while we sync up the latest code.", false);
      analytics.track('Reload notification happened', {label: 'Immediate reload', nonInteraction: 1});
      setTimeout(function () {
        readyToMigrate.set(true);
        retry();
      }, reloadDelay);
      return [false]
    }
  }
});

var migrationData = Reload._migrationData('fold');

if (migrationData){
  window.codeReloaded = migrationData.codeReloaded;
}
