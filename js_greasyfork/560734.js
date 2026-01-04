// ==UserScript==
// @name         new delete jsoneditoronline ads
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description:en  Remove the advertisement section of https://jsoneditoronline.org/. （NEW）
// @description:zh  移除 jsoneditoronline.org 的新脚本。
// @author       lin
// @match        https://jsoneditoronline.org/
// @grant        none
// @license MIT
// @description Remove the advertisement section of https://jsoneditoronline.org/.
// @downloadURL https://update.greasyfork.org/scripts/560734/new%20delete%20jsoneditoronline%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/560734/new%20delete%20jsoneditoronline%20ads.meta.js
// ==/UserScript==

const forbiddenDomains = ['intergient.com', 'doubleclick.net', 'moatads.com'];

const originalAppend = HTMLHeadElement.prototype.appendChild;
HTMLHeadElement.prototype.appendChild = function(element) {
    if (element.tagName === 'SCRIPT' && element.src) {
        if (forbiddenDomains.some(domain => element.src.includes(domain))) {
            console.log(`[Blocked] Ad Script: ${element.src}`);
            return element;
        }
    }
    return originalAppend.apply(this, arguments);
};

(function() {
    'use strict';

    const AD_SELECTORS = ['.ad-panel', '.ad-margin'];

    const removeAds = () => {
        AD_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.remove();
                console.log(`[Cleaner] Removed: ${selector}`);
            });
        });
    };

    removeAds();

    const observer = new MutationObserver((mutations) => {
        removeAds();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();