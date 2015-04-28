window.readyToMigrate = new ReactiveVar(false);

Reload._onMigrate('fold', function (retry) {
  if (readyToMigrate.get()) {
    return [true, {codeReloaded: true}];
  } else {
    if (Router.current().route.getName() === 'edit') {
      notifyDeploy("We've just made an improvement! Click here to sync up the latest code.", true);
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
      setTimeout(function () {
        readyToMigrate.set(true);
        retry();
      }, 2000);
      return [false]
    }
  }

});

var migrationData = Reload._migrationData('fold');
window.codeReloaded = migrationData.codeReloaded;
