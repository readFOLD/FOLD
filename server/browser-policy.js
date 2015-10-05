BrowserPolicy.framing.disallow(); // disallow iframe, for now
BrowserPolicy.content.disallowInlineScripts(); // this provides a backstop against XSS
BrowserPolicy.content.allowEval(); // need to allow eval for YouTube iFrame API
BrowserPolicy.content.allowInlineStyles(); // we use inline styles a fair bit
BrowserPolicy.content.allowImageOrigin('*'); // allowing all images is easiest and seems safe

// allow videos from specific sources only
BrowserPolicy.content.allowMediaOrigin('res.cloudinary.com');
BrowserPolicy.content.allowMediaOrigin('*.imgur.com');
BrowserPolicy.content.allowMediaOrigin('*.giphy.com');

// allow iframes from everywhere (needed for various browser bookmarklets)
BrowserPolicy.content.allowFrameOrigin('*');

// allow iframes from specific sources only (why not)
BrowserPolicy.content.allowFontOrigin('*.gstatic.com');
BrowserPolicy.content.allowFontOrigin('*.bootstrapcdn.com');
BrowserPolicy.content.allowFontOrigin('*.googleapis.com');
BrowserPolicy.content.allowFontOrigin('*.bambuser.com');

// allow scripts from everywhere (we already don't allow inline above)
BrowserPolicy.content.allowScriptOrigin('*');

// allow styles from specific sources only
BrowserPolicy.content.allowStyleOrigin('*.bootstrapcdn.com');
BrowserPolicy.content.allowStyleOrigin('*.googleapis.com');

// allow objects from specific sources only
BrowserPolicy.content.allowObjectOrigin('*.bambuser.com');
BrowserPolicy.content.allowObjectOrigin('www-cdn.jtvnw.net');

// allow connect everywhere
BrowserPolicy.content.allowConnectOrigin('*');
