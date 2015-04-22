var intval= function (mixed_var, base) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: stensi
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   input by: Matteo
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: intval('Kevin van Zonneveld');
    // *     returns 1: 0
    // *     example 2: intval(4.2);
    // *     returns 2: 4
    // *     example 3: intval(42, 8);
    // *     returns 3: 42
    // *     example 4: intval('09');
    // *     returns 4: 9
    // *     example 5: intval('1e', 16);
    // *     returns 5: 30

    var tmp;

    var type = typeof( mixed_var );

    if (type === 'boolean') {
        return (mixed_var) ? 1 : 0;
    } else if (type === 'string') {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    } else if (type === 'number' && isFinite(mixed_var) ) {
        return Math.floor(mixed_var);
    } else {
        return 0;
    }
}

var base_encode= function(num, alphabet) {
	// http://tylersticka.com/
	// Based on the Flickr PHP snippet:
	// http://www.flickr.com/groups/api/discuss/72157616713786392/
	alphabet = alphabet || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	var base_count = alphabet.length;
	var encoded = '';
	while (num >= base_count) {
		var div = num/base_count;
		var mod = (num-(base_count*intval(div)));
		encoded = alphabet.charAt(mod) + encoded;
		num = intval(div);
	}
	if (num) encoded = alphabet.charAt(num) + encoded;
	return encoded;
}

var base_decode= function(num, alphabet) {
	// http://www.flickr.com/groups/api/discuss/72157616713786392/72157620931323757/
	// Original by Taiyo Fujii
    alphabet = alphabet || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var len = num.length ;
    var decoded = 0 ;
    var multi = 1 ;
    for (var i = (len-1) ; i >= 0 ; i--) {
        decoded = decoded + multi * alphabet.indexOf(num[i]) ;
        multi = multi * alphabet.length ;
    }
    return decoded;
}

var getLastInUrl= function(url) {
	// http://tylersticka.com
	// Fetches the last item in a URL, in this case a Flickr ID
	url.replace(/^\s+|\s+$/g,"");
	if (url.charAt(url.length-1) == '/') {
		url = url.substr(0,url.length-1);
	}
	url = url.split('/');
	return url[url.length-1];
}

window.encodeFlickrUrl = function(url) {
	// Returns a flic.kr URL from a full flickr.com URL
	return 'http://flic.kr/p/' + base_encode(getLastInUrl(url));
}
