// ==UserScript==
// @name         ChatGPT Translate自動切換目標語言至繁體中文 (臺灣)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動將第二個語言下拉選單切換至 zh-TW，第一個不動
// @author       shanlan(grok-4-1-fast-reasoning)
// @match        https://chatgpt.com/zh-Hant/translate/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563187/ChatGPT%20Translate%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E7%9B%AE%E6%A8%99%E8%AA%9E%E8%A8%80%E8%87%B3%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%20%28%E8%87%BA%E7%81%A3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563187/ChatGPT%20Translate%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E7%9B%AE%E6%A8%99%E8%AA%9E%E8%A8%80%E8%87%B3%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%20%28%E8%87%BA%E7%81%A3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setTW() {
        const sels = document.querySelectorAll('select.text-mkt-p2');
        if (sels[1] && sels[1].value !== 'zh-TW') {
            sels[1].value = 'zh-TW';
            sels[1].dispatchEvent(new Event('change', {bubbles: true}));
        }
    }
    setTW();
    new MutationObserver(setTW).observe(document.body, {childList: true, subtree: true});
})();