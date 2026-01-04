// ==UserScript==
// @name         Kutubee Reading Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercepts the final reading completion request and sets the 'duration' to a high value (312 seconds) to bypass server-side time checks.
// @author       neonmodder123
// @match        https://read.kutubee.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556778/Kutubee%20Reading%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/556778/Kutubee%20Reading%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Kutubee Script Working :)");
    const TARGET_DURATION = 312;
    const TARGET_API_PATH = '/api/user-activity';
    const originalFetch = window.fetch;

    window.fetch = async function(resource, options) {

        const url = resource.toString();
        const method = options?.method;
        const isPostOrPut = options && (method === 'POST' || method === 'PUT');

        const isTargetApi = url.includes(TARGET_API_PATH);

        if (isTargetApi && isPostOrPut && options.body) {

            let originalPayload;

            try {
                originalPayload = JSON.parse(options.body);
                if (originalPayload.tryingToComplete === true && originalPayload.activitySessionInfo) {

                    const sessionInfo = originalPayload.activitySessionInfo;

                    console.log(`[Kutubee Script] INTERCEPTED completion attempt for ${originalPayload.contentId}`);
                    console.log(`[Kutubee Script] Original Duration: ${sessionInfo.duration}s`);

                    sessionInfo.duration = TARGET_DURATION;

                    options.body = JSON.stringify(originalPayload);

                    console.log(`[Kutubee Script] New Duration Injected: ${sessionInfo.duration}s`);
                    console.log("[Kutubee Script] Sending modified request to server...");
                }
            } catch (e) {
                console.error("[Kutubee Script] Error during payload modification, request sent unedited:", e);
            }
        }
        return originalFetch(resource, options);
    };

})();