// ==UserScript==
// @name         TMXWarnCheatedMap
// @namespace    mailto:pietagorhh@proton.me
// @version      2025-12-30_17-08
// @description  Displays warning on cheated maps on TMX, based on the Cheated Map List (https://docs.google.com/spreadsheets/d/1fqmzFGPIFBlJuxlwnPJSh1nCTTxqWXtHtvP5OUxE4Ow)
// @author       Pietagorh
// @homepage     https://discord.gg/HRShWnzpK3
// @match        https://tmnf.exchange/tracksearch*
// @match        https://tmnf.exchange/trackpackshow/*
// @match        https://tmnf.exchange/trackshow/*
// @icon         https://account.mania.exchange/img/logos/TMNF.png
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/560758/TMXWarnCheatedMap.user.js
// @updateURL https://update.greasyfork.org/scripts/560758/TMXWarnCheatedMap.meta.js
// ==/UserScript==

const SHEET_ID = '1fqmzFGPIFBlJuxlwnPJSh1nCTTxqWXtHtvP5OUxE4Ow';
const GID = '0';

const FA_WARNING_SYMBOL = 'fa-exclamation-triangle';

const SHEETS_RESPONSE_HEADER = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
const SHEETS_RESPONSE_FOOTER = ');';

async function getData() {
    const result = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${GID}`);
    const cleaned = (await result.text()).slice(SHEETS_RESPONSE_HEADER.length, -SHEETS_RESPONSE_FOOTER.length);
    const json = JSON.parse(cleaned);
    return json.table.rows;
}

function getMatchingCheated(trackId, data) {
    const matchingEntries = data.filter(row => row.c[1].v === trackId);
    return matchingEntries.length ? matchingEntries[0].c : null;
}

async function trackshow(path, data) {
    const trackId = parseInt(path[1]);
    data = await data;

    const cheatedEntry = getMatchingCheated(trackId, data);
    if (!cheatedEntry) return;

    const cheatedCategory = cheatedEntry[0].v;
    const cheatedComment = cheatedEntry[5].v;

    const warningBanner = document.createElement('div');
    warningBanner.className = 'alert';
    warningBanner.style = '--bs-alert-color: var(--bs-warning-text-emphasis); --bs-alert-bg: var(--bs-warning-bg-subtle); --bs-alert-border-color: var(--bs-warning-border-subtle); --bs-alert-link-color: var(--bs-warning-text-emphasis);'

    // There's probably a cleaner way to do that lol
    warningBanner.innerText += `${cheatedCategory}${(cheatedComment ? `: ${cheatedComment}` : '')}.`;
    warningBanner.innerHTML = " This track was identified as invalid.<br>" + warningBanner.innerHTML;

    const warningSymbol = document.createElement('i');
    warningSymbol.className = `fas ${FA_WARNING_SYMBOL}`;
    warningBanner.prepend(warningSymbol);

    document.getElementsByClassName("col-md-6")[0].prepend(warningBanner);
}

// From https://stackoverflow.com/a/61511955
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve();
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve();
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.getElementById('searchLB'), {
            childList: true,
            subtree: true
        });
    });
}

async function tracksearch(data) {
    // If we don't, we might get overwritten
    await waitForElement('#searchLB > table > thead > tr > th.WindowTableHeader1-orderby');

    const searchTable = document.getElementById('searchLB').firstChild;
    const tableHead = searchTable.tHead.rows[0];
    const tableBody = searchTable.tBodies[0];

    // Create new column
    const newColumnHeader = document.createElement('th');
    newColumnHeader.innerText = "Cheated?";
    newColumnHeader.width = '900';
    tableHead.append(newColumnHeader);
    for (let i = 0; i < tableBody.rows.length; i++) {
        const track = tableBody.rows[i];
        const newCollumnCell = document.createElement('td');
        track.append(newCollumnCell);
    }

    // Populate it
    data = await data;
    for (let i = 0; i < tableBody.rows.length; i++) {
        const track = tableBody.rows[i];

        const cheatedEntry = getMatchingCheated(parseInt(track.dataset.mapid), data);
        if (cheatedEntry) {
            const cheatedCell = tableBody.rows[i].lastChild;
            cheatedCell.innerText += " " + cheatedEntry[0].v;

            const warningSymbol = document.createElement('i');
            warningSymbol.className = `fas ${FA_WARNING_SYMBOL}`;
            cheatedCell.prepend(warningSymbol);
        }
    }

    // Changing page doesn't reload the page so we wait for the table to get emptied
    await waitForElement('#searchLB > table:not(:has(> thead))');
    tracksearch(data);
}

(async function() {
    'use strict';
    const data = getData();
    const path = window.location.pathname.split('/').filter(p => p);

    path[0] === 'trackshow' ? trackshow(path, data) : tracksearch(data);
})();
