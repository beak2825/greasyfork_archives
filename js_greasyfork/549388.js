// ==UserScript==
// @name         Auto Click NexusMods Download Btn
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  自动点击NexusMods弹窗里的下载按钮
// @match        https://www.nexusmods.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549388/Auto%20Click%20NexusMods%20Download%20Btn.user.js
// @updateURL https://update.greasyfork.org/scripts/549388/Auto%20Click%20NexusMods%20Download%20Btn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            requestAnimationFrame(() => waitForElement(selector, callback));
        }
    }

    // 先检测下载按钮
    waitForElement('.widget-mod-requirements a.btn', (btn) => {
        console.log("✅ 检测到下载按钮，自动点击！");
        btn.click();

        // 再检测关闭按钮
        waitForElement('.widget-mod-requirements button.mfp-close', (closeBtn) => {
            console.log("✅ 检测到关闭按钮，自动点击！");
            closeBtn.click();
        });
    });
})();