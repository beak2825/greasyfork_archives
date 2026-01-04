// ==UserScript==
// @name         Attendance Reports: Fix "Last 6 Months"
// @namespace    https://github.com/nate-kean/
// @version      2025.10.21
// @description  Fix the date range to actually be the last six months when the "Last 6 Months" setting is chosen.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/reports/attendance/individual*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555042/Attendance%20Reports%3A%20Fix%20%22Last%206%20Months%22.user.js
// @updateURL https://update.greasyfork.org/scripts/555042/Attendance%20Reports%3A%20Fix%20%22Last%206%20Months%22.meta.js
// ==/UserScript==

(function() {
    const search = new URLSearchParams(window.location.search);
    if (search.get("dateRangeType") === "last6months") {
        search.set("dateRangeType", "custom");
        search.set("startAmount", "6");
        search.set("startType", "months");
        search.set("endAmount", "0");
        search.set("endType", "days");
        search.delete("startDate");
        search.delete("endDate");
        window.location.search = search.toString();
    }
})();