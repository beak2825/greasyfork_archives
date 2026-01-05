// ==UserScript==
// @name        zz Reddit - add large break between comment threads
// @namespace   english
// @description Reddit The Button Show Cheaters  - http://pushka.com/coding-donation
// @include     http*://*reddit.com*
// @version     1.15
// @run-at document-end
// @grant       GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/9599/zz%20Reddit%20-%20add%20large%20break%20between%20comment%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/9599/zz%20Reddit%20-%20add%20large%20break%20between%20comment%20threads.meta.js
// ==/UserScript==
// Main - Reddit The Button Show Cheaters

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.commentarea .sitetable.nestedlisting>.comment {  margin-bottom: 25px !important;  border-bottom: 8px solid #d5d5d5 !important;  padding-bottom: 25px !important;}';
document.getElementsByTagName('head')[0].appendChild(style);

