// ==UserScript==
// @name         icehockey.ro — Enable Game Center buttons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace disabled "Game Center" buttons with working <a href> links built from commented form data on icehockey.ro:8447 pages.
// @author       ChatGPT
// @license      MIT
// @match        https://icehockey.ro:8447/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557668/icehockeyro%20%E2%80%94%20Enable%20Game%20Center%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/557668/icehockeyro%20%E2%80%94%20Enable%20Game%20Center%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If the script can't detect a season on the page, it will use this fallback.
    // Change this number to the desired default season if needed.
    const defaultSeason = 3;

    function findSeason() {
        // try common places: hidden inputs/selects, meta tags, data attributes, or URL
        const inputs = document.querySelectorAll('input[name="season"], select[name="season"]');
        for (const el of inputs) {
            if (el.value) return el.value;
        }
        const meta = document.querySelector('meta[name="season"]');
        if (meta && meta.content) return meta.content;
        // data-season on body or main container
        const body = document.body;
        if (body && body.dataset && body.dataset.season) return body.dataset.season;
        // try to parse season from the current URL path or query
        const url = new URL(location.href);
        if (url.searchParams.has('season')) return url.searchParams.get('season');
        const pathMatch = location.pathname.match(/season\/(\d+)/i);
        if (pathMatch) return pathMatch[1];
        return String(defaultSeason);
    }

    const seasonId = findSeason();

    function buildHrefFromCommentedForm(tdInnerHTML) {
        // tdInnerHTML contains the commented HTML snippet. We'll extract useful values via regex.
        // Examples to find:
        // action="https://icehockey.ro:8447/game/1182"
        // name="id_schedule" value="1182"
        // name="id_event" value="23"
        // name="id_team" value="155"

        const actionMatch = tdInnerHTML.match(/action\s*=\s*"([^"]*\/game\/(\d+))"/i);
        const scheduleId = actionMatch ? (actionMatch[2] || null) : null;

        const scheduleMatch = tdInnerHTML.match(/name\s*=\s*"id_schedule"\s*value\s*=\s*"(\d+)"/i);
        const scheduleId2 = scheduleMatch ? scheduleMatch[1] : null;

        const eventMatch = tdInnerHTML.match(/name\s*=\s*"id_event"\s*value\s*=\s*"(\d+)"/i);
        const eventId = eventMatch ? eventMatch[1] : null;

        const teamMatch = tdInnerHTML.match(/name\s*=\s*"id_team"\s*value\s*=\s*"(\d+)"/i);
        const teamId = teamMatch ? teamMatch[1] : null;

        const schedule = scheduleId || scheduleId2;
        if (!schedule || !eventId) return null; // need at least schedule and event to build the URL

        // Construct URL like: https://icehockey.ro:8447/game/{schedule}/event/{event}/season/{season}
        const href = `https://icehockey.ro:8447/game/${schedule}/event/${eventId}/season/${seasonId}`;
        return { href, schedule, eventId, teamId };
    }

    function transformTd(td) {
        if (!td) return;
        // find the disabled button with text "Game Center"
        const btn = td.querySelector('button.btn.btn-primary.m-1[disabled], button.btn.btn-primary.m-1[disabled=""]');
        if (!btn) return;

        // avoid double-processing: if an anchor already exists, skip
        if (td.querySelector('a[data-game-center-href]')) return;

        const html = td.innerHTML;
        const data = buildHrefFromCommentedForm(html);
        if (!data) return;

        // create anchor wrapper
        const a = document.createElement('a');
        a.href = data.href;
        a.setAttribute('data-game-center-href', '1');
        a.target = '_blank'; // open in new tab so user doesn't lose current page
        // clone the button so we preserve classes and styles
        const newBtn = btn.cloneNode(true);
        newBtn.removeAttribute('disabled');
        newBtn.type = 'button';
        // optional: change text to indicate link
        // newBtn.textContent = 'Game Center (open)';

        a.appendChild(newBtn);

        // place anchor in the td where the button was
        // We'll replace the disabled button with the anchor-wrapped button
        btn.parentNode.replaceChild(a, btn);
    }

    function runOnce() {
        const tds = document.querySelectorAll('td.text-center');
        for (const td of tds) {
            transformTd(td);
        }
    }

    // Run once on load
    runOnce();

    // Observe DOM changes (useful if the table is loaded dynamically)
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                // if a new td was added directly
                if (node.matches && node.matches('td.text-center')) transformTd(node);
                // or if it contains such tds
                const innerTds = node.querySelectorAll && node.querySelectorAll('td.text-center');
                if (innerTds && innerTds.length) {
                    innerTds.forEach(transformTd);
                }
            }
        }
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

})();