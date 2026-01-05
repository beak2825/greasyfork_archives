// ==UserScript==
// @name        动漫花园(dmhy.org) - 联盟搜寻
// @namespace   org.jixun
// @description 利用外部脚本, 可以根据输入搜寻而非一个一个找
// @include     http://share.dmhy.org/topics/*
// @include     https://share.dmhy.org/topics/*
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9596/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28dmhyorg%29%20-%20%E8%81%94%E7%9B%9F%E6%90%9C%E5%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/9596/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28dmhyorg%29%20-%20%E8%81%94%E7%9B%9F%E6%90%9C%E5%AF%BB.meta.js
// ==/UserScript==

(function () {
	var cdnRoot = 'https://cdn.jsdelivr.net/npm/';
	var dependency = {
		css: 'select2@4.0.7/dist/css/select2.min.css',
		scripts: [
			'jquery@3.4.1/dist/jquery.min.js',
			'select2@4.0.7/dist/js/select2.min.js',
			'select2@4.0.7/dist/js/i18n/zh-TW.js'
		],
	};

	function h(name, attrs) {
		var block = document.createElement(name);
		for (var attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				block[attr] = attrs[attr];
			}
		}

		document.head.appendChild(block);
		return block;
	}

	function loadCSS(src) {
		return h('link', {
			href: cdnRoot + src,
			rel: 'stylesheet'
		});
	}

	function loadScripts(arrScripts, onloadComplete) {
		var total = arrScripts.length;
		var count = 0;
		var done = false;

		function loadNext() {
			if (done) return;

			if (count >= total) {
				onloadComplete();
				done = true;
			} else {
				h('script', {
					src: cdnRoot + arrScripts[count],
					onload: loadNext
				});
				count++;
			}
		}
		loadNext();
	}

	loadCSS(dependency.css);
	loadScripts(dependency.scripts, function () {
		var $ = jQuery.noConflict();
		window.jQuery = window.$;

		// Trigger search bar loading
		if (!window.AdvSearchLoaded) {
			window.showHideAdvSearch();
		}
		loadSelect2();

		function loadSelect2() {
			const $select = $('#AdvSearch select');

			if ($select.length === 0) {
				return requestAnimationFrame(loadSelect2);
			}

			h('style', {
				textContent: 'select + .select2-container { min-width: 8em }  input.formButton + a { display: none }'
			});

			$select.select2();
		};
	});
})();