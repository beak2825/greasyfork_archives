// ==UserScript==
// @name         项目管理脚本
// @namespace    http://tampermonkey.net/
// @version      20250903
// @description  项目管理脚本描述
// @author       You
// @match        http://*/zentao/*.html
// @match        http://*/pages/viewpage.action?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akuvox.local
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/548210/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548210/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.includes('story-view-')){
        // bug分析
        loadScript('http://192.168.10.51:51084/demand-creation.js');
    }
})();

function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
}





