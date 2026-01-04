// ==UserScript==
// @name         FV - Feast Point Counter
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      8.6
// @description  Feast Point counter with batching, progress %, breakdown with quantities. Excludes spoiled food.
// @match        https://www.furvilla.com/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560469/FV%20-%20Feast%20Point%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/560469/FV%20-%20Feast%20Point%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (new URLSearchParams(location.search).get('type') !== 'is_food') return;

    const CACHE_KEY = 'fv_fp_cache';
    const BATCH_SIZE = 5;
    const PAUSE_MS = 50;
    let cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    let scanning = false;

    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#333; color:#f0f0f0; padding:12px; border-radius:8px; z-index:99999; font-size:14px; min-width:300px; max-height:55vh; overflow-y:auto; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-family:Arial, sans-serif;';
    document.body.appendChild(panel);

    function renderUI(status, showBtn) {
        status = status || '';
        showBtn = showBtn !== false;

        let totalFP = 0;
        const counts = {};

        for (const id in cache) {
            const item = cache[id];
            if (item.fp > 0) {
                totalFP += item.fp;
                if (!counts[item.name]) {
                    counts[item.name] = { count: 1, totalFP: item.fp, singleFP: item.fp };
                } else {
                    counts[item.name].count++;
                    counts[item.name].totalFP += item.fp;
                }
            }
        }

        let html = showBtn ? '<input type="submit" value="Start Scan" class="btn" style="text-align:center;margin-left:20px"><hr>' : '';
        html += status + '<strong>Total: ' + totalFP + ' FP</strong><hr>';

        const sorted = Object.entries(counts).sort(function(a, b) {
            return (b[1].totalFP || 0) - (a[1].totalFP || 0);
        });

        for (let i = 0; i < sorted.length; i++) {
            const name = sorted[i][0];
            const data = sorted[i][1];
            if (data.count > 1) {
                html += '<div style="margin-bottom:2px">x' + data.count + ' ' + name + ' = ' + data.totalFP + ' FP (' + data.singleFP + ' each)</div>';
            } else {
                html += '<div style="margin-bottom:2px">' + name + ' = ' + data.totalFP + ' FP</div>';
            }
        }

        if (sorted.length === 0) {
            html += '<em>No food counted yet</em>';
        }

        panel.innerHTML = html;

        if (showBtn) {
            var btn = panel.querySelector('input[type="submit"]');
            if (btn) {
                btn.addEventListener('click', startScan);
            }
        }
    }

    async function fetchItem(id, url, name) {
        if (cache[id] && cache[id].fp > 0) return;

        try {
            const res = await fetch(url);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bolds = doc.querySelectorAll('b');
            let fp = 0;

            for (let i = 0; i < bolds.length; i++) {
                const b = bolds[i];
                if (b.textContent.trim() === 'Expires At:') {
                    const next = b.nextSibling;
                    if (next && next.textContent && next.textContent.includes('Expired')) {
                        cache[id] = { name: name, fp: 0 };
                        return;
                    }
                }
                if (b.textContent.trim() === 'Feast Points:') {
                    const next = b.nextSibling;
                    if (next && next.textContent) {
                        fp = parseInt(next.textContent.trim(), 10) || 0;
                    }
                }
            }

            cache[id] = { name: name, fp: fp };
        } catch (e) {
            console.warn('Fetch error', id, e);
        }
    }

    async function getAllItems() {
        const items = [];
        let page = 1;

        while (true) {
            const url = new URL(location.href);
            url.searchParams.set('page', page);

            try {
                const res = await fetch(url);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('.show-inventory-actions');

                if (links.length === 0) break;

                for (let i = 0; i < links.length; i++) {
                    const a = links[i];
                    const nameSpan = a.querySelector('.name');
                    const name = nameSpan ? nameSpan.textContent.trim() : 'Unknown';
                    items.push({
                        id: a.getAttribute('data-id'),
                        url: a.getAttribute('href'),
                        name: name
                    });
                }

                if (!doc.querySelector('.pagination a[rel="next"]')) break;
                page++;
            } catch (e) {
                console.warn('Error fetching page', page, e);
                break;
            }
        }
        return items;
    }

    async function startScan() {
        if (scanning) return;
        scanning = true;
        cache = {};
        localStorage.removeItem(CACHE_KEY);
        renderUI('Scanning... Please Wait! ', false);

        const items = await getAllItems();
        let done = 0;

        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batch = [];
            for (let j = i; j < i + BATCH_SIZE && j < items.length; j++) {
                const item = items[j];
                if (!cache[item.id] || cache[item.id].fp === 0) {
                    batch.push(fetchItem(item.id, item.url, item.name));
                }
            }

            await Promise.all(batch);
            done += batch.length;
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

            const percent = Math.floor(done / items.length * 100);
            renderUI('Progress: ' + percent + '% (' + done + '/' + items.length + ')<br>', false);

            await new Promise(function(resolve) {
                setTimeout(resolve, PAUSE_MS);
            });
        }

        scanning = false;
        renderUI('<strong>Scan Complete!</strong><br>');
    }

    renderUI('', true);
})();