window.readyToMigrate = new ReactiveVar(false);

Reload._onMigrate('fold', function (retry) {
  if (readyToMigrate.get()) {
    return [true, {codeReloaded: true}];
  } else {
    if (Router.current().route.getName() === 'edit') {
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
      analytics.track('Reload notification happened', {label: 'Immediate reload'});
      setTimeout(function () {
        readyToMigrate.set(true);
        retry();
      }, 2000);
      return [false]
    }
  }
});

var migrationData = Reload._migrationData('fold');

if (migrationData){
  window.codeReloaded = migrationData.codeReloaded;
}
