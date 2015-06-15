window.readyToMigrate = new ReactiveVar(false);

var RELOAD_DELAY = 0; // 2000; TODO switch back


Reload._onMigrate('deepstream', function (retry) {
  if (readyToMigrate.get()) {
    return [true, {codeReloaded: true}];
  } else {
    if (FlowRouter.getRouteName() === 'edit') {
      notifyDeploy("We've just made an improvement! Click here to sync up the latest code.", true);
      analytics.track('Reload notification happened', {label: 'Reload on click'});
      $('.migration-notification').click(function () {
        saveCallback(null, true);
        setTimeout(function () {
          readyToMigrate.set(true);
          retry();
        }, 300);
      });
      FlowRouter.triggers.enter([function () {
        readyToMigrate.set(true);
        retry();
      }]);
      return [false];
    } else {
      notifyDeploy("We've just made an improvement! Wait just a moment while we sync up the latest code.", false);
      analytics.track('Reload notification happened', {label: 'Immediate reload'});
      setTimeout(function () {
        readyToMigrate.set(true);
        retry();
      }, RELOAD_DELAY);
      return [false]
    }
  }
});

var migrationData = Reload._migrationData('deepstream');

if (migrationData){
  window.codeReloaded = migrationData.codeReloaded;
}
