// ==UserScript==
// @name         Torn — Export inventory
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Export Torn inventory (Primary, Secondary, Melee, Defensive) with colored quality & bonuses, ignoring equipped items, into a Google Sheet snapshot (bonus name + %)
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/item.php*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557269/Torn%20%E2%80%94%20Export%20inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/557269/Torn%20%E2%80%94%20Export%20inventory.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== CONFIG =====
    const TITLE_BAR_SELECTOR = '.title-black.hospital-dark.top-round.scroll-dark';
    const BUTTON_CONTAINER_CLASS = 'tm-export-inventory-buttons';
    const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxJKzDDJ4R1dhRxhfHjkCfyIzDC7c2pUMGNREqTkFt5LtH5rb7KVrtOQ4CwR0AKcz1jZg/exec';

    const ALLOWED_CATEGORIES = new Set(['Primary', 'Secondary', 'Melee', 'Defensive']);
    const ALLOWED_QUALITIES = new Set(['yellow', 'orange', 'red']);

    let itemsFullyLoaded = false;
    let loadingOverlay;

    // ===== STIL BUTON & OVERLAY =====
    const style = document.createElement('style');
    style.textContent = `
        .tm-export-inventory-btn {
            margin-left: 6px;
            padding: 3px 7px;
            background: #acea00;
            border: 1px solid #222;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
        }
        .tm-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.70);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-size: 32px;
            font-weight: bold;
            color: #fff;
            text-shadow:
                -2px -2px 4px rgba(0,0,0,0.9),
                 2px -2px 4px rgba(0,0,0,0.9),
                -2px  2px 4px rgba(0,0,0,0.9),
                 2px  2px 4px rgba(0,0,0,0.9);
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    function showLoadingOverlay(message) {
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'tm-loading-overlay';
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.textContent = message || 'Please wait…';
        loadingOverlay.style.display = 'flex';
    }

    function hideLoadingOverlay() {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }

    async function loadAllItems() {
        if (itemsFullyLoaded) return;
        showLoadingOverlay('Loading all items…');

        const start = Date.now();
        const MAX_MS = 25000;

        return new Promise(resolve => {
            let lastHeight = 0;
            let sameHeightCount = 0;
            let attempts = 0;
            const maxAttempts = 120;

            function finish() {
                itemsFullyLoaded = true;
                hideLoadingOverlay();
                resolve();
            }

            function scrollStep() {
                attempts++;
                window.scrollTo(0, document.body.scrollHeight);
                const newHeight = document.body.scrollHeight;

                if (newHeight === lastHeight) {
                    sameHeightCount++;
                    if (sameHeightCount > 5 || attempts > maxAttempts || (Date.now() - start) > MAX_MS) {
                        return finish();
                    }
                } else {
                    sameHeightCount = 0;
                    lastHeight = newHeight;
                }
                setTimeout(scrollStep, 300);
            }

            scrollStep();
        });
    }

    function isVisible(el) {
        return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    function getVisibleItemContainers() {
        let containers = Array.from(document.querySelectorAll(
            '.items-cont, .itemsList, ul.items-cont, ul.itemsList'
        )).filter(isVisible);

        if (!containers.length) {
            containers = Array.from(document.querySelectorAll('ul'))
                .filter(u => /-items$/.test(u.id) && isVisible(u));
        }
        return containers;
    }

    function isEquipped(li) {
        const equippedAttr = li.getAttribute('data-equipped');
        if (equippedAttr && equippedAttr.toString().toLowerCase() === 'true') return true;
        if (li.classList.contains('bg-green')) return true;
        return false;
    }

    function htmlDecode(str) {
        return str
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    }

    function extractBonuses(li) {
        const icons = Array.from(li.querySelectorAll('.bonuses-wrap li.bonus i[title]'));
        const labels = [];

        icons.forEach(icon => {
            const titleAttr = icon.getAttribute('title');
            if (!titleAttr) return;

            const decoded = htmlDecode(titleAttr);

            let name = '';
            const nameMatch = decoded.match(/<b>(.*?)<\/b>/i);
            if (nameMatch) {
                name = nameMatch[1].trim();
            } else {
                const firstLine = decoded.split(/<br\s*\/?>/i)[0];
                const clean = firstLine.replace(/<[^>]*>/g, ' ').trim();
                name = clean || decoded.replace(/<[^>]*>/g, ' ').trim();
            }

            const plain = decoded.replace(/<[^>]*>/g, ' ');
            const pctMatch = plain.match(/(\d+(?:\.\d+)?)%/);
            let label = name;
            if (pctMatch) {
                label = pctMatch[1] + '% ' + name;
            }

            if (label && !labels.includes(label)) {
                labels.push(label);
            }
        });

        const badgeElems = Array.from(li.querySelectorAll('.custom-bonus-badge'));
        const badgeTexts = badgeElems.map(b => b.textContent.trim()).filter(Boolean);

        badgeTexts.forEach(text => {
            if (!labels.includes(text)) {
                labels.unshift(text);
            }
        });

        return {
            bonus1: labels[0] || '',
            bonus2: labels[1] || ''
        };
    }

    function normalizeCategory(catRaw, li) {
        if ((!catRaw || !String(catRaw).trim()) && li) {
            const actions = li.querySelector('.actions[type], .actions.right[type]');
            if (actions) {
                catRaw = actions.getAttribute('type');
            }
        }

        if (!catRaw) return '';
        const cat = String(catRaw).trim().toLowerCase();

        if (cat.startsWith('pri')) return 'Primary';
        if (cat.startsWith('sec')) return 'Secondary';
        if (cat.startsWith('mel')) return 'Melee';
        if (cat.startsWith('def')) return 'Defensive';

        return String(catRaw).trim();
    }

    function parseInventoryItem(li, categoryRaw) {
        const category = normalizeCategory(categoryRaw, li);
        const dataset = li.dataset || {};

        const armoryId =
            li.getAttribute('data-armoryid') ||
            li.getAttribute('data-armory-id') ||
            dataset.armoryid ||
            dataset.armoryId ||
            li.getAttribute('data-rowkey') ||
            li.getAttribute('data-item') ||
            '';

        const nameWrapper = li.querySelector('.title .name');
        let name = '';
        if (nameWrapper) {
            const textNode = Array.from(nameWrapper.childNodes)
                .find(n => n.nodeType === Node.TEXT_NODE);
            name = (textNode ? textNode.textContent : nameWrapper.textContent).trim();
        }

        let quality = '';
        const qualityElem = li.querySelector('.title .visually-hidden');
        if (qualityElem) {
            quality = qualityElem.textContent.trim();
        }

        const bonuses = extractBonuses(li);

        let damage = '';
        let accuracy = '';
        let armor = '';

        if (category === 'Defensive') {
            const defIcon = li.querySelector('.bonuses-wrap i.bonus-attachment-item-defence-bonus');
            if (defIcon && defIcon.parentElement) {
                const span = defIcon.parentElement.querySelector('span');
                if (span) armor = span.textContent.trim();
            }
            if (!armor) {
                const armorSpan = li.querySelector('.bonuses-wrap li span');
                if (armorSpan) armor = armorSpan.textContent.trim();
            }
        } else {
            const dmgIcon = li.querySelector('.bonuses-wrap i.bonus-attachment-item-damage-bonus');
            if (dmgIcon && dmgIcon.parentElement) {
                const span = dmgIcon.parentElement.querySelector('span');
                if (span) damage = span.textContent.trim();
            }

            const accIcon = li.querySelector('.bonuses-wrap i.bonus-attachment-item-accuracy-bonus');
            if (accIcon && accIcon.parentElement) {
                const span = accIcon.parentElement.querySelector('span');
                if (span) accuracy = span.textContent.trim();
            }
        }

        return {
            armoryId: armoryId,
            category: category,
            name: name,
            damage: damage,
            accuracy: accuracy,
            armor: armor,
            quality: quality,
            bonus1: bonuses.bonus1,
            bonus2: bonuses.bonus2
        };
    }

    function collectAllTrackedItems() {
        const result = [];
        const containers = getVisibleItemContainers();

        containers.forEach(container => {
            const lis = Array.from(container.querySelectorAll('li')).filter(isVisible);

            lis.forEach(li => {
                if (isEquipped(li)) return;

                let catAttr =
                    li.getAttribute('data-category') ||
                    (li.dataset ? li.dataset.category : '') ||
                    '';

                const category = normalizeCategory(catAttr, li);
                if (!ALLOWED_CATEGORIES.has(category)) return;

                const item = parseInventoryItem(li, category);
                if (!item || !item.armoryId || !item.name) return;

                const q = (item.quality || '').toLowerCase();
                if (!ALLOWED_QUALITIES.has(q)) return;

                if (!item.bonus1 && !item.bonus2) return;

                result.push(item);
            });
        });

        return result;
    }

    function sendToSheet(items) {
        if (!WEBAPP_URL || WEBAPP_URL === 'YOUR_WEBAPP_URL_HERE') {
            alert('NO WEBAPP_URL SET!');
            return Promise.resolve();
        }

        showLoadingOverlay('Sending items to Google Sheet…');

        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: WEBAPP_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    items: items,
                    exportedAt: new Date().toISOString()
                }),
                onload: function (response) {
                    hideLoadingOverlay();

                    if (response.status < 200 || response.status >= 300) {
                        const msg = 'Request failed: HTTP ' + response.status;
                        alert(msg);
                        reject(new Error(msg));
                        return;
                    }

                    let data = null;
                    try {
                        data = JSON.parse(response.responseText);
                    } catch (e) {
                        // ignore
                    }

                    let msg;
                    if (data && data.status) {
                        msg = 'Exported ' + (data.rows || items.length) +
                              ' items (status: ' + data.status + ').';
                    } else {
                        msg = 'Exported ' + items.length + ' items to sheet.';
                    }

                    alert(msg);
                    resolve();
                },
                onerror: function (err) {
                    hideLoadingOverlay();
                    console.error('GM_xmlhttpRequest error', err);
                    alert('Error while sending items: ' + err);
                    reject(err);
                }
            });
        });
    }

    async function onFetchItemsClick() {
        await loadAllItems();

        const items = collectAllTrackedItems();
        if (!items.length) {
            alert('No items (Primary / Secondary / Melee / Defensive) found with quality or bonuses.');
            return;
        }

        await sendToSheet(items);
    }

    function addExportButtonOnce() {
        const titleBar = document.querySelector(TITLE_BAR_SELECTOR);
        if (!titleBar) return;
        if (titleBar.querySelector('.' + BUTTON_CONTAINER_CLASS)) return;

        const container = document.createElement('div');
        container.className = BUTTON_CONTAINER_CLASS;
        container.style.display = 'inline-block';
        container.style.marginLeft = '8px';

        const btn = document.createElement('button');
        btn.className = 'tm-export-inventory-btn';
        btn.textContent = 'Fetch Items';
        btn.addEventListener('click', onFetchItemsClick);

        container.appendChild(btn);
        titleBar.appendChild(container);
    }

    const main = document.querySelector('#mainContainer') || document.documentElement;
    const buttonsObserver = new MutationObserver(() => {
        addExportButtonOnce();
    });
    buttonsObserver.observe(main, { childList: true, subtree: true });

    addExportButtonOnce();
})();
