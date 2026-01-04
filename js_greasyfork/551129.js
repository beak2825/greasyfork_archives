// ==UserScript==
// @name         偽造學習時間 (用來逃避刷新檢查自己用F12改的時間)
// @namespace    https://example.com
// @version      1.2
// @description  假造時間逃過檢查，按 Tab+Q 還原真實時間
// @match        https://www.coolenglish.edu.tw/*
// @license      MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551129/%E5%81%BD%E9%80%A0%E5%AD%B8%E7%BF%92%E6%99%82%E9%96%93%20%28%E7%94%A8%E4%BE%86%E9%80%83%E9%81%BF%E5%88%B7%E6%96%B0%E6%AA%A2%E6%9F%A5%E8%87%AA%E5%B7%B1%E7%94%A8F12%E6%94%B9%E7%9A%84%E6%99%82%E9%96%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551129/%E5%81%BD%E9%80%A0%E5%AD%B8%E7%BF%92%E6%99%82%E9%96%93%20%28%E7%94%A8%E4%BE%86%E9%80%83%E9%81%BF%E5%88%B7%E6%96%B0%E6%AA%A2%E6%9F%A5%E8%87%AA%E5%B7%B1%E7%94%A8F12%E6%94%B9%E7%9A%84%E6%99%82%E9%96%93%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
    const STORAGE_KEY_PREFIX = 'fakeTimeCache_v1::coolenglish::';

    const pad = n => n.toString().padStart(2, '0');
    const secondsToText = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${pad(h)}小時 ${pad(m)}分 ${pad(s)}秒`;
    };

    const generateTimes = () => {
        const min = 6 * 3600;
        const total = 12 * 3600 + Math.floor(Math.random() * (3 * 3600));
        let a = 0, b = 0;
        do {
            a = min + Math.floor(Math.random() * (total - 2 * min));
            b = total - a;
        } while (b < min);
        return [total, a, b];
    };

    const storageKey = (key) => STORAGE_KEY_PREFIX + key;

    const loadCache = (key) => {
        try {
            const raw = localStorage.getItem(storageKey(key));
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj || typeof obj !== 'object') return null;
            if (obj.expireAt && Date.now() < obj.expireAt) {
                return obj;
            } else {
                localStorage.removeItem(storageKey(key));
                return null;
            }
        } catch (e) {
            return null;
        }
    };

    const saveCache = (key, payload) => {
        try {
            const obj = Object.assign({}, payload, { expireAt: Date.now() + CACHE_TTL_MS });
            localStorage.setItem(storageKey(key), JSON.stringify(obj));
        } catch (e) {}
    };

    const clearAllCache = () => {
        try {
            const prefix = STORAGE_KEY_PREFIX;
            const toRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(prefix)) toRemove.push(k);
            }
            toRemove.forEach(k => localStorage.removeItem(k));
        } catch (e) {}
    };

    const applyOrGenerateForRow = (row) => {
        const tds = row.querySelectorAll('td.teacher-a');
        if (tds.length !== 4) return false;

        const [monthTd, totalTd, watchTd, practiceTd] = tds;
        const idText = monthTd.textContent.trim() || ('row-index-' + Array.from(row.parentElement.children).indexOf(row));
        const cache = loadCache(idText);

        if (totalTd.dataset.modified) return false;

        totalTd.dataset.original = totalTd.textContent;
        watchTd.dataset.original = watchTd.textContent;
        practiceTd.dataset.original = practiceTd.textContent;

        if (cache) {
            totalTd.textContent = secondsToText(cache.total);
            watchTd.textContent = secondsToText(cache.watch);
            practiceTd.textContent = secondsToText(cache.practice);
        } else {
            const [total, watch, practice] = generateTimes();
            totalTd.textContent = secondsToText(total);
            watchTd.textContent = secondsToText(watch);
            practiceTd.textContent = secondsToText(practice);
            saveCache(idText, { total, watch, practice });
        }

        totalTd.dataset.modified = "true";
        return true;
    };

    const updateTimes = () => {
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => applyOrGenerateForRow(row));
    };

    const revertTimes = () => {
        const tds = document.querySelectorAll('td.teacher-a[data-modified="true"]');
        tds.forEach(td => {
            if (td.dataset.original) {
                td.textContent = td.dataset.original;
                delete td.dataset.modified;
                delete td.dataset.original;
            }
        });
    };

    const observer = new MutationObserver(() => {
        updateTimes();
    });

    const init = () => {
        updateTimes();
        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.clearFakeTimeCache = function () {
        clearAllCache();
        revertTimes();
        console.info('✅ 已清除假時間與快取，並還原原始顯示');
    };

    window.refreshFakeTimeDisplay = function () {
        const tds = document.querySelectorAll('td.teacher-a[data-modified="true"]');
        tds.forEach(td => delete td.dataset.modified);
        updateTimes();
        console.info('🔄 已重新套用快取中的假時間');
    };

    (() => {
        let tabPressed = false;

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                tabPressed = true;
                setTimeout(() => { tabPressed = false; }, 500);
            }

            if (e.key.toLowerCase() === 'q' && tabPressed) {
                clearAllCache();
                revertTimes();
                console.info('🧹 Tab+Q 被觸發：已還原原始資料並清除快取');
            }
        });
    })();

})();
