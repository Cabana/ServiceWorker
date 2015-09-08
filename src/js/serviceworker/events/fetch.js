
self.addEventListener('fetch', function(event) {

	var requestURL = new URL(event.request.clone().url);

	if (requestURL.protocol.indexOf('chrome-extension') > -1) {
		/*
		Don't interfere with chrome extensions
		*/
		return;
	} else if (cacheList.indexOf(requestURL.pathname) > -1) {
		/*
		if requested file is part of predefined cache
		*/

		event.respondWith(
			caches.open(cacheName).then(function(cache) {


				return cache.match(cleanRequest(event.request.clone())).then(function(cacheResponse) {

					console.log('Returning', requestURL.pathname, cacheResponse);

					/*
					newRequest = http://example.com/?t=gettime
					To skip browser default cache
					*/
					var newRequest = noCacheRequest(event.request.clone());
 
					if (cacheResponse) {
						console.info('%cServing cache', 'color:#9C27B0', cleanRequest(event.request.clone()).url, cacheResponse);
						fetchResource(newRequest.request, cache);
						return cacheResponse;
					} else {
						console.log('%cNo cache! Serving live '+new URL(request.clone().url).pathname, 'color:#f09688');
						return fetchResource(newRequest.request, cache);
					}

				});
			})
		);

	} else {
		/*
		if request is standard request
		*/
		console.log('%cServing live '+requestURL.pathname, 'color:#009688');

		event.respondWith(
			caches.open('offline'+cacheName).then(function(cache) {

				if (!isOnline()) {
					console.warn('You\'re offline!', 'Now looking for', cleanRequest(event.request.clone()));
					return cache.match(cleanRequest(event.request.clone())).then(function(cacheResponse) {

						if (cacheResponse) {
							fetchResource(noCacheRequest(event.request.clone()).request, cache);
							return cacheResponse;
						} else {
							return fetchResource(event.request.clone(), cache);
						}
					});
				} else {
					return fetchResource(event.request.clone(), cache);
				}

			})
		);

	}

});