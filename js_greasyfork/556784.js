// ==UserScript==
// @name          MWI Simplified User Profiles (Steam tags, consolidation of prestiges)
// @namespace     http://tampermonkey.net/
// @version       1.33.7
// @description   Adds a pre or post-Steam tag, consolidates Task, Collection & Bestiary Points with tooltips on hover
// @author        GOSU/Flash
// @license       MIT
// @match         https://www.milkywayidle.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/558162/MWI%20Simplified%20User%20Profiles%20%28Steam%20tags%2C%20consolidation%20of%20prestiges%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558162/MWI%20Simplified%20User%20Profiles%20%28Steam%20tags%2C%20consolidation%20of%20prestiges%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STEAM_CUTOFF = new Date('2025-03-06T00:00:00Z');

    function parseAgeToDays(ageText) {
        let totalDays = 0;
        const cleanedText = ageText.trim().replace(/\./g, '');
        const parts = cleanedText.split(/\s+/);

        parts.forEach(part => {
            if (part.endsWith('y')) {
                const years = parseInt(part, 10);
                totalDays += years * 365;
            } else if (part.endsWith('d')) {
                const days = parseInt(part, 10);
                totalDays += days;
            }
        });

        return totalDays;
    }

    function getStatValue(overview, labelText) {
        const labelElement = Array.from(overview.querySelectorAll('.SharableProfile_statLabel__14jvH'))
            .find(l => l.textContent.trim() === labelText);
        if (!labelElement) return null;

        const row = labelElement.closest('.SharableProfile_statRow__2bT8_');
        if (!row) return null;

        const valueSpan = row.querySelector('.SharableProfile_statValue__oqH_y');
        return valueSpan ? valueSpan.textContent.trim() : null;
    }


    function getStatRow(overview, labelText) {
        const labelElement = Array.from(overview.querySelectorAll('.SharableProfile_statLabel__14jvH'))
            .find(l => l.textContent.trim() === labelText);
        if (!labelElement) return null;

        return labelElement.closest('.SharableProfile_statRow__2bT8_');
    }


    function processOverviewTab(overview) {
        if (!overview || overview.dataset.processed === '1') return;

        const taskPoints = getStatValue(overview, 'Task Points');
        const collectionPoints = getStatValue(overview, 'Collection Points');
        const bestiaryPoints = getStatValue(overview, 'Bestiary Points');

        const ageRow = getStatRow(overview, 'Age');

        if (taskPoints !== null && collectionPoints !== null && bestiaryPoints !== null && ageRow) {

            const newRow = document.createElement('div');
            newRow.className = 'SharableProfile_statRow__2bT8_';

            const newLabel = document.createElement('span');
            newLabel.className = 'SharableProfile_statLabel__14jvH';
            newLabel.textContent = 'Prestige Points';

            const newValue = document.createElement('span');
            newValue.className = 'SharableProfile_statValue__oqH_y';

            const taskSpan = document.createElement('span');
            taskSpan.textContent = taskPoints;
            taskSpan.title = "Task Points";
            taskSpan.style.cursor = 'help';

            const collectionSpan = document.createElement('span');
            collectionSpan.textContent = collectionPoints;
            collectionSpan.title = "Collection Points";
            collectionSpan.style.cursor = 'help';

            const bestiarySpan = document.createElement('span');
            bestiarySpan.textContent = bestiaryPoints;
            bestiarySpan.title = "Bestiary Points";
            bestiarySpan.style.cursor = 'help';

            newValue.appendChild(taskSpan);
            newValue.appendChild(document.createTextNode('/'));
            newValue.appendChild(collectionSpan);
            newValue.appendChild(document.createTextNode('/'));
            newValue.appendChild(bestiarySpan);

            newRow.appendChild(newLabel);
            newRow.appendChild(newValue);

            ageRow.before(newRow);

            const taskRow = getStatRow(overview, 'Task Points');
            const collectionRow = getStatRow(overview, 'Collection Points');
            const bestiaryRow = getStatRow(overview, 'Bestiary Points');

            if (taskRow) taskRow.remove();
            if (collectionRow) collectionRow.remove();
            if (bestiaryRow) bestiaryRow.remove();
        }

        if (!ageRow) return;

        const ageValueSpan = ageRow.querySelector('.SharableProfile_statValue__oqH_y');

        if (!ageValueSpan || ageValueSpan.dataset.steamTagged === '1') {
             overview.dataset.processed = '1';
             return;
        }

        const ageText = ageValueSpan.textContent.trim();
        const daysOld = parseAgeToDays(ageText);
        if (isNaN(daysOld) || daysOld < 0) {
            overview.dataset.processed = '1';
            return;
        }

        const createdTimestamp = Date.now() - (daysOld * 86400000);
        const createdDate = new Date(createdTimestamp);

        const isPreSteam = createdDate < STEAM_CUTOFF;
        const label = isPreSteam ? '(pre-Steam)' : '(post-Steam)';

        const tag = document.createElement('span');
        tag.textContent = ` ${label}`;
        tag.style.fontWeight = 'bold';
        tag.style.color = isPreSteam ? '#4CAF50' : '#FF9800';
        tag.style.marginLeft = '6px';
        tag.style.fontSize = '0.9em';
        tag.title = `Created ~${createdDate.toISOString().slice(0, 10)} (${daysOld} days old)`;

        ageValueSpan.appendChild(tag);
        ageValueSpan.dataset.steamTagged = '1';
        overview.dataset.processed = '1';
    }

    function applyConsolidationAndTags() {
        document.querySelectorAll('.SharableProfile_statsSection__E-yVw').forEach(processOverviewTab);
    }

    const observer = new MutationObserver(applyConsolidationAndTags);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', applyConsolidationAndTags);
    applyConsolidationAndTags();
})();