// ==UserScript==
// @name         Block itdog.cn ads (no short ad flash)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Block ads on itdog.cn website
// @license      AGPL-3.0
// @match        https://www.itdog.cn/*
// @match        https://itdog.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560653/Block%20itdogcn%20ads%20%28no%20short%20ad%20flash%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560653/Block%20itdogcn%20ads%20%28no%20short%20ad%20flash%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Kill alerts immediately
    window.alert = () => {};

    // Hide ads before render
    const style = document.createElement('style');
    style.textContent = `
      .gg_link,
      div.col-12.gg_link,
      div.card-header.p-3,
      a[rel="noopener nofollow"],
      img[src="/upload/images/20231023230235_692.gif"],
      div[style="padding: 18px 0 0 18px;"] {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    document.documentElement.appendChild(style);

    // Remove ads dynamically
    const removeAds = () => {
        document.querySelectorAll(
            '.gg_link, div.col-12.gg_link, div.card-header.p-3'
        ).forEach(el => el.remove());
    };

    new MutationObserver(removeAds).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();