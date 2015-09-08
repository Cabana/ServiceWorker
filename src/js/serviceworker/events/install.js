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
