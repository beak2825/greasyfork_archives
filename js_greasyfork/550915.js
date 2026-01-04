// ==UserScript==
// @name         Disable Tooltips on CFA Institute Courses
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable tooltip on hover for CFA Institute Courses pages
// @author       vacuity
// @license      MIT
// @match        https://learn.cfainstitute.org/courses*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550915/Disable%20Tooltips%20on%20CFA%20Institute%20Courses.user.js
// @updateURL https://update.greasyfork.org/scripts/550915/Disable%20Tooltips%20on%20CFA%20Institute%20Courses.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove title attributes initially
    document.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));

    // Observe future DOM changes and strip title attributes too
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.hasAttribute && node.hasAttribute('title')) {
                        node.removeAttribute('title');
                    }
                    node.querySelectorAll?.('[title]').forEach(el => el.removeAttribute('title'));
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
