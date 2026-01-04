// ==UserScript==
// @name         Moxfield Tag Highlighter
// @namespace    https://moxfield.com/
// @version      3.5.1
// @description  Highlights cards in the Moxfield deck builder that have multiple shared tags, showing which cards in your deck have the most synergy.
// @match        https://moxfield.com/*
// @match        https://www.moxfield.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561279/Moxfield%20Tag%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/561279/Moxfield%20Tag%20Highlighter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const ROOT_SELECTOR = 'section.deckview';
    const ROW_SELECTOR = 'li[data-hash]';
    const ATTR_ID = 'data-hash';
    const MIN_COUNT = 2;

    const COLORS = {
        2: 'rgba(59, 130, 246, 0.4)',
        3: 'rgba(168, 85, 247, 0.5)',
        4: 'rgba(6, 182, 212, 0.6)'
    };

    let isProcessing = false;

    const isDeckPage = () => {
        const path = window.location.pathname;
        return path.startsWith('/decks/') &&
              !path.startsWith('/decks/public') &&
              !path.startsWith('/decks/personal');
    };

    const isGroupedByTags = () => {
        const groupSelect = document.getElementById('groupBy');
        return groupSelect && groupSelect.value === 'tag';
    };

    function shouldShow() {
        return isDeckPage() && isGroupedByTags();
    }

    function updateVisibility() {
        let container = document.getElementById('mh-legend');

        if (shouldShow() && !container) {
            injectLegend();
            container = document.getElementById('mh-legend');
        }

        if (!container) return;

        const active = shouldShow();
        container.style.display = active ? 'flex' : 'none';

        if (active) {
            highlightRows();
        } else {
            clearHighlights();
        }
    }

    function clearHighlights() {
        const root = document.querySelector(ROOT_SELECTOR);
        if (!root) return;
        root.querySelectorAll(ROW_SELECTOR).forEach(row => {
            const target = row.querySelector('.w-100') || row;
            target.style.backgroundColor = '';
            target.style.paddingLeft = '';
            target.style.borderRadius = '';
        });
    }

    function injectLegend() {
        if (document.getElementById('mh-legend')) return;

        const isEnabled = localStorage.getItem('mh-highlighter-enabled') !== 'false';

        const container = document.createElement('div');
        container.id = 'mh-legend';
        container.style.cssText = `
            position: fixed; bottom: 112px; right: 30px;
            font-family: sans-serif; font-size: 11px; color: #eee;
            z-index: 9999; display: flex; flex-direction: column-reverse;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
            width: 143.5px;
        `;

        const headerPill = document.createElement('div');
        headerPill.style.cssText = `
            background: #444; display: flex; align-items: center;
            border-radius: 30px; border: 1px solid #555; overflow: hidden;
            height: 35px; width: 100%;
        `;

        const toggleZone = document.createElement('div');
        toggleZone.style.cssText = `
            padding: 0 12px; height: 100%; display: flex; align-items: center;
            cursor: pointer; border-right: 1px solid #555; transition: background 0.2s;
            background: ${isEnabled ? 'transparent' : '#333'};
        `;

        const burstIcon = document.createElement('div');
        burstIcon.style.cssText = `
            display: flex; flex-direction: column; gap: 2px;
            width: 16px; transition: filter 0.3s;
            filter: ${isEnabled ? 'saturate(1)' : 'grayscale(1) opacity(0.5)'};
        `;

        [ {w:'100%', c:COLORS[4]}, {w:'70%', c:COLORS[3]}, {w:'85%', c:COLORS[2]} ].forEach(row => {
            const r = document.createElement('div');
            r.style.cssText = `width: ${row.w}; height: 2.5px; background: ${row.c}; border-radius: 1px;`;
            burstIcon.appendChild(r);
        });

        const legendZone = document.createElement('div');
        legendZone.style.cssText = `
            flex-grow: 1; height: 100%; display: flex; align-items: center;
            justify-content: center; cursor: pointer; user-select: none;
            font-weight: bold; color: #fff; padding-right: 8px;
        `;

        const title = document.createElement('span');
        title.innerText = 'Tag Legend';
        const toggleIcon = document.createElement('span');
        toggleIcon.style.cssText = 'margin-left: 6px; font-size: 12px; width: 10px; text-align: center;';
        toggleIcon.innerText = '+';

        toggleZone.appendChild(burstIcon);
        legendZone.appendChild(title);
        legendZone.appendChild(toggleIcon);
        headerPill.appendChild(toggleZone);
        headerPill.appendChild(legendZone);

        const content = document.createElement('div');
        content.id = 'mh-legend-content';
        content.style.cssText = `
            padding: 12px 14px; background: #2a2a2a; border: 1px solid #444;
            border-radius: 12px; margin-bottom: 5px; display: none; width: 100%;
        `;

        const createItem = (color, text) => {
            const item = document.createElement('div');
            item.style.cssText = 'display:flex; align-items:center; margin-bottom:6px;';
            item.innerHTML = `<div style="width:12px; height:12px; background:${color}; border:1px solid rgba(255,255,255,0.2); margin-right:10px; border-radius:2px;"></div> ${text}`;
            return item;
        };

        [2, 3, 4].forEach(n => content.appendChild(createItem(COLORS[n], `${n}${n===4?'+':''} Tags`)));

        container.appendChild(headerPill);
        container.appendChild(content);

        toggleZone.addEventListener('click', (e) => {
            e.stopPropagation();
            const newState = !(localStorage.getItem('mh-highlighter-enabled') !== 'false');
            localStorage.setItem('mh-highlighter-enabled', newState);
            burstIcon.style.filter = newState ? 'saturate(1)' : 'grayscale(1) opacity(0.5)';
            toggleZone.style.background = newState ? 'transparent' : '#333';
            updateVisibility();
        });

        legendZone.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleIcon.innerText = isHidden ? '−' : '+';
        });

        document.body.appendChild(container);
    }

    function highlightRows() {
        if (isProcessing || !shouldShow()) return;
        isProcessing = true;
        const isEnabled = localStorage.getItem('mh-highlighter-enabled') !== 'false';
        const root = document.querySelector(ROOT_SELECTOR);
        if (!root) { isProcessing = false; return; }

        const allRows = Array.from(root.querySelectorAll(ROW_SELECTOR));
        const counts = {};
        allRows.forEach(row => {
            const hash = row.getAttribute(ATTR_ID);
            if (hash) counts[hash] = (counts[hash] || 0) + 1;
        });

        allRows.forEach(row => {
            const hash = row.getAttribute(ATTR_ID);
            const count = counts[hash] || 0;
            const target = row.querySelector('.w-100') || row;

            if (isEnabled && count >= MIN_COUNT) {
                target.style.setProperty('background-color', COLORS[Math.min(count, 4)], 'important');
                target.style.setProperty('padding-left', '4px', 'important');
                target.style.setProperty('border-radius', '7px');
            } else {
                target.style.backgroundColor = '';
                target.style.paddingLeft = '';
                target.style.borderRadius = '';
            }
        });
        setTimeout(() => { isProcessing = false; }, 300);
    }

    // --- Listeners ---
    document.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'groupBy') updateVisibility();
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.modal-footer .btn-primary')) setTimeout(highlightRows, 500);
    });

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 't') setTimeout(highlightRows, 800);
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            updateVisibility();
        }
    }).observe(document, { subtree: true, childList: true });

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) updateVisibility();
    });

    const init = () => {
        injectLegend();
        updateVisibility();
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Ensure the script waits for the page to be ready but fires reliably
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();