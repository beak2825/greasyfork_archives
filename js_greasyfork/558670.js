// ==UserScript==
// @name         Nextcloud – pełne daty i godziny na liście plików
// @namespace    https://your.cloud.adr/
// @version      1.1
// @description  Zamienia np. "wrzesień 2023" lub "3 dni temu" na "2023-09-11 21:16:46" w kolumnie daty modyfikacji plików w Nextcloudzie
// @match        https://*/apps/files/*
// @match        https://*/index.php/apps/files/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558670/Nextcloud%20%E2%80%93%20pe%C5%82ne%20daty%20i%20godziny%20na%20li%C5%9Bcie%20plik%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/558670/Nextcloud%20%E2%80%93%20pe%C5%82ne%20daty%20i%20godziny%20na%20li%C5%9Bcie%20plik%C3%B3w.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pad2(n) { return n.toString().padStart(2, '0'); }

    function formatDate(d) {
        if (!(d instanceof Date) || isNaN(d)) return null;
        return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) +
               ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
    }

    function parseTitle(title) {
        if (!title) return null;
        const m = title.match(/^\s*(\d{1,2})\.(\d{1,2})\.(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*$/);
        if (m) {
            const [ , day, month, year, hh, mm, ss ] = m.map(Number);
            return new Date(m[3], m[2] - 1, m[1], m[4], m[5], m[6]);
        }
        return null;
    }

    function parseDataTimestamp(ts) {
        if (!ts) return null;
        const d = new Date(ts);
        return isNaN(d) ? null : d;
    }

    function convertOnce() {
        // ustaw styl kolumny
        document.querySelectorAll('td.files-list__row-mtime').forEach(td => {
            td.style.width = 'calc(var(--row-height) * 3.5)';
        });

        // konwersja dat
        document.querySelectorAll('td.files-list__row-mtime .nc-datetime').forEach(el => {
            try {
                const currentText = el.textContent?.trim();
                let dateObj = null;

                // najpierw data-timestamp
                dateObj = parseDataTimestamp(el.getAttribute('data-timestamp'));
                if (!dateObj) dateObj = parseTitle(el.getAttribute('title'));

                if (!dateObj) {
                    const fallback = new Date(el.getAttribute('title'));
                    if (!isNaN(fallback)) dateObj = fallback;
                }

                if (dateObj) {
                    const formatted = formatDate(dateObj);
                    if (formatted && currentText !== formatted) el.textContent = formatted;
                }
            } catch (e) {
                console.warn('Nextcloud date conversion error', e);
            }
        });
    }

    let timeoutId = null;
    function scheduleConvert() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(convertOnce, 150);
    }

    window.addEventListener('load', scheduleConvert, { once: true });
    scheduleConvert();

    const observer = new MutationObserver(() => scheduleConvert());
    observer.observe(document.body, { childList: true, subtree: true });
})();