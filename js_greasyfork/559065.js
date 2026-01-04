// ==UserScript==
// @name         Block WebAuthn API (page context)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  禁止网页调用 navigator.credentials.create/get
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559065/Block%20WebAuthn%20API%20%28page%20context%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559065/Block%20WebAuthn%20API%20%28page%20context%29.meta.js
// ==/UserScript==


(function() {
    'use strict';


    const script = document.createElement('script');
    script.textContent = `
        if (navigator.credentials) {
            Object.defineProperty(navigator.credentials, "create", {
                value: function() {
                    console.warn("navigator.credentials.create 被阻止");
                    return Promise.reject(new Error("Blocked by script"));
                },
                configurable: false
            });


            Object.defineProperty(navigator.credentials, "get", {
                value: function() {
                    console.warn("navigator.credentials.get 被阻止");
                    return Promise.reject(new Error("Blocked by script"));
                },
                configurable: false
            });
        }
    `;
    document.documentElement.appendChild(script);
})();
