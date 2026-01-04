// ==UserScript==
// @name         Google Redirect Notice Bypass
// @namespace    http://tampermonkey.net/
// @version      2025-12-25
// @description  Skips past the Google redirect notice by getting the destination url from the redirect url and navigating to it
// @author       MrAnubis
// @match        https://www.google.com/url?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560230/Google%20Redirect%20Notice%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/560230/Google%20Redirect%20Notice%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const w = unsafeWindow;
    const u = new URL(location.href);
    const extracted = u.searchParams.get("url");
    location.href = extracted;
})();