var noCacheRequest = function(request) {
	var newRequest = {};
	newRequest.clone = request;
	newRequest.url = new URL(newRequest.clone.url);
	var newDate = new Date().getTime();
	if (!!newRequest.url.search) {
		newRequest.url.search += "&t="+newDate;
	} else {
		newRequest.url.search = "?t="+newDate;
	}
	newRequest.request = new Request(newRequest.url.href);
	return newRequest;
};
