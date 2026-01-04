// ==UserScript==
// @name         login auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  woah
// @author       YO
// @license MIT
// @match        https://myap.collegeboard.org/login
// @match        https://prod.idp.collegeboard.org/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_log
// @grant        GM_info
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559067/login%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/559067/login%20auto.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const wai = 100;

    async function mai() {

        const email = ""
        const password = ""

        if(window.location.href == "https://myap.collegeboard.org/login") {window.location.href = document.getElementsByClassName("btn btn-sm btn-primary node_modules-@myap-ui-library-sass-___heroidentity-module__cb-wg-margin-top-16___HClvg")[0].href; await delay(2000)}
        if(window.location.href.startsWith("https://prod.idp.collegeboard.org/oauth2/")) {
            if(document.getElementById("input28")) {
                document.getElementById("input28").value = email;
                document.getElementById("input28").dispatchEvent(new Event('input', { bubbles: true }));
                document.getElementById("input28").dispatchEvent(new Event('change', { bubbles: true }));
            }
            else {
                let element = document.getElementById("input56")
                document.getElementById("input56").value = password;
                document.getElementById("input56").dispatchEvent(new Event('input', { bubbles: true }));
                document.getElementById("input56").dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        await delay(100)
        document.getElementsByClassName("button button-primary")[0].click();
    }

    (async function loop() {
        while (true) {
            try {
                await mai();
            } catch (e) {
                "hi chat"
            }
            await delay(wai);
        }
    })();
})();
