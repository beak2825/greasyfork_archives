// ==UserScript==
// @name         bustimes.org - Remove Calendar Row from timetables
// @namespace    https://example.com/bustimes-remove-calendar
// @version      1.1
// @description  Permanently removes the "Calendar" row from timetables on bustimes.org
// @match        https://bustimes.org/services/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562307/bustimesorg%20-%20Remove%20Calendar%20Row%20from%20timetables.user.js
// @updateURL https://update.greasyfork.org/scripts/562307/bustimesorg%20-%20Remove%20Calendar%20Row%20from%20timetables.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeCalendarRows() {
        document
            .querySelectorAll('table.timetable thead tr')
            .forEach(row => {
                const th = row.querySelector('th');
                if (th && th.textContent.trim() === 'Calendar') {
                    row.remove();
                }
            });
    }

    // Run once initially
    removeCalendarRows();

    // Watch for timetable changes and re-run
    const observer = new MutationObserver(() => {
        removeCalendarRows();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
