// ==UserScript==
// @name         移除臉書直播廣告
// @namespace    http://tampermonkey.net/
// @version      2025-09-13
// @description  用來過濾討人厭的直播廣告!
// @author       Mike Lin
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @license      MIT
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/549415/%E7%A7%BB%E9%99%A4%E8%87%89%E6%9B%B8%E7%9B%B4%E6%92%AD%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/549415/%E7%A7%BB%E9%99%A4%E8%87%89%E6%9B%B8%E7%9B%B4%E6%92%AD%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observeDOM = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function(obj, callback) {
            if (!obj || obj.nodeType !== 1) {
                return;
            }

            if (MutationObserver) {
                var mutationObserver = new MutationObserver(callback);

                mutationObserver.observe(obj, {childList: true, subtree: true});
                return mutationObserver;
            } else if (window.addEventListener) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    var listEl = document.querySelector('body');
    observeDOM(listEl, function(m) {
        var findEl = $("div.html-div > div.html-div > div.html-div > div.html-div > div.html-div > div.html-div > div > div > span > div[data-ad-rendering-role='profile_name'] > h4.html-h4 > span:contains('正在直播')");
        if(findEl.length > 0){
            console.log("已刪除" + findEl.length + "個直播廣告");
        findEl.parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().remove();
        }
    });
})();