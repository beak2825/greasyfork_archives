// ==UserScript==
// @name         BoB-For-Free (Discovery Helper) — Legal Discovery Tools
// @namespace    https://example.local
// @version      1.0
// @description  Adds discovery and export tools to Learning on Screen / Box of Broadcasts public pages. DOES NOT bypass login or fetch protected files. Use to export metadata, bulk-open listing pages, and search public archives for titles.
// @author       ChatGPT
// @match        https://learningonscreen.ac.uk/ondemand/*
// @grant        GM_setClipboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550977/BoB-For-Free%20%28Discovery%20Helper%29%20%E2%80%94%20Legal%20Discovery%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/550977/BoB-For-Free%20%28Discovery%20Helper%29%20%E2%80%94%20Legal%20Discovery%20Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* --- CONFIG --- */
    const TOOLBAR_ID = 'bob-discovery-toolbar';
    const BUTTON_STYLE = 'margin:4px;padding:6px 8px;border-radius:4px;border:1px solid #888;background:#fff;cursor:pointer;';
    /* --------------- */

    function createToolbar() {
        if (document.getElementById(TOOLBAR_ID)) return;
        const bar = document.createElement('div');
        bar.id = TOOLBAR_ID;
        bar.style = 'position:fixed;right:12px;top:80px;z-index:9999;padding:8px;border:1px solid rgba(0,0,0,0.12);background:rgba(255,255,255,0.97);box-shadow:0 2px 8px rgba(0,0,0,0.08);font-family:Arial,Helvetica,sans-serif;font-size:13px;max-width:320px;';
        bar.innerHTML = `<strong style="display:block;margin-bottom:6px;">BoB Discovery Helper</strong>`;
        document.body.appendChild(bar);

        addButton(bar, 'Export visible metadata (CSV)', exportCSV);
        addButton(bar, 'Copy metadata to clipboard (TSV)', copyTSV);
        addButton(bar, 'Bulk-open result pages (tab per item)', bulkOpen);
        addButton(bar, 'Search Archive.org for titles', searchArchiveOrg);
        addButton(bar, 'Search Google Video for titles', searchGoogleVideo);
        addButton(bar, 'Refresh detected items', () => {
            scanItems(true);
            alert('Refreshed.');
        });

        const hint = document.createElement('div');
        hint.style = 'margin-top:8px;font-size:12px;color:#444';
        hint.innerText = 'Works only with metadata visible on public listing pages. Does not access protected video files.';
        bar.appendChild(hint);
    }

    function addButton(container, text, handler) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style = BUTTON_STYLE;
        btn.textContent = text;
        btn.addEventListener('click', handler);
        container.appendChild(btn);
    }

    // ---- Item scanning ----
    let cachedItems = null;

    function scanItems(force = false) {
        if (cachedItems && !force) return cachedItems;

        // Try to detect common structures on BoB listing/search pages.
        // We only read text visible on the page (title, broadcaster, date, duration, page link).
        const items = [];
        // Many BoB listing pages use li.search-result or div.programme; try multiple selectors.
        const selectors = [
            'li.search-result',        // older pattern
            '.search-result',          // generic
            '.programme',              // possible pattern
            '.card',                   // fallback
            '.result'                  // fallback
        ];

        let nodes = [];
        for (const s of selectors) {
            const found = Array.from(document.querySelectorAll(s));
            if (found.length) {
                nodes = found;
                break;
            }
        }
        // Generic fallback: try list items with links and dates
        if (!nodes.length) {
            nodes = Array.from(document.querySelectorAll('a[href*="/ondemand/"], article, li')).slice(0, 200);
        }

        nodes.forEach((node) => {
            try {
                // Title
                let title = '';
                const titleEl = node.querySelector('h3, h2, .title, .programme-title, a');
                if (titleEl) title = titleEl.textContent.trim();

                // Link (page)
                let link = '';
                const a = node.querySelector('a[href*="/ondemand/"]');
                if (a) link = a.href;

                // Broadcaster / channel
                let broadcaster = '';
                const bEl = node.querySelector('.broadcaster, .channel, .station, .publisher');
                if (bEl) broadcaster = bEl.textContent.trim();

                // Date / Air date
                let date = '';
                const dateEl = Array.from(node.querySelectorAll('time, .date, .broadcast-date, .air-date')).find(Boolean);
                if (dateEl) date = dateEl.textContent.trim();

                // Duration
                let duration = '';
                const durEl = node.querySelector('.duration, .length, .running-time');
                if (durEl) duration = durEl.textContent.trim();

                // summary or description
                let summary = '';
                const sumEl = node.querySelector('.summary, .description, .synopsis, p');
                if (sumEl) summary = sumEl.textContent.trim().replace(/\s+/g,' ').slice(0,400);

                if (!title && !link) return;
                items.push({ title, broadcaster, date, duration, summary, link });
            } catch (e) {
                // ignore node if parsing fails
            }
        });

        // Deduplicate by link or title
        const unique = [];
        const seen = new Set();
        for (const it of items) {
            const key = (it.link || it.title).toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(it);
            }
        }

        cachedItems = unique;
        return unique;
    }

    // ---- Actions ----
    function exportCSV() {
        const items = scanItems();
        if (!items.length) { alert('No items detected on this page. Try on a search/listing page.'); return; }

        const rows = [['Title','Broadcaster','Date','Duration','Link','Summary']];
        items.forEach(it => rows.push([escapeCSV(it.title), escapeCSV(it.broadcaster), escapeCSV(it.date), escapeCSV(it.duration), it.link, escapeCSV(it.summary)]));
        const csv = rows.map(r => r.join(',')).join('\n');
        downloadText(csv, `bob_metadata_${safeFilename(document.title)}.csv`, 'text/csv;charset=utf-8;');
    }

    function copyTSV() {
        const items = scanItems();
        if (!items.length) { alert('No items detected on this page.'); return; }
        const lines = items.map(it => [it.title, it.broadcaster, it.date, it.duration, it.link, it.summary].join('\t'));
        const tsv = lines.join('\n');
        // Try to use GM_setClipboard if available, otherwise fallback to navigator.clipboard
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(tsv);
            alert('Metadata copied to clipboard (TSV).');
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(tsv).then(()=> alert('Metadata copied to clipboard (TSV).')).catch(()=> alert('Clipboard failed — copy manually.'));
        } else {
            prompt('Copy the metadata below (TSV):', tsv);
        }
    }

    function bulkOpen() {
        const items = scanItems();
        if (!items.length) { alert('No items detected to open.'); return; }
        const filtered = items.filter(it => it.link);
        if (!filtered.length) { alert('No item links found to open.'); return; }
        const confirmCount = Math.min(filtered.length, 25);
        if (!confirm(`Open ${confirmCount} pages in new tabs? (This will open up to 25 tabs)`)) return;
        for (let i = 0; i < Math.min(filtered.length, 25); i++) {
            window.open(filtered[i].link, '_blank');
        }
    }

    function searchArchiveOrg() {
        const items = scanItems();
        if (!items.length) { alert('No items detected.'); return; }
        // Build a search query for archive.org for each title; open first 6 in new tabs
        const queries = items.map(it => encodeURIComponent(it.title + ' ' + (it.broadcaster||'')).replace(/%20%20/g,'%20')).filter(Boolean).slice(0,6);
        if (!queries.length) return alert('No suitable titles to search.');
        queries.forEach(q => window.open('https://archive.org/search.php?query=' + q, '_blank'));
    }

    function searchGoogleVideo() {
        const items = scanItems();
        if (!items.length) { alert('No items detected.'); return; }
        const queries = items.map(it => encodeURIComponent(it.title + ' ' + (it.broadcaster||'')).replace(/%20%20/g,'%20')).filter(Boolean).slice(0,6);
        queries.forEach(q => window.open('https://www.google.com/search?q=' + q + '&tbm=vid', '_blank'));
    }

    // ---- Helpers ----
    function escapeCSV(s) {
        if (s == null) return '';
        s = String(s).replace(/"/g,'""');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s}"`;
        return s;
    }
    function downloadText(text, filename, mime='text/plain') {
        const blob = new Blob([text], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function safeFilename(s) {
        return (s || 'export').replace(/[^a-z0-9\-_\.]/ig,'_').slice(0,120);
    }

    // add toolbar after DOM loaded
    function tryInit() {
        createToolbar();
        scanItems();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        tryInit();
    } else {
        window.addEventListener('DOMContentLoaded', tryInit);
    }

    // optional: refresh cache on navigation or ajax updates
    new MutationObserver(() => { cachedItems = null; }).observe(document.body, { childList: true, subtree: true });

    // Provide keyboard shortcut (press "D" while not in an input to copy TSV)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'D' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
            e.preventDefault();
            copyTSV();
        }
    });

})();
