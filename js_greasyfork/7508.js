// ==UserScript==
// @id             to-imgur
// @name           To imgur
// @version        1.0
// @description    Send any image to imgur by holding down alt/option and then clicking on it.
// @namespace      https://github.com/phracker
// @author         phracker / hateradio
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABp0lEQVR42p2Tyy8DURTGxxIbIoSdNJ07c/vwaNogVL07hNTKq0g1YYN41KYsGhYee4lILSzsJBpKRBCChP+I3eeeSmdMZ0RY/HLnnnu+7547OUdiTOYul+uCc/6hqioMFCK/N8UplzSklcTHuaIoYIz9CdKQVhJu74WHskyrSHBzgQom52NmSCuJkizOQa0RsVQnVtIalg81TK6H0NLVYDEgrSQEJvFgvAmpq37svQ0ZvA5hI6Ohd8RP1ZjyqQK97LaBeiSzndh67sbmk5mtl26snXYgEPJSrtWANuMpPzYem5G8t2f9oRnDSz4ww8B4gturIn5Qh8StB6s39iTuPIju1dHbv1eg6gZT+wwL17WYv7KHzkZ3FN2AVjLQ3SJJB+YuKzF7Yc9ctgravBNMzhuohgEFm8IMUydlmDkvRixTYoJi0aMK+IIK/QOLgV5FKFqLieNiTGeKBNIXZ0UYS5eiddhBDSb4ZlDYxopICPQ4EV6pRmS3DJHtcvQt1sDXLpPY2kicqz+2MnfloOfZtjJpxTDxfw8TaQvGWcEvkJBu/hDi3Dh/Aum8rB8qqWINAAAAAElFTkSuQmCC
// @icon64         data:image/png;base64,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
// @grant          GM_openInTab
// @include        *://*
// @downloadURL https://update.greasyfork.org/scripts/7508/To%20imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/7508/To%20imgur.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var imgur = {
		url : 'https://imgur.com/upload?url=',
		init : function () {
			if (document.URL.indexOf(this.url) !== -1) {
				this.send();
			} else {
				var i = document.getElementsByTagName('img'), b = i.length;
				while (b--) {
					i[b].addEventListener('click', imgur.go, false);
				}
			}
		},
		go : function (e) {
			if (e.altKey && !e.shiftKey) {
				e.preventDefault();
				this.removeEventListener('click', imgur.go, false);
				imgur.open(imgur.url + this.src);
			}
		},
		send : function () {
			var i = document.querySelector('.input_field');
			if (i) {
				i.value = document.location.hash.substring(1);
				document.querySelector('form').submit();
			}
		},
		open : (function () {
			try {
				return GM_openInTab;
			} catch (e) {}
			return function (url) { window.open(url); window.focus(); };
		}())
	};
	imgur.init();
}());