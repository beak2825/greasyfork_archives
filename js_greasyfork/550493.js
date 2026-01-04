// ==UserScript==
// @name         Netflix household bypass
// @namespace    https://greasyfork.org/users/821661
// @version      1.0.1a
// @description  Bypass residency block — last checked workings on 23-09-2025
// @author       hdyzen
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.netflix.com&sz=64
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/550493/Netflix%20household%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/550493/Netflix%20household%20bypass.meta.js
// ==/UserScript==

const originalFetch = window.fetch;

window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    const cloned = response.clone();
    const text = await cloned.text();

    if (text.includes("EBI_MOBILE_WATCH_TEMPORARILY")) {
        return new Response("", {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    }

    return response;
};
