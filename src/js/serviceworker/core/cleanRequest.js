/*
Request.url = http://example.com/?query=string
to
Request.url = http://example.com/
*/
var cleanRequest = function(request) {
	var url = null;
	try {
		url = new URL(request.url);
	} catch(e) {
		url = false;
	}
	if (url != false) {
		url.search = '';
	}
	return new Request(url);
};


