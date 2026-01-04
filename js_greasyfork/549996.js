// ==UserScript==
// @name         NeoDB Non-local Link Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Disable navigator.share on globe icon so it opens non-local link normally 点击地球或锁的图标打开贴文原链接的时候不调用分享API而是直接跳转
// @author       vacuity
// @license      MIT
// @match        https://neodb.social/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549996/NeoDB%20Non-local%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/549996/NeoDB%20Non-local%20Link%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAllOnclick() {
        document.querySelectorAll('[onclick]').forEach(el => {
            el.removeAttribute('onclick');
        });
    }

    removeAllOnclick();

    const observer = new MutationObserver(removeAllOnclick);
    observer.observe(document.body, { childList: true, subtree: true });
})();
