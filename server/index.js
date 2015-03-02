WebApp.connectHandlers.use(function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect(req.protocol + '://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
});
