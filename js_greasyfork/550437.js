// ==UserScript==
// @name         家居云脚本
// @namespace    http://tampermonkey.net/
// @version      20250916
// @description  script
// @author       You
// @match        http://*/zentao/bug-view-*.html
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akuvox.local
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/550437/%E5%AE%B6%E5%B1%85%E4%BA%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550437/%E5%AE%B6%E5%B1%85%E4%BA%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    loadScript('http://192.168.10.51:51084/word-export.js');
})();

function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
}







