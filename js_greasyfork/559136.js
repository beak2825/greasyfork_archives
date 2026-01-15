// ==UserScript==
// @name         EGS Library RU
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  Отображение информации на карточках о владении на сайте Epic Games.
// @author       pumPCin
// @license      MIT
// @match        https://store.epicgames.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @grant        GM.deleteValue
// @connect      store.epicgames.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559136/EGS%20Library%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/559136/EGS%20Library%20RU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastPath = window.location.href;
    let queue = [];
    let isProcessing = false;
    let isPaused = false;

    const DELAY_LIVE = 3000;
    const REGEX_OWNED = /(?:В библиотеке)/i;
    const REGEX_UNAVAILABLE = /(?:Недоступно)/i;
    const REGEX_MISSING_BASE = /(?:Необходима базовая версия)/i;

    function normalizeUrl(url) {
        try {
            let u = new URL(url);
            return u.pathname.toLowerCase().replace(/\/+$/, '').split('/').pop() || url;
        } catch (e) { return url; }
    }

    function determineStatus(text) {
        if (REGEX_OWNED.test(text)) return 'OWNED';
        if (REGEX_UNAVAILABLE.test(text)) return 'UNAVAILABLE';
        if (REGEX_MISSING_BASE.test(text)) return 'DLC_MISSING_BASE';
        return 'NOT_OWNED';
    }

    const logWrapper = document.createElement('div');
    logWrapper.id = 'log-wrapper-egs';
    logWrapper.style.cssText = 'position:fixed;bottom:10px;right:10px;width:380px;background:rgba(10,10,10,0.95);color:#0f0;font-family:monospace;font-size:10px;z-index:10000;border:1px solid #333;border-radius:3px;box-shadow:0 0 10px #000;display:flex;flex-direction:column;';

    const btnStyle = 'background:none;border:none;color:#0078f2;cursor:pointer;font-family:monospace;font-size:11px;font-weight:bold;padding:0 2px;';

    logWrapper.innerHTML = `
        <div id="log-h" style="padding:5px;background:#222;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;user-select:none;">
            <div style="display:flex;gap:5px;">
                <button id="btn-clear-all" title="Удалить из кэша 'ВСЁ'" style="${btnStyle}color:#f44336;">[К]</button>
                <button id="btn-clear-owned" title="Удалить из кэша 'В БИБЛИОТЕКЕ'" style="${btnStyle}color:#0078f2;">[В]</button>
                <button id="btn-clear-not" title="Удалить из кэша 'НЕ КУПЛЕНО'" style="${btnStyle}color:#ff9800;">[Н]</button>
                <button id="btn-clear-dupes" title="Удалить из кэша дубликаты и конфликты" style="${btnStyle}color:#0ff;">[Д]</button>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
                <span style="color:#666;">Панель логов EGS Library RU</span>
                <button id="log-t" style="${btnStyle}color:#fff;">[—]</button>
            </div>
        </div>
        <div id="log-b" style="padding:5px;max-height:200px;overflow-y:auto;user-select:text;display:flex;flex-direction:column;"></div>
    `;
    document.body.appendChild(logWrapper);

    const logBody = document.getElementById('log-b');
    const toggleBtn = document.getElementById('log-t');

    const savedState = localStorage.getItem('egs_log_collapsed');
    let isCollapsed = savedState === null ? true : (savedState === 'true');

    if (isCollapsed) {
        logBody.style.display = 'none';
        toggleBtn.innerText = '[+]';
    } else {
        logBody.style.display = 'flex';
        toggleBtn.innerText = '[—]';
    }

    toggleBtn.onclick = () => {
        const isHidden = logBody.style.display === 'none';
        if (isHidden) {
            logBody.style.display = 'flex';
            toggleBtn.innerText = '[—]';
            localStorage.setItem('egs_log_collapsed', 'false');
        } else {
            logBody.style.display = 'none';
            toggleBtn.innerText = '[+]';
            localStorage.setItem('egs_log_collapsed', 'true');
        }
    };

    function addLog(msg, color = '#aaa') {
        const e = document.createElement('div');
        e.style.color = color; e.style.borderBottom = '1px solid #222'; e.style.padding = '2px 0';
        e.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logBody.appendChild(e);
        logBody.scrollTop = logBody.scrollHeight;
        if (logBody.childNodes.length > 50) logBody.firstChild.remove();
    }

    async function clearCache(filter) {
        const keys = await GM.listValues();
        for (const key of keys) {
            const val = await GM.getValue(key);
            if (filter === 'ALL' || (val && val.status === filter)) await GM.deleteValue(key);
        }
        location.reload();
    }

    async function clearDuplicates() {
        addLog("Сканирование кэша…", "#fff");
        const keys = await GM.listValues();
        const seen = {};
        let count = 0;

        for (const key of keys) {
            const val = await GM.getValue(key);
            if (!val || !val.status) continue;

            if (seen[key]) {
                if (seen[key] !== val.status) {
                    addLog(`Конфликт (${key}): удален`, "#fff");
                    await GM.deleteValue(key);
                } else {
                    addLog(`Дубликат (${key}): удален`, "#fff");
                    count++;
                }
            } else { seen[key] = val.status; }
        }
        addLog(`Правка кэша завершена. Удалено записей: ${count}`, "#fff");
    }

    document.getElementById('btn-clear-all').onclick = () => clearCache('ALL');
    document.getElementById('btn-clear-owned').onclick = () => clearCache('OWNED');
    document.getElementById('btn-clear-not').onclick = () => clearCache('NOT_OWNED');
    document.getElementById('btn-clear-dupes').onclick = clearDuplicates;

    async function checkCurrentPage() {
        if (!window.location.pathname.includes('/p/') && !window.location.pathname.includes('/bundles/')) return;

        const gameKey = normalizeUrl(window.location.href);
        const buyButton = document.querySelector('aside') || document.querySelector('[data-testid="purchase-cta-button"]');

        if (buyButton) {
            const status = determineStatus(buyButton.innerText);
            const oldData = await GM.getValue(gameKey);

            if (!oldData || oldData.status !== status) {
                await GM.setValue(gameKey, { status, time: Date.now() });
                addLog(`[СТРАНИЦА ТОВАРА] КЭШ обновлен: ${gameKey} -> ${status}`, "#0ff");
            }
        }
    }

    async function processQueue() {
        if (isProcessing || queue.length === 0) return;
        isProcessing = true;

        while (queue.length > 0) {
            if (isPaused) { await new Promise(r => setTimeout(r, 1000)); continue; }
            const item = queue.shift();
            const gameKey = normalizeUrl(item.url);

            addLog(`LIVE запрос: ${gameKey}`, '#fff');

            await new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: "GET", url: item.url,
                    onload: async (res) => {
                        if (res.status > 200) {
                            addLog(`Ошибка ${res.status}: пауза 60 сек…`, '#fff');;
                            isPaused = true;
                            setTimeout(() => { isPaused = false; addLog('Пауза снята', '#fff'); }, 60000);
                            resolve(); return;
                        }
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');
                        const buyButton = doc.querySelector('aside') || doc.querySelector('[data-testid="purchase-cta-button"]') || doc.body;
                        const status = determineStatus(buyButton.innerText);

                        await GM.setValue(gameKey, { status, time: Date.now() });
                        applyBadge(item.card, status, false, gameKey);
                        let logColor = '#fff';
                        switch (status) {
                            case 'OWNED': logColor = '#4caf50'; break;
                            case 'NOT_OWNED': logColor = '#f44336'; break;
                            case 'UNAVAILABLE': logColor = '#9e9e9e'; break;
                            case 'DLC_MISSING_BASE': logColor = '#616161'; break;
                        }
                        addLog(`LIVE [${status}]: ${gameKey}`, logColor);
                        resolve();
                    },
                    onerror: () => resolve()
                });
            });
            await new Promise(r => setTimeout(r, DELAY_LIVE));
        }
        isProcessing = false;
    }

    function applyBadge(card, status, isCache, gameKey) {
        const old = card.querySelector('.egs-badge'); if (old) old.remove();
        const badge = document.createElement('div');
        badge.className = 'egs-badge';
        let bg, text;
        switch (status) {
            case 'OWNED':
                bg = isCache ? '#0078f2' : '#4caf50';
                text = "В БИБЛИОТЕКЕ";
                break;
            case 'UNAVAILABLE':
                bg = isCache ? '#030303' : '#222222';
                text = "НЕДОСТУПНО";
                break;
            case 'DLC_MISSING_BASE':
                bg = isCache ? '#060606' : '#252525';
                text = "НЕТ ИГРЫ";
                break;
            default:
                bg = isCache ? '#ff9800' : '#f44336';
                text = "НЕ КУПЛЕНО";
        }

        badge.style.cssText = `
            position:absolute;
            top:0px;
            left:2px;
            background:${bg};
            color:white;
            padding:3px 8px;
            font-size:10px;
            font-weight:bold;
            border-radius:3px;
            z-index:20;
            pointer-events:none;
            box-shadow:0 2px 4px rgba(0,0,0,0.5);
        `;
        badge.innerText = text;

        card.style.position = "relative";
        card.appendChild(badge);
        card.dataset.marked = status;
    }

    function scan() {
        if (window.location.href !== lastPath) {
            lastPath = window.location.href;
            queue = [];
            addLog('Смена URL: очистка', '#0ff');
            document.querySelectorAll('.egs-badge').forEach(b => b.remove());
            document.querySelectorAll('a[href*="/p/"], a[href*="/bundles/"]').forEach(l => { 
                delete l.dataset.marked; 
                delete l.dataset.enqueued; 
            });
        }

        checkCurrentPage();

        const links = document.querySelectorAll('a[href*="/p/"], a[href*="/bundles/"]');
        links.forEach(async (link) => {
            const hasImage = link.querySelector('img') || link.querySelector('picture') || link.innerHTML.includes('srcset');
            if (!hasImage) return;

            const gameKey = normalizeUrl(link.href);
            const cached = await GM.getValue(gameKey);

            if (cached) {
                if (link.dataset.marked !== cached.status) {
                    applyBadge(link, cached.status, true, gameKey);
                    let logColor = '#fff';
                    switch (cached.status) {
                        case 'OWNED': logColor = '#0078f2'; break;
                        case 'NOT_OWNED': logColor = '#ff9800'; break;
                        case 'UNAVAILABLE': logColor = '#aaaaaa'; break;
                        case 'DLC_MISSING_BASE': logColor = '#666666'; break;
                    }
                    addLog(`КЭШ [${cached.status}]: ${gameKey}`, logColor);
                }
            } else if (!link.dataset.enqueued && !link.dataset.marked) {
                link.dataset.enqueued = "true";
                queue.push({url: link.href, card: link});
                processQueue();
            }
        });
    }

    setInterval(scan, 2500);
    addLog('Скрипт работает', '#0078f2');
})();
