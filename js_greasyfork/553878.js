// ==UserScript==
// @name         GitHub Single Sign On
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  Automatically click on SSO button
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553878/GitHub%20Single%20Sign%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/553878/GitHub%20Single%20Sign%20On.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function documentReady() {
        return document.readyState === 'complete' || document.readyState === 'interactive' ? Promise.resolve() :
        new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', () => {
                resolve();
            });
        });
    }

    // Usage:
    documentReady().then(function() {
        const ssoPanel = document.querySelector(".business-sso-panel");
        if (ssoPanel) {
            const ssoText = ssoPanel.textContent.replace(/\s+/g, ' ');
            const isNbcuSso = ssoText.includes("Single sign-on to NBCUniversal");
            if (isNbcuSso) {
                const button = ssoPanel.querySelector("button");
                if (button) {
                    button.click();
                }

            }
        }
    });
})();