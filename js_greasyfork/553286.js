// ==UserScript==
// @name         Focus on First Task in Vikunja Table view
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Focus on First Task in Vikunja Table view. Focuses on the first <a> element in the first <td> of the specified table when it becomes available. You have to change the match parameter below to your website URL.
// @author       Grok
// @match        https://try.vikunja.io/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553286/Focus%20on%20First%20Task%20in%20Vikunja%20Table%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/553286/Focus%20on%20First%20Task%20in%20Vikunja%20Table%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function focusFirstLink() {
        const table = document.querySelector('table.table.has-actions.is-hoverable.is-fullwidth');

        if (table) {
            const firstRow = table.querySelector('tbody tr');
            if (firstRow) {
                const firstTd = firstRow.querySelector('td');
                if (firstTd) {
                    const firstA = firstTd.querySelector('a');
                    if (firstA) {
                        firstA.focus();
                        console.debug('ViolentMonkey: Focused on the first task link.');
                        return true;
                    } else {
                        console.debug('ViolentMonkey: No <a> found in the first <td>.');
                    }
                } else {
                    console.debug('ViolentMonkey: No <td> found in the first row.');
                }
            } else {
                console.debug('ViolentMonkey: No rows found in the table body.');
            }
        } else {
            console.debug('ViolentMonkey: Table not found yet.');
        }
        return false;
    }

    // Initial check
    if (!focusFirstLink()) {
        // Set up MutationObserver to watch for DOM changes
        const observer = new MutationObserver(() => {
            if (focusFirstLink()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();