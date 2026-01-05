// ==UserScript==
// @name           Kasi-time Selectable
// @description    歌詞タイムでテキストを選択可能にします
// @homepageURL    https://greasyfork.org/ja/users/10548-foomin10
// @namespace      https://twitter.com/MizuiroFolder
// @version        2.1
// @date           2015-04-17
// @match          http://www.kasi-time.com/item-*.html
// @run-at         document-start
// @icon           http://www.kasi-time.com/favicon.ico
// @license        CC BY 4.0 http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/9253/Kasi-time%20Selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/9253/Kasi-time%20Selectable.meta.js
// ==/UserScript==

(function(){
'use strict';

var body = document.body;

body.oncontextmenu = 'null';
body.onselectstart = 'null';
body.oncopy = 'null';

body.style.MozUserSelect = 'text';

})();
