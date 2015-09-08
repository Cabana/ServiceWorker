var fetchResource = function(request, cache) {
	return fetch(request.clone()).then(function(networkResponse) {
		
		if (cache) {
			cache.put(cleanRequest(request.clone()), networkResponse.clone()).then(function(){
				console.log('%cAdding to cache', 'color:#795548', new URL(request.clone().url).pathname);
			});
		}

		return networkResponse;
	}).catch(function(error) {
		console.warn('Something went wrong fetching', request.url, error);
	});
};