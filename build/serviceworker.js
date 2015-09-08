var cacheName = "v1.0.0";

var cacheList = [
	'/resources/css/app.css',
	'/resources/js/app.js',
	'/resources/js/3f.js',
	'/resources/images/3f.gif',
	'/resources/fonts/icomoon.ttf',
	'/resources/fonts/icomoon.woff',
	'/resources/fonts/3fmax-bold.woff',
	'/resources/fonts/3fmax-bold.ttf',
	'/resources/fonts/3fmax-regular.woff',
	'/resources/fonts/3fmax-regular.ttf'
];

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






self.addEventListener('install', function(event) {


  if (self.skipWaiting) {


  	self.skipWaiting();


  }





  console.log('installing');





	event.waitUntil(


		caches.open(cacheName).then(function(cache) {





			return cache.addAll(cacheList);


		})


	);


});





self.addEventListener('fetch', function(event) {

	var isOnline = function() {
		if ('onLine' in navigator) {
			return navigator.onLine;
		} else {

			var connection = navigator.connection || navigator.mozConnection || null;

			if (connection) {
				return connection.type !== "none";
			} else {
				return false;
			}

		}
	};



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


self.addEventListener('activate', function(event) {
	// TODO: Clean up offline cache
});
