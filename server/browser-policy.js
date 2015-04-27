BrowserPolicy.framing.disallow(); // disallow iframe, for now
BrowserPolicy.content.disallowInlineScripts(); // this provides a backstop against XSS
BrowserPolicy.content.disallowEval(); // never allow eval
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

// allow scripts from everywhere (we already don't allow inline above)
BrowserPolicy.content.allowScriptOrigin('*');

// allow styles from specific sources only
BrowserPolicy.content.allowStyleOrigin('*.bootstrapcdn.com');

// disallow objects (until we need them)
BrowserPolicy.content.disallowObject();

// allow connect everywhere
BrowserPolicy.content.allowConnectOrigin('*');
