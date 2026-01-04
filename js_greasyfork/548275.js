// ==UserScript==
// @name         Freedium Membership Redirector
// @namespace    https://www.github.com/zzz-creator
// @version      1.2
// @description  Redirect Medium and custom Medium domains to freedium.cfd using membership text heuristic
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548275/Freedium%20Membership%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/548275/Freedium%20Membership%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if page contains Medium membership text
    const bodyText = document.body.innerText || '';
    const membershipPhrase = 'Become a member to read this story, and all of Medium';

    if (bodyText.includes(membershipPhrase)) {
        const newUrl = 'https://freedium.cfd/' + window.location.href;
        window.location.replace(newUrl);
    }

})();
