// If use ssl, will need to check that too
// TO-DO change this to a 301 redirect once totally sure
WebApp.connectHandlers.use(function(req, res, next) {
  console.log(req.method)
  if (req.method === 'GET' && req.headers.host.match(/^www/) !== null ) {
    console.log({Location: 'http://' + req.headers.host.replace(/^www\./, '') + req.url});
    res.writeHead(307, {Location: 'http://' + req.headers.host.replace(/^www\./, '') + req.url});
    res.end();
  } else {
    next();
  }
});
