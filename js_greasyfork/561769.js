// ==UserScript==
// @name         RID Avito
// @namespace    cloge0.rid.avito
// @version      1.6 Smart Zones
// @description  Automated Reserve Filter by @cloge0. Protected.
// @author       @cloge0
// @copyright    2024, @cloge0. All rights reserved.
// @match        https://www.avito.ru/*
// @exclude      https://www.avito.ru/profile/*
// @exclude      https://www.avito.ru/additem*
// @exclude      https://www.avito.ru/checkout/*
// @connect      avito.ru
// @connect      self
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/561769/RID%20Avito.user.js
// @updateURL https://update.greasyfork.org/scripts/561769/RID%20Avito.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ПРОВЕРКА ЗОНЫ (ЗАЩИТА ЧАТОВ) ---
    // Если мы в профиле или сообщениях - скрипт выключается мгновенно
    if (window.location.href.includes('/profile/') || 
        window.location.href.includes('/messenger') ||
        window.location.href.includes('/additem')) {
        console.log("RID Avito: Messenger/Profile detected. Script stopped.");
        return;
    }

    console.log("%c RID AVITO v1.6 %c Smart Zones ", "background: #000; color: #fff; padding: 5px;", "background: #d32f2f; color: #fff; padding: 5px;");

    // --- НАСТРОЙКИ СКОРОСТИ ---
    const PARALLEL_LIMIT = 3; 
    const DELAY_MIN = 700;    
    const DELAY_MAX = 1200;   
    const QUEUE_LIMIT = 150;  

    // --- ДИЗАЙН ---
    const STYLE_NO_DELIVERY = 'border: 4px solid #d32f2f; box-shadow: 0 0 8px rgba(211, 47, 47, 0.6); border-radius: 4px;';
    const STYLE_SCAN = 'opacity: 0.7; transition: opacity 0.3s;'; 

    // --- ПАНЕЛЬ ---
    const infoPanel = document.createElement('div');
    infoPanel.style.cssText = `
        position: fixed; bottom: 5px; right: 5px; background: rgba(0,0,0,0.85);
        color: #fff; padding: 6px 10px; border-radius: 6px; font-family: monospace;
        font-size: 10px; z-index: 999999; opacity: 0.8; pointer-events: none; user-select: none;
        border: 1px solid #333; text-align: right;
    `;
    document.body.appendChild(infoPanel);

    let queue = [];
    let activeRequests = 0;
    let cache = new Map();
    let stats = { hidden: 0, checked: 0, noDelivery: 0 };
    let isWaiting = false;

    function updateStats() {
        // Если мы случайно перешли в чат без перезагрузки - скрываем панель
        if (window.location.href.includes('/profile/')) {
            infoPanel.style.display = 'none';
            return;
        }
        
        const status = isWaiting ? "⏸️ Pause" : "⚡ Active";
        infoPanel.innerHTML = `
            <span style="color: #4caf50; font-weight: bold;">RID v1.6</span><br>
            State: ${status}<br>
            Act:${activeRequests} | Q:${queue.length}<br>
            <span style="color: #ff5555">Удалено: ${stats.hidden}</span><br>
            <span style="color: #ff8a80">Рамка: ${stats.noDelivery}</span>
        `;
    }

    // --- ЯДРО ПРОВЕРКИ ---
    function checkUrl(task) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: task.url,
                headers: { 
                    "Cache-Control": "max-age=0", 
                    "Upgrade-Insecure-Requests": "1" 
                },
                onload: (res) => {
                    const text = res.responseText;

                    if (res.status === 403 || res.status === 429 || text.includes('firewall') || text.includes('js-captcha')) {
                        console.warn("AVITO RATE LIMIT. Slowing down.");
                        resolve("BLOCK"); 
                        return;
                    }

                    // 1. БЛОКИ
                    const hasSafeDealBlock = text.includes('data-marker="safedeal-item-card"');
                    const hasBuyButton = text.includes('data-marker="delivery-item-button-main"');

                    // 2. ТЕКСТ
                    const hasReservedText = /зарезервиров|заказ оформлен|в пути|заброниров|товар продан/i.test(text) ||
                                            text.includes('item-view/banner/reserved') ||
                                            text.includes('closed-warning');

                    // --- ЛОГИКА ---
                    if (hasReservedText) {
                        hideCard(task);
                    } 
                    else if (hasSafeDealBlock && !hasBuyButton) {
                        hideCard(task);
                    }
                    else if (hasBuyButton) {
                        clearStyles(task);
                        cache.set(task.url, 'good');
                    }
                    else {
                        markCard(task, STYLE_NO_DELIVERY);
                        stats.noDelivery++;
                        cache.set(task.url, 'warn');
                    }

                    stats.checked++;
                    updateStats();
                    resolve("OK");
                },
                onerror: () => resolve("ERR") 
            });
        });
    }

    function hideCard(task) {
        task.card.style.display = 'none';
        stats.hidden++;
        cache.set(task.url, 'bad');
        updateStats();
    }

    function markCard(task, style) {
        task.card.style.cssText += style;
    }

    function clearStyles(task) {
        task.card.style.border = 'none';
        task.card.style.opacity = '1';
        task.card.style.boxShadow = 'none';
        task.card.style.filter = 'none';
    }

    // --- ОЧЕРЕДЬ ---
    function processQueue() {
        // Доп. проверка: если мы перешли в чат - останавливаем очередь
        if (window.location.href.includes('/profile/')) return;

        if (queue.length === 0 || activeRequests >= PARALLEL_LIMIT || isWaiting) return;

        const task = queue.shift();
        activeRequests++;
        updateStats();

        task.card.style.cssText += STYLE_SCAN;

        checkUrl(task).then((result) => {
            activeRequests--;
            
            if (result === "BLOCK") {
                isWaiting = true;
                updateStats();
                setTimeout(() => {
                    isWaiting = false;
                    processQueue();
                }, 30000);
                return;
            }

            const randomDelay = Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1) + DELAY_MIN);
            setTimeout(() => { processQueue(); }, randomDelay);
        });
        
        processQueue();
    }

    // --- СКАНЕР ---
    function findCard(link) {
        let el = link.parentElement;
        let best = link;
        for (let i = 0; i < 9; i++) {
            if (!el || el === document.body) break;
            if (el.getAttribute('data-marker') === 'item') return el;
            if (el.className && typeof el.className === 'string' && el.className.includes('iva-item-root')) return el;
            if (el.offsetHeight > 150 && el.offsetWidth > 100 && el.offsetHeight < 1200) {
                best = el;
            }
            el = el.parentElement;
        }
        return best;
    }

    function scanPage() {
        // Жесткая проверка: Если мы в профиле/чате - СТОП
        if (window.location.href.includes('/profile/') || window.location.href.includes('/messenger')) {
            infoPanel.style.display = 'none';
            return;
        } else {
            infoPanel.style.display = 'block';
        }

        const allLinks = document.querySelectorAll('a');
        const idRegex = /_[0-9]+(\?|$)/;

        allLinks.forEach(link => {
            if (!idRegex.test(link.href)) return;
            if (link.dataset.ridChecked) return;
            if (link.offsetParent === null) return;
            if (queue.length > QUEUE_LIMIT) return;

            const card = findCard(link);
            if (card.dataset.processed) return;

            // Защита от сканирования элементов интерфейса чатов
            if (card.closest('.messenger-layout') || card.closest('[class*="Messenger"]')) return;

            card.dataset.processed = "1";
            link.dataset.ridChecked = "1";

            if (cache.has(link.href)) {
                const s = cache.get(link.href);
                clearStyles({card}); 
                if (s === 'bad') hideCard({card});
                else if (s === 'good') { /* ok */ }
                else markCard({card}, STYLE_NO_DELIVERY);
                return;
            }

            queue.push({ url: link.href, card: card });
        });

        processQueue();
    }

    // --- ЗАПУСК ---
    // Проверка при старте
    if (!window.location.href.includes('/profile/')) {
        scanPage();
        
        const observer = new MutationObserver((mutations) => {
            if (window.location.href.includes('/profile/')) return;
            let added = false;
            for (let m of mutations) {
                if (m.addedNodes.length > 0) { added = true; break; }
            }
            if (added) scanPage();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(scanPage, 1000);
    }

})();