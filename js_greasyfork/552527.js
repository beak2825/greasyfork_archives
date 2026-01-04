// ==UserScript==
// @name         Google UDM Injector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Inject udm=14 into Google search URLs only when safe
// @match        https://www.google.com/search*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552527/Google%20UDM%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/552527/Google%20UDM%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const hasUdm = params.has('udm');
    const hasTbm = params.has('tbm');

    // Only inject udm=14 if udm is missing AND tbm is missing
    if (!hasUdm && !hasTbm) {
        const q = params.get('q');
        if (q) {
            params.delete('q'); // Temporarily remove q
            params.set('udm', '14'); // Add udm=14
            params.set('q', q); // Re-add q

            // Redirect to updated URL
            window.location.replace(`${url.origin}${url.pathname}?${params.toString()}`);
        }
    }
})();