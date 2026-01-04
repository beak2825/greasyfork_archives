// ==UserScript==
// @name         shows correct answer in chrome console + unblock copy/paste
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Shows correct anwser in chrome console and unblocks paste
// @match        https://login.smasheducation.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552843/shows%20correct%20answer%20in%20chrome%20console%20%2B%20unblock%20copypaste.user.js
// @updateURL https://update.greasyfork.org/scripts/552843/shows%20correct%20answer%20in%20chrome%20console%20%2B%20unblock%20copypaste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*******************************
     *  UNBLOCK COPY & PASTE
     *******************************/
    const allowPaste = function(e) {
        e.stopImmediatePropagation();
        return true;
    };
    document.addEventListener("paste", allowPaste, true);

    const allowCopy = function(e) {
        e.stopImmediatePropagation();
        return true;
    };
    document.addEventListener("copy", allowCopy, true);


    /*******************************
     *  ORIGINAL ANSWER LOGGER
     *******************************/
    function logLastStatus(data) {
        const answers = data?.data?.answers;
        if (answers && answers.length > 0) {
            const last = answers[answers.length - 1];
            console.clear();
            console.log("[Captured Status] Last Answer:", last.status);
        }
    }

    // Patch fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (args[0].includes('/services/api/grades/partial/add')) {
                response.clone().json()
                    .then(logLastStatus)
                    .catch(() => console.log("[Captured Response] Non-JSON"));
            }
            return response;
        });
    };

    // Patch XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    function XHRProxy() {
        const xhr = new originalXHR();

        const open = xhr.open;
        xhr.open = function(method, url, ...rest) {
            this._url = url;
            return open.apply(this, [method, url, ...rest]);
        };

        const send = xhr.send;
        xhr.send = function(body) {
            this.addEventListener('load', () => {
                if (this._url.includes('/services/api/grades/partial/add')) {
                    try {
                        logLastStatus(JSON.parse(this.responseText));
                    } catch { /* ignore non-JSON responses */ }
                }
            });
            return send.apply(this, [body]);
        };
        return xhr;
    }

    window.XMLHttpRequest = XHRProxy;

})();
