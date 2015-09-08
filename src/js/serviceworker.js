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


//= include serviceworker/core/fetchResource.js
//= include serviceworker/core/noCacheRequest.js
//= include serviceworker/core/cleanRequest.js

var isOnline = function() {
	if ('onLine' in navigator) {
		return navigator.onLine;
	} else {
		return true;
	}
};



//= include serviceworker/events/install.js
//= include serviceworker/events/fetch.js
//= include serviceworker/events/activate.js