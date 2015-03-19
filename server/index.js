// If use ssl, will need to check that too
// TO-DO change this to a 301 redirect once totally sure
WebApp.connectHandlers.use(function(req, res, next) {
  if (req.method === 'GET' && req.headers.host.match(/^www/) !== null ) {
    res.writeHead(307, {Location: 'http://' + req.headers.host.replace(/^www\./, '') + req.url});
    res.end();
  } else {
    next();
  }
});

WebApp.connectHandlers.use(function(req, res, next) {
  if (req.method === 'GET' && req.url === '/604659A64AECD32B426D8A9529C0285D.txt'){
    res.statusCode = 200;
    res.write('371D0CA611AAC25C1B32B3FC0E7220D725D61D6B comodoca.com');
    res.end();
  } else {
    next();
  }
});

robots.addLine('User-agent: *\nDisallow: /');
