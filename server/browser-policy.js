BrowserPolicy.framing.disallow(); // disallow iframe, for now
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowImageOrigin('*')
BrowserPolicy.content.allowMediaOrigin('res.cloudinary.com')
BrowserPolicy.content.allowMediaOrigin('*.imgur.com');
BrowserPolicy.content.allowMediaOrigin('*.giphy.com');
BrowserPolicy.content.allowFrameOrigin('*.google.com');
BrowserPolicy.content.allowFrameOrigin('*.youtube.com');
BrowserPolicy.content.allowFrameOrigin('*.vimeo.com');
BrowserPolicy.content.allowFrameOrigin('*.soundcloud.com');
BrowserPolicy.content.allowFrameOrigin('*.atlas.media.mit.edu');
BrowserPolicy.content.allowFontOrigin('*.gstatic.com');
BrowserPolicy.content.allowScriptOrigin('*.segment.com');
BrowserPolicy.content.allowScriptOrigin('*.google-analytics.com');
BrowserPolicy.content.allowStyleOrigin('*.bootstrapcdn.com');
BrowserPolicy.content.allowFontOrigin('*.bootstrapcdn.com');
