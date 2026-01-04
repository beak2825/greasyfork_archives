// ==UserScript==
// @name         Smugglers Cove Visit Counter
// @namespace    https://www.grundos.cafe
// @version      1.1
// @description  Counts how many times you've visited the Smugglers Cove on GC, and displays the count under the banner, informing you about the number of tries you have left.
// @author       Dark_Kyuubi
// @match        https://www.grundos.cafe/pirates/smugglerscove/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548138/Smugglers%20Cove%20Visit%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/548138/Smugglers%20Cove%20Visit%20Counter.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const COVE_VISIT_STORAGE = 'smugglers_cove_visits';
    const COVE_RESET_TIME_STORAGE = 'smugglers_cove_next_reset';
    const { DateTime } = luxon;
    const MAX_VISITS = 6;

    function getNextMidnightNST() {
        const nowLA = DateTime.now().setZone('America/Los_Angeles');
        return nowLA.plus({ days: 1 }).startOf('day').toMillis();
    }

    let nextResetStorage = await GM.getValue(COVE_RESET_TIME_STORAGE);
    if (!nextResetStorage) {
        nextResetStorage = getNextMidnightNST();
        await GM.setValue(COVE_RESET_TIME_STORAGE, nextResetStorage);
    }
    else if (Date.now() > nextResetStorage) {
        await GM.setValue(COVE_VISIT_STORAGE, 0);
        nextResetStorage = getNextMidnightNST();
        await GM.setValue(COVE_RESET_TIME_STORAGE, nextResetStorage);
    }

    let visits = await GM.getValue(COVE_VISIT_STORAGE, 0);
    visits++;
    await GM.setValue(COVE_VISIT_STORAGE, visits);

    const counterDiv = document.createElement('div');
    counterDiv.classList.add('smugglers-cove-visit-counter', 'center', 'red');
    counterDiv.style.fontSize = '18px';
    counterDiv.style.fontWeight = 'bold';
    const displayVisits = visits > MAX_VISITS ? 'too many' : visits;
    counterDiv.textContent = `You have visited the Smugglers Cove ${displayVisits} time${visits === 1 ? '' : 's'} today. ${MAX_VISITS - visits >= 0 ? `You have ${MAX_VISITS - visits} visit${MAX_VISITS - visits === 1 ? '' : 's'} left.` : "You've used all your visits for today!"}`;
    document.getElementById('page_content').prepend(counterDiv);
})();