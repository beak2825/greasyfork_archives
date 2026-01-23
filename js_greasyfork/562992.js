// ==UserScript==
// @name         AO3 No Mid-Tag Splits on New Line
// @namespace    https://aglioeollieo.neocities.org/misc#script
// @version      1.1
// @description  Prevent AO3 tags from splitting mid-word when wrapped
// @author       aglioeollieo
// @icon         https://www.google.com/s2/favicons?domain=archiveofourown.org
// @match        https://archiveofourown.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562992/AO3%20No%20Mid-Tag%20Splits%20on%20New%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/562992/AO3%20No%20Mid-Tag%20Splits%20on%20New%20Line.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS to prevent tags from breaking mid-word
    const style = document.createElement('style');
    style.textContent = `
        .tag {
            white-space: nowrap !important;
        }
    `;
    document.head.appendChild(style);
})();
