// ==UserScript==
// @name         Snyk Auto SSO
// @namespace    http://tampermonkey.net/
// @version      2025-05-05
// @description  Automatically trigger SSO login
// @author       You
// @match        https://app.snyk.io/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snyk.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553877/Snyk%20Auto%20SSO.user.js
// @updateURL https://update.greasyfork.org/scripts/553877/Snyk%20Auto%20SSO.meta.js
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
    const now = Date.now();
    const check = () => {
        const rememberLoginDetailsCheckbox = document.getElementById("rememberLoginDetailsCheckbox");
        if (rememberLoginDetailsCheckbox) {
            rememberLoginDetailsCheckbox.checked = true;
        }
        const loginWithSso = [...document.querySelectorAll("a")].filter(a => a.text.includes("Log in with your company SSO"))?.[0];
        if (loginWithSso) {
            loginWithSso.click();
        }
        const ssoEmail = document.getElementById("ssoEmail");
        if (ssoEmail) {
            ssoEmail.value = "sso@nbcuni.com";
            ssoEmail.dispatchEvent(new Event('input', { bubbles: true }));
            [...document.querySelectorAll("button")].filter(e => /Log in/.test(e.innerHTML))[0].click();
            return;
        }
        if (Date.now() - now < 10000) {
            setTimeout(check, 250);
        }
    }
    documentReady().then(check);
})();
