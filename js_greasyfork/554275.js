// ==UserScript==
// @name         Append Username to Playlist Items
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Appends the "Added by" username to each playlist item after the title
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554275/Append%20Username%20to%20Playlist%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/554275/Append%20Username%20to%20Playlist%20Items.meta.js
// ==/UserScript==
// @license MIT

(function () {
    'use strict';

    function appendUsernames() {
        const entries = document.querySelectorAll('li.queue_entry');

        entries.forEach(entry => {
            const titleAttr = entry.getAttribute('title');
            const match = titleAttr && titleAttr.match(/Added by:\s*(.+)/);
            if (match) {
                const username = match[1];
                const titleAnchor = entry.querySelector('.qe_title');
                if (titleAnchor && !titleAnchor.dataset.usernameAppended) {
                    const userSpan = document.createElement('span');
                    userSpan.textContent = ` [${username}]`;
                    userSpan.style.marginLeft = '6px';
                    userSpan.style.fontStyle = 'italic';
                    titleAnchor.parentNode.insertBefore(userSpan, titleAnchor.nextSibling);
                    titleAnchor.dataset.usernameAppended = 'true';
                }
            }
        });
    }

    // Run initially and then observe for dynamic changes
    const observer = new MutationObserver(appendUsernames);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    appendUsernames();
})();