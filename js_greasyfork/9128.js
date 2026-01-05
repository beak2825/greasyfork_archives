// ==UserScript==
// @name            Feeder 拡張機能
// @name:en         Feeder extensions
// @author          Hash
// @homepage        http://www2.x-feeder.info/Extensions/
// @version         1.6
// @description     Feederチャットに拡張機能を追加します
// @description:en  Add external features to Feeder Chat.
// @namespace       http://www.x-feeder.info/
// @grant           none
// @match           http://*.x-feeder.info/*/
// @run-at          document-end
// @copyright       2015+, Hash
// @downloadURL https://update.greasyfork.org/scripts/9128/Feeder%20%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/9128/Feeder%20%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

if (profileId) {
	(function(func, uwExists) {
		$.get('//vuf.github.io/feeder-extensions/files/@loader.js?_=' + +new Date(), function(data) {
			if (data) {
				func(data);
				if (uwExists) {
					unsafeWindow.extensions = extensions;
				}
				extensions.loadScript('@main.js', func);
			} else {
				var jpn;
				try {
					var lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2).toLowerCase();
					if (lang != 'ja' && lang != 'jp') {
						throw('The browser language is not Japanese.');
					}
					jpn = true;
				} catch(e) {
					jpn = false;
				}
				if (jpn) {
					alert('拡張機能が読み込めませんでした');
				} else {
					alert('Failed to load extensions.');
				}
			}
		});
	})(((typeof(unsafeWindow) != 'undefined') ? unsafeWindow.eval : eval), (typeof(unsafeWindow) != 'undefined'));
}
