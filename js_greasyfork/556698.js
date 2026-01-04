// ==UserScript==
// @name         PM2KS Scraper
// @namespace    pm-region-export
// @version      1.0
// @description  Fetch region codes + counts for all galleries and download as CSV
// @match        https://platesmania.com/userreg.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556698/PM2KS%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/556698/PM2KS%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- UI helper: overlay + spinner --------------------------------------
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pm-region-overlay';
        overlay.style.position = 'fixed';
        overlay.style.right = '20px';
        overlay.style.bottom = '20px';
        overlay.style.zIndex = '99999';
        overlay.style.padding = '10px 14px';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.color = '#fff';
        overlay.style.borderRadius = '6px';
        overlay.style.fontFamily = 'sans-serif';
        overlay.style.fontSize = '13px';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.gap = '8px';

        const spinner = document.createElement('div');
        spinner.style.width = '14px';
        spinner.style.height = '14px';
        spinner.style.border = '2px solid #fff';
        spinner.style.borderTopColor = 'transparent';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'pm-spin 0.7s linear infinite';

        const text = document.createElement('div');
        text.id = 'pm-region-overlay-text';
        text.textContent = 'Ready...';

        overlay.appendChild(spinner);
        overlay.appendChild(text);

        const style = document.createElement('style');
        style.textContent = `
@keyframes pm-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}`;
        document.head.appendChild(style);
        document.body.appendChild(overlay);

        return { overlay, text };
    }

    function updateOverlay(textElem, msg) {
        if (textElem) textElem.textContent = msg;
    }

    function removeOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    // --- CSV download helper -----------------------------------------------
    function downloadCSV(filename, rows) {
        const csv = rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Main logic ---------------------------------------------------------
    async function run() {
        const select = document.querySelector('select[name="gallery"]');
        if (!select) {
            alert('Platesmania script: no <select name="gallery"> found.');
            return;
        }

        const { overlay, text } = createOverlay();
        updateOverlay(text, 'Starting fetch...');

        const btn = document.getElementById('pm-region-btn');
        if (btn) btn.disabled = true;

        // Map: "CC|CODE" -> {countryCode, code, count}
        const regionMap = new Map();

        const options = Array.from(select.options).filter(o => o.value && o.value.trim() !== '');

        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            const galleryVal = opt.value.trim();
            // first 2 chars of gallery value are country code (de-94289, uk1-..., etc.)
            const countryCode = galleryVal.slice(0, 2).toUpperCase();
            const humanName = opt.textContent.trim();

            updateOverlay(text, `Fetching ${countryCode} (${humanName}) [${i + 1}/${options.length}] ...`);

            try {
                const url = new URL(window.location.href);
                url.searchParams.set('gallery', galleryVal);

                const resp = await fetch(url.toString(), { credentials: 'include' });
                const html = await resp.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // DataTables id seems to be "example"
                let rows = doc.querySelectorAll('#example tbody tr');
                if (!rows || rows.length === 0) {
                    // fallback: any table with that header structure
                    const candidateTables = doc.querySelectorAll('table');
                    for (const tbl of candidateTables) {
                        const ths = tbl.querySelectorAll('thead th');
                        const hasRegionHeader = Array.from(ths).some(th => /region/i.test(th.textContent));
                        if (hasRegionHeader) {
                            rows = tbl.querySelectorAll('tbody tr');
                            if (rows.length > 0) break;
                        }
                    }
                }

                rows.forEach(tr => {
                    const tds = tr.querySelectorAll('td');
                    if (tds.length < 4) return;

                    const code = tds[1].textContent.trim(); // column "#"
                    const cameraTd = tds[3]; // column with camera icon
                    if (!code) return;

                    const numText = cameraTd.textContent.replace(/\s+/g, ' ').trim();
                    const count = parseInt(numText.replace(/[^0-9]/g, ''), 10) || 0;

                    if (count < 1) return; // skip 0

                    const key = `${countryCode}|${code}`;
                    const existing = regionMap.get(key);
                    if (existing) {
                        // sum counts across multiple galleries, just in case
                        existing.count += count;
                    } else {
                        regionMap.set(key, { countryCode, code, count });
                    }
                });

            } catch (e) {
                console.error('Error fetching gallery', galleryVal, e);
            }
        }

        updateOverlay(text, 'Building CSV...');

        const lines = ['country_code,code,count'];
        for (const { countryCode, code, count } of regionMap.values()) {
            // codes should be safe (letters/numbers), but quote anyway
            const safeCode = `"${code.replace(/"/g, '""')}"`;
            lines.push(`${countryCode},${safeCode},${count}`);
        }

        downloadCSV('platesmania_regions_seen.csv', lines);

        updateOverlay(text, `Done. Exported ${regionMap.size} region codes.`);
        setTimeout(() => removeOverlay(overlay), 4000);
        if (btn) btn.disabled = false;
    }

    // Inject button
    function injectButton() {
        const btn = document.createElement('button');
        btn.id = 'pm-region-btn';
        btn.textContent = 'Export Platesmania region stats';
        btn.style.position = 'fixed';
        btn.style.right = '20px';
        btn.style.top = '20px';
        btn.style.zIndex = '99999';
        btn.style.padding = '6px 10px';
        btn.style.background = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.style.fontFamily = 'sans-serif';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        btn.addEventListener('click', () => {
            run();
        });

        document.body.appendChild(btn);
    }

    window.addEventListener('load', injectButton);
})();
