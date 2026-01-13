// ==UserScript==
// @name         Remove Calendar Row from bustimes.org timetables
// @namespace    https://example.com/bustimes-remove-calendar
// @version      1.0
// @description  Removes the "Calendar" row from timetable tables on bustimes.org
// @match        https://bustimes.org/services/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562307/Remove%20Calendar%20Row%20from%20bustimesorg%20timetables.user.js
// @updateURL https://update.greasyfork.org/scripts/562307/Remove%20Calendar%20Row%20from%20bustimesorg%20timetables.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const rows = document.querySelectorAll('table.timetable thead tr');

    rows.forEach(row => {
        const headerCell = row.querySelector('th');
        if (headerCell && headerCell.textContent.trim() === 'Calendar') {
            row.remove();
        }
    });
})();
