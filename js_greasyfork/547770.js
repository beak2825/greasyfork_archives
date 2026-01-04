// ==UserScript==
// @name         GameBanana LinkFilter Bypass
// @match        https://gamebanana.com/linkfilter*
// @run-at       document-start
// @description ChatGPT script to bypasse the Gamebanana link filter when browsing to other sites.
// @version 1.0
// @license MIT

// @namespace https://greasyfork.org/users/1509714
// @downloadURL https://update.greasyfork.org/scripts/547770/GameBanana%20LinkFilter%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/547770/GameBanana%20LinkFilter%20Bypass.meta.js
// ==/UserScript==
(function() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) window.location.replace(decodeURIComponent(url));
})();
