// ==UserScript==
// @name         F**king uview-plus
// @namespace    http://tampermonkey.net/
// @version      2025-09-30
// @description  f**king uview-plus
// @author       f**king uview-plus
// @match        https://uview-plus.jiangruyi.com/*
// @icon         https://uview-plus.jiangruyi.com/common/logo.png
// @icon         https://uview-plus.jiangruyi.com/common/logo.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551122/F%2A%2Aking%20uview-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/551122/F%2A%2Aking%20uview-plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.setItem("adExpire2", Date.parse(new Date()) / 1e3 + 43200);
    Object.defineProperty(window, "showAd", {
        get: () => false,
        set: () => {},
        configurable: false
    });
    function removeGoogleAdsScripts() {
        document.querySelectorAll('script[src*="googlesyndication.com"], script[src*="fundingchoicesmessages.google.com"]').forEach(el => el.remove());
    }
    function removeGoogleAdFrames() {
        document.querySelectorAll('iframe[src*="googlesyndication.com"], iframe[src*="doubleclick.net"]').forEach(el => el.remove());
    }
    function removeTipsAd(){
        document.querySelectorAll('.showV2Tips').forEach(el => el.remove());
    }
    let observer = new MutationObserver(() => {
        removeGoogleAdsScripts();
        removeGoogleAdFrames();
        removeTipsAd();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    removeGoogleAdsScripts();
    removeGoogleAdFrames();
    removeTipsAd();
    const el = document.querySelectorAll('.el-dialog');
    el.forEach( e => {
        e.style.display = 'none'
    })
})();
