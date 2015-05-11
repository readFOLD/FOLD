// If use ssl, will need to check that too
// TO-DO change this to a 301 redirect once totally sure
WebApp.connectHandlers.use(function(req, res, next) {
  if (req.method === 'GET' && req.headers.host.match(/^www/) !== null ) {
    res.writeHead(307, {Location: 'https://' + req.headers.host.replace(/^www\./, '') + req.url});
    res.end();
  } else {
    next();
  }
});

if (_.contains([true, 'true'], process.env.ALLOW_BOTS)){
  robots.addLine('User-agent: *\nDisallow: /create/');
} else {
  robots.addLine('User-agent: *\nDisallow: /');
}


if (process.env.PRERENDER_TOKEN) {
  prerenderio.set('prerenderToken', process.env.PRERENDER_TOKEN);
}
