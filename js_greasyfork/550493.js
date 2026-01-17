// ==UserScript==
// @name         Netflix household bypass
// @namespace    https://greasyfork.org/users/821661
// @version      1.0.2
// @description  Bypass residency block — Last tested on 16-01-2026.
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

const originalOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, async = true, user, password) {
    if (url.includes("/msl_v1/cadmium/")) {
        this.send = () => {};
    }
    return originalOpen.call(this, method, url, async, user, password);
};
