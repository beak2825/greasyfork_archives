// ==UserScript==
// @name         MyFxBook Trade Scraper
// @namespace    https://greasyfork.org/users/30331-setcher
// @version      1.0.4
// @description    Scraper of history data from MyFxBook strategies.
// @author       Setcher
// @match        https://www.myfxbook.com/members/*
// @match        https://www.myfxbook.com/portfolio/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557098/MyFxBook%20Trade%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/557098/MyFxBook%20Trade%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Dark Mode & Styles ===
    function isDarkMode() {
        const toggle = document.querySelector('#btn-toggle-theme, #btn-toggle-theme-mobile');
        return toggle && toggle.checked;
    }

    function updateStyles() {
        const dark = isDarkMode();
        const panelBg = dark ? '#2d2d2d' : '#f8f9fa';
        const panelColor = dark ? '#e0e0e0' : '#333';
        const panelBorder = dark ? '#444' : '#ddd';
        const saveBg = dark ? '#444' : '#e9ecef';
        const saveColor = dark ? '#fff' : '#333';
        const saveBorder = dark ? '#555' : '#ccc';
        const saveHover = dark ? '#555' : '#d4d8db';

        GM_addStyle(`
            #mfb-pro-panel { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin:20px 0; padding:20px; background:${panelBg}; color:${panelColor}; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,${dark ? '0.6' : '0.1'}); text-align:center; border:1px solid ${panelBorder}; }
            .mfb-toast { position:fixed; top:20px; right:20px; z-index:99999; background:#333; color:white; padding:14px 24px; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.5); font-size:15px; opacity:0; transform:translateY(-20px); transition:all 0.4s ease; max-width:400px; }
            .mfb-toast.show { opacity:1; transform:translateY(0); }
            .mfb-toast.success { background:#28a745; }
            .mfb-toast.error { background:#dc3545; }
            .mfb-toast.info { background:#007bff; }
            .btn { padding:10px 18px; margin:0 8px; border:none; border-radius:6px; cursor:pointer; font-weight:600; min-width:150px; }
            .btn-primary { background:#007bff; color:white; }
            .btn-success { background:#28a745; color:white; }
            .btn-warning { background:#fd7e14; color:white; }
            .btn-danger { background:#dc3545; color:white; }
            .btn-sm { padding:5px 10px; font-size:12px; }
            #mfb-progress { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:${dark ? '#1a1a1a' : '#1e1e1e'}; color:#fff; padding:30px 40px; border-radius:12px; z-index:99999; box-shadow:0 10px 40px rgba(0,0,0,0.6); text-align:center; min-width:420px; border:1px solid ${dark ? '#444' : '#333'}; }
            #mfb-save { background:${saveBg} !important; color:${saveColor} !important; border:1px solid ${saveBorder} !important; }
            #mfb-save:hover { background:${saveHover} !important; }
            #mfb-waiting { min-height:20px; }
            #mfb-progress-fill { transition: width 0.3s ease-in-out; height:100%; background:#28a745; }
        `);
    }

    // === Global State ===
    let cancelScraping = false;
    let progressBox = null;

    // === Settings ===
    const SETTINGS_KEY = 'mfb_scraper_v6';
    let settings = GM_getValue(SETTINGS_KEY, { minDelay: 1000, maxDelay: 3500 });

    // === Toast ===
    function toast(msg, type = 'info', time = 4000) {
        const t = document.createElement('div');
        t.className = `mfb-toast ${type}`;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add('show'), 50);
        if (time > 0) setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, time);
    }

    // === Timezone – Only on page load ===
    function getTimezoneInfo() {
        const select = document.querySelector('#timeSwitcher');
        if (!select) return { broker: 'Unknown', selected: 'Unknown' };
        let broker = 'Unknown', selected = 'Unknown';
        Array.from(select.options).forEach(o => {
            const txt = o.textContent.trim();
            if (o.hasAttribute('selected') || o.selected) selected = txt;
            if (txt.includes('Broker time')) broker = txt;
        });
        return { broker, selected };
    }

    // === CSV & Delay ===
    function htmlToCSV(html, includeHeader = true) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const table = doc.querySelector('#tradingHistoryTable');
        if (!table) return null;
        const rows = Array.from(table.querySelectorAll('tr'));
        const lines = [];
        rows.forEach((r, i) => {
            if (!includeHeader && i === 0) return;
            const cells = r.querySelectorAll('th, td');
            if (!cells.length) return;
            const row = Array.from(cells).map(c => {
                let t = c.innerText.trim().replace(/\s+/g, ' ');
                t = t.replace(/"/g, '""');
                if ([',', '"', '\n'].some(ch => t.includes(ch))) t = `"${t}"`;
                return t;
            });
            lines.push(row.join(','));
        });
        return lines.join('\n');
    }

    function randomDelay() {
        const ms = Math.floor(Math.random() * (settings.maxDelay - settings.minDelay + 1)) + settings.minDelay;
        const el = document.getElementById('mfb-waiting');
        if (el) {
            el.textContent = `Random waiting: ${ms} ms`;
            el.style.visibility = 'visible';
        }
        return new Promise(r => setTimeout(r, ms));
    }

    async function loadNextPage(html) {
        if (cancelScraping) {
            return null;
        }
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const next = doc.querySelector('.pagination .next a:not(.disabled-a)');
        if (!next) return null;
        const params = next.getAttribute('params');
        if (!params) return null;
        const url = 'https://www.myfxbook.com/paging.html?' + params.replace(/^\?/, '') + '&_=' + Date.now();
        const r = await fetch(url, { credentials: 'include' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return await r.text();
    }

    // === Progress Bar – SINGLE INSTANCE ===
    function resetScrapingState() {
        cancelScraping = true;
        if (progressBox) {
            showProgress('', 0)
            progressBox.style.display = 'none';
        }
    }

    function initProgressBox() {
        if (!progressBox) {
            progressBox = document.createElement('div');
            progressBox.id = 'mfb-progress';
            progressBox.innerHTML = `
                <div id="mfb-progress-title" style="font-size:18px;font-weight:600;margin-bottom:12px;">Starting...</div>
                <div style="height:12px;background:#333;border-radius:6px;overflow:hidden;margin:15px 0;">
                    <div id="mfb-progress-fill" style="width:0%;"></div>
                </div>
                <div id="mfb-waiting" style="font-size:13px;color:#aaa;margin:8px 0;min-height:20px;visibility:hidden;">Random waiting: 0 ms</div>
                <button id="mfb-cancel" class="btn btn-sm" style="background:#dc3545;color:white;">Cancel Scraping</button>
            `;
            document.body.appendChild(progressBox);

            document.getElementById('mfb-cancel').onclick = () => {
                cancelScraping = true;
                toast('Scraping cancelled', 'error');
                resetScrapingState();
            };
        }
        return progressBox;
    }

    function showProgress(text, progressPercent = 0) {
        const box = initProgressBox();
        box.style.display = 'block';

        const title = document.getElementById('mfb-progress-title');
        const fill = document.getElementById('mfb-progress-fill');

        if (title) title.textContent = text;
        if (fill) {
            // Use setTimeout to ensure the DOM update happens in next tick
            setTimeout(() => {
                fill.style.width = `${Math.max(1, Math.min(100, progressPercent))}%`;
            }, 10);
        }
    }

    function sleep(ms) {
        // add ms millisecond timeout before promise resolution
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // === Scraping – PROPER PROGRESS ===
    async function scrapeNextN(n) {
        resetScrapingState();
        cancelScraping = false;

        // Reset and show progress bar starting at first page
        showProgress(`Scraping page 1/${n}...`, Math.round((1 / n) * 100));
        await sleep(1000);

        let html = document.documentElement.outerHTML;
        const parts = [];
        let cnt = 0;
        try {
            while (cnt < n && !cancelScraping) {
                const csv = htmlToCSV(html, cnt === 0);
                if (csv) parts.push(csv);
                cnt++;

                // Update progress for current page (starts at 1/n)
                const progressPercent = Math.round((cnt / n) * 100);
                showProgress(`Scraping page ${cnt}/${n}...`, progressPercent);

                //const next = await loadNextPage(html);
                const next = "<html></html>"
                if (!next) break;
                html = next;
                if (cnt < n && !cancelScraping) await randomDelay();
            }
            if (cancelScraping) {
                toast('Scraping cancelled', 'error');
                return;
            }
            const final = parts.join('\n');
            await navigator.clipboard.writeText(final);
            toast(`Copied ${cnt} page(s) to clipboard!`, 'success', 5000);
        } catch (e) {
            if (!cancelScraping) {
                toast(`Error: ${e.message}`, 'error');
            }
        } finally {
            resetScrapingState();
        }
    }

    function getScrapFilename() {
        const strategy = location.pathname.match(/\/members\/([^\/]+)\/([^\/?]+)/);
        const sname = strategy ? strategy?.[1] + '_' + strategy?.[2] : null;
        const portfolio = location.pathname.match(/\/portfolio\/([^\/?]+)\/([^\/?]+)/);
        const pname = portfolio ? 'portfolio_' + portfolio?.[1] + '_' + portfolio?.[2] : null;
        const name = sname || pname || 'trades';
        const fn = `${name}_full_${new Date().toISOString().slice(0,10)}.csv`;
        return fn;
    }

    async function scrapeAll() {
        resetScrapingState();
        cancelScraping = false;

        const cur = document.querySelector('.pagination li.active a')?.textContent?.trim();
        if (hasPagination() && cur !== '1') {
            toast('Please go to PAGE 1 first', 'error');
            resetScrapingState();
            return;
        }

        const totalPages = Math.max(...Array.from(document.querySelectorAll('.pagination a[page]')).map(a => parseInt(a.textContent) || 0), 1);

        // Reset and show progress bar starting at first page
        showProgress(`Downloading page 1/${totalPages}...`, Math.round((1 / totalPages) * 100));

        let html = document.documentElement.outerHTML;
        const parts = [];
        let page = 0;
        try {
            // Define name.
            const fn = getScrapFilename()
            while (!cancelScraping) {
                page++;
                const progressPercent = Math.round((page / totalPages) * 100);
                showProgress(`Downloading page ${page}/${totalPages}...`, progressPercent);

                const csv = htmlToCSV(html, page === 1);
                if (csv) parts.push(csv);
                const next = await loadNextPage(html);
                if (!next) break;
                html = next;
                if (page < totalPages && !cancelScraping) await randomDelay();
            }
            if (cancelScraping) {
                toast('Scraping cancelled', 'error');
                return;
            }

            const blob = new Blob([parts.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = fn; a.style.display = 'none';
            document.body.appendChild(a); a.click();
            setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
            toast(`All ${page} pages saved as ${fn}!`, 'success', 8000);
        } catch (e) {
            if (!cancelScraping) {
                toast(`Failed: ${e.message}`, 'error');
            }
        } finally {
            resetScrapingState();
        }
    }

    function copyCurrent() {
        const csv = htmlToCSV(document.documentElement.outerHTML);
        if (!csv) { toast('No data', 'error'); return; }
        navigator.clipboard.writeText(csv).then(() => toast('Current page copied!', 'success'))
            .catch(() => {
                const ta = document.createElement('textarea'); ta.value = csv; document.body.appendChild(ta);
                ta.select(); document.execCommand('copy'); ta.remove();
                toast('Copied (fallback)', 'success');
            });
    }

    function hasPagination() {
        const pag = document.querySelector('.pagination[container="historyCont"]');
        if (!pag) return false; // not found → no pagination

        const style = pag.getAttribute('style') || '';
        const isHidden = /\bdisplay\s*:\s*none\b/i.test(style);

        return !isHidden; // visible → has pagination
    }

    // === UI ===
    function buildPanel() {
        if (document.getElementById('mfb-pro-panel')) return;

        const { broker, selected } = getTimezoneInfo();
        const curPage = document.querySelector('.pagination li.active a')?.textContent?.trim() || '1';
        const totalPages = Math.max(...Array.from(document.querySelectorAll('.pagination a[page]')).map(a => parseInt(a.textContent) || 0), 1);
        const hasPages = hasPagination();

        const panel = document.createElement('div');
        panel.id = 'mfb-pro-panel';
        panel.style.cssText = `
        margin: 20px 0;
        padding: 18px;
        background: var(--panel-bg, ${isDarkMode() ? '#2d2d2d' : '#f8f9fa'});
        color: var(--panel-color, ${isDarkMode() ? '#e0e0e0' : '#333'});
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,${isDarkMode() ? '0.6' : '0.1'});
        text-align: center;
        border: 1px solid ${isDarkMode() ? '#444' : '#ddd'};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

        panel.innerHTML = `
        <div style="margin-bottom:14px; font-weight:600; font-size:15px;">
            Data Timezone: <span style="color:#007bff;">${broker}</span> • Selected: <span style="color:#28a745;">${selected}</span>
        </div>

        <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 16px 0;
        ">
            <button id="mfb-copy" class="btn btn-primary" style="flex: 1 1 140px; min-width: 140px;">Copy Page</button>
            <button id="mfb-next" class="btn btn-success" style="flex: 1 1 140px; min-width: 140px;">Next Page</button>
            <button id="mfb-next3" class="btn btn-warning" style="flex: 1 1 140px; min-width: 140px;">Scrape Next 3</button>
            <button id="mfb-all" class="btn btn-danger" style="flex: 1 1 140px; min-width: 140px;">
                ${hasPages ? `Scrape All ${totalPages} pages` : 'Scrape'}
            </button>
        </div>

        <div style="margin-top:18px; font-size:13px; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:center;">
            <span>Delay:</span>
            <input id="mfb-min" type="number" value="${settings.minDelay}" style="width:68px; padding:4px 6px;">
            <span>–</span>
            <input id="mfb-max" type="number" value="${settings.maxDelay}" style="width:68px; padding:4px 6px;">
            <span>ms</span>
            <button id="mfb-save" class="btn btn-sm" style="padding:6px 12px;">Save</button>
        </div>
    `;

        // === Button Logic ===
        panel.querySelector('#mfb-copy').addEventListener('click', copyCurrent);
        panel.querySelector('#mfb-next').addEventListener('click', () => scrapeNextN(1));
        panel.querySelector('#mfb-next3').addEventListener('click', () => scrapeNextN(3));
        panel.querySelector('#mfb-all').addEventListener('click', scrapeAll);

        // Hide/show buttons based on pagination
        if (!hasPages) {
            panel.querySelector('#mfb-next').style.display = 'none';
            panel.querySelector('#mfb-next3').style.display = 'none';
        } else if (totalPages <= 3) {
            panel.querySelector('#mfb-next3').style.display = 'none';
        }

        if (curPage !== '1') {
            panel.querySelector('#mfb-all').disabled = true;
            panel.querySelector('#mfb-all').style.opacity = '0.6';
        }

        // Save delay
        panel.querySelector('#mfb-save').addEventListener('click', () => {
            const min = parseInt(panel.querySelector('#mfb-min').value) || 1000;
            const max = parseInt(panel.querySelector('#mfb-max').value) || 3500;
            if (max < min) { toast('Max ≥ Min', 'error'); return; }
            settings = { minDelay: min, maxDelay: max };
            GM_setValue(SETTINGS_KEY, settings);
            toast(`Saved: ${min}–${max} ms`, 'success');
        });

        // === Insert Panel ===
        const container = document.querySelector('.pagination-container');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(panel, container);
        } else {
            document.getElementById('historyCont')?.appendChild(panel);
        }
    }

    // === Add disk icon to History tab ===
    function addDiskIcon() {
        const historyTab = document.querySelector('a[href="#historyCont"][name="history"]');
        if (historyTab && !historyTab.dataset.mfbIconAdded) {
            historyTab.innerHTML = '💾 ' + historyTab.innerHTML.trim();
            historyTab.dataset.mfbIconAdded = 'true';
        }
    }

    // === Observers ===
    updateStyles();
    const styleObserver = new MutationObserver(updateStyles);
    styleObserver.observe(document.body, { attributes: true, subtree: true });

    const panelObserver = new MutationObserver(() => setTimeout(buildPanel, 600));
    panelObserver.observe(document.body, { childList: true, subtree: true });

    // === Initial Load ===
    setTimeout(() => {
        updateStyles();
        if (document.querySelector('#tradingHistoryTable')) {
            buildPanel();
            addDiskIcon();
        }
    }, 3000);
})();