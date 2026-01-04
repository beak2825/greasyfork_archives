// ==UserScript==
// @license      AGPL-3.0-or-later
// @name         Make your Tilburg University Canvas sessions survive browser restarts.
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  If canvas_session is a session cookie, re‑set it to expire in 72h on tilburguniversity.instructure.com
// @author       You
// @match        https://tilburguniversity.instructure.com/*
// @grant        GM_cookie
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554230/Make%20your%20Tilburg%20University%20Canvas%20sessions%20survive%20browser%20restarts.user.js
// @updateURL https://update.greasyfork.org/scripts/554230/Make%20your%20Tilburg%20University%20Canvas%20sessions%20survive%20browser%20restarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOKIE_NAME = "canvas_session";
    const TARGET_DOMAIN = "tilburguniversity.instructure.com";
    const TARGET_URL = "https://" + TARGET_DOMAIN + "/";  // base URL for cookie operations
    const EXPIRE_SECONDS = 72 * 60 * 60; // 72 hours in seconds

    // Utility to convert Date.now() to seconds since epoch
    function nowInSeconds() {
        return Math.floor(Date.now() / 1000);
    }

    // Step 1: list the cookie
    GM_cookie.list({ url: TARGET_URL, name: COOKIE_NAME }, function(cookies, error) {
        if (error) {
            console.error("Error reading cookie:", error);
            return;
        }
        if (!cookies || cookies.length === 0) {
            console.log(`Cookie ${COOKIE_NAME} not found.`);
            return;
        }

        // Assuming first cookie is the one we care about
        const ck = cookies[0];
        console.log("Found cookie:", ck);

        if (!ck.session) {
            console.log(`Cookie ${COOKIE_NAME} already has expiration / not session-only.`);
            return;
        }

        // Step 2: Re‑set the cookie with same value but with expirationDate
        const newExpiration = nowInSeconds() + EXPIRE_SECONDS;
        const newDetails = {
            url: TARGET_URL,
            name: COOKIE_NAME,
            value: ck.value,
            domain: ck.domain,
            path: ck.path,
            secure: ck.secure,
            httpOnly: ck.httpOnly,
            sameSite: ck.sameSite,
            expirationDate: newExpiration
        };

        console.log(`Promoting cookie ${COOKIE_NAME} to expire at ${new Date(newExpiration*1000).toISOString()}`);

        GM_cookie.set(newDetails, function(setError) {
            if (setError) {
                console.error("Error setting cookie:", setError);
            } else {
                console.log(`Cookie ${COOKIE_NAME} successfully set with expiration.`);
            }
        });
    });

})();
