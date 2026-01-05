// ==UserScript==
// @name         Amazon Orders Dashboard v28
// @namespace    solomon.amazon.orders
// @version      28
// @description  Delivery tracking panels with date parsing, return deadlines, hover highlighting, draggable UI, right-rail removal. Optimized & cleaner.
// @match        https://www.amazon.com/*order*
// @match        https://smile.amazon.com/*order*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/555222/Amazon%20Orders%20Dashboard%20v28.user.js
// @updateURL https://update.greasyfork.org/scripts/555222/Amazon%20Orders%20Dashboard%20v28.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    const PANEL_IDS = {
        TODAY: 'aod-today',
        YESTERDAY: 'aod-yesterday',
        ARRIVING: 'aod-arriving',
        TOMORROW: 'aod-tomorrow',
        RETURNS: 'aod-returns'
    };

    const PATTERNS = {
        deliveredToday: /delivered\s+today/i,
        deliveredYesterday: /delivered\s+yesterday/i,
        deliveredDate: /delivered\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
        arrivingToday: /arriving\s+today/i,
        arrivingTomorrow: /arriving\s+tomorrow/i,
        openReturn: /return (started|requested|initiated)|label created|drop(?:ped)? off|in transit|processing|awaiting/i,
        refunded: /refund(ed| issued| complete)/i,
        returnDeadline: /return (?:by|window closes on)\s+([A-Za-z]{3,9}\.?\s+\d{1,2})/i
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* Hide right rail */
        .right-rail, .js-yo-right-rail, .bia-content,
        [class*="column--right"], [cel_widget_id*="rightrails"],
        [data-card-metrics-id*="p13n"], [cel_widget_id*="upsell"] {
            display: none !important;
        }

        /* Expand left column */
        [class*="column--left"] {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 100% !important;
        }

        /* Panel base */
        .aod-panel {
            position: absolute;
            width: 300px;
            background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
            border: 2px solid #3b82f6;
            border-radius: 14px;
            box-shadow: 0 10px 30px rgba(59,130,246,0.15);
            padding: 14px;
            z-index: 1000;
            max-height: 75vh;
            overflow: auto;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .aod-panel:hover { z-index: 2147480000; box-shadow: 0 14px 40px rgba(59,130,246,0.25); }

        /* Panel headers */
        .aod-panel h3 {
            margin: 0 0 10px;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            padding: 8px 10px;
            border-radius: 8px;
            cursor: move;
            user-select: none;
        }

        /* Panel colors */
        #${PANEL_IDS.TODAY} { background: linear-gradient(135deg, #fffbeb, #fef3c7); border-color: #f59e0b; }
        #${PANEL_IDS.TODAY} h3 { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; border: 1px solid #fbbf24; }

        #${PANEL_IDS.YESTERDAY} h3 { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; border: 1px solid #93c5fd; }

        #${PANEL_IDS.ARRIVING} { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-color: #10b981; }
        #${PANEL_IDS.ARRIVING} h3 { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; border: 1px solid #6ee7b7; }

        #${PANEL_IDS.TOMORROW} { background: linear-gradient(135deg, #faf5ff, #f3e8ff); border-color: #a855f7; }
        #${PANEL_IDS.TOMORROW} h3 { background: linear-gradient(135deg, #f3e8ff, #e9d5ff); color: #6b21a8; border: 1px solid #c084fc; }

        #${PANEL_IDS.RETURNS} h3 { background: linear-gradient(135deg, #ccfbf1, #99f6e4); color: #0f766e; border: 1px solid #5eead4; }

        /* List items */
        .aod-list { list-style: none; margin: 0; padding: 0; }
        .aod-item { margin: 6px 0; display: flex; align-items: center; gap: 8px; }
        .aod-link {
            display: flex; gap: 8px; align-items: center;
            text-decoration: none; color: #0f172a; font-weight: 600; flex: 1;
        }
        .aod-link:hover { text-decoration: underline; }
        .aod-img {
            width: 50px; height: 50px; object-fit: contain;
            border: 1px solid #e5e7eb; border-radius: 8px; background: #fff;
        }
        .aod-count { font-weight: 800; color: #dc2626; margin-left: 4px; font-size: 15px; }

        /* Minimized state */
        .aod-min {
            padding: 8px 14px !important;
            border-radius: 999px !important;
            max-height: none !important;
        }
        .aod-min h3 { border: none !important; padding: 0 !important; margin: 0 !important; background: transparent !important; }
        .aod-min .aod-list, .aod-min .aod-img, .aod-min .aod-pill { display: none !important; }

        /* Pills */
        .aod-pill {
            margin-left: auto; font-size: 11px; padding: 3px 7px;
            border-radius: 999px; background: #fefce8; color: #7a5e00; border: 1px solid #fde68a;
        }
        .aod-pill-soon { background: #fff7ed; color: #7a3412; border-color: #fdba74; }
        .aod-pill-urgent { background: #fee2e2; color: #7f1d1d; border-color: #fca5a5; font-weight: 700; }

        /* Highlighting */
        .aod-hi {
            outline: 3px solid #60a5fa !important;
            outline-offset: 2px;
            border-radius: 8px;
            scroll-margin-top: 100px;
        }

        /* Return flag */
        .aod-return {
            position: relative;
            border-radius: 10px;
            outline: 1px solid rgba(14,165,164,0.25);
            box-shadow: inset 0 0 0 9999px rgba(45,212,191,0.06);
        }
        .aod-return::before {
            content: "";
            position: absolute;
            left: -2px; top: 8px; bottom: 8px;
            width: 4px; border-radius: 4px;
            background: linear-gradient(180deg, #5eead4, #22d3ee);
        }

        /* Address alert */
        .aod-addr-alert {
            background: linear-gradient(135deg, rgba(254,240,138,0.25), rgba(253,224,71,0.15)) !important;
            outline: 2px solid rgba(202,138,4,0.4) !important;
            border-radius: 8px;
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            .aod-panel { background: linear-gradient(135deg, #0f172a, #1e293b); color: #e5e7eb; }
            .aod-link { color: #e5e7eb; }
            .aod-img { background: #0b0f14; border-color: #1f2937; }
        }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const text = el => el?.textContent?.trim() || '';
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    const extractASIN = url => {
        const m = url?.match(/\/(dp|product)\/([A-Z0-9]{6,})/i);
        return m ? m[2].toUpperCase() : null;
    };

    const dedupeByASIN = items => {
        const map = new Map();
        for (const item of items) {
            const key = extractASIN(item.link) || item.link;
            if (!map.has(key)) map.set(key, item);
        }
        return [...map.values()];
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 DATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

    function isDateYesterday(monthName, day) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const monthNum = MONTHS.indexOf(monthName.toLowerCase());
        if (monthNum === -1) return false;

        return monthNum === yesterday.getMonth() && parseInt(day) === yesterday.getDate();
    }

    function parseReturnDeadline(statusText) {
        const match = statusText?.match(PATTERNS.returnDeadline);
        if (!match) return '';

        const now = new Date();
        let deadline = new Date(`${match[1]} ${now.getFullYear()}`);
        if (isNaN(deadline)) return '';

        if (deadline - now < -45 * 86400000) {
            deadline = new Date(`${match[1]} ${now.getFullYear() + 1}`);
        }

        const days = Math.ceil((deadline - now) / 86400000);
        if (days < 0) return '';

        const label = deadline.toDateString().split(' ').slice(0, 3).join(' ');
        return `Return by ${label} (${days}d)`;
    }

    function getPillClass(dueText) {
        const m = dueText?.match(/\((\d+)d\)/);
        if (!m) return '';
        const days = parseInt(m[1]);
        if (days <= 2) return 'aod-pill-urgent';
        if (days <= 7) return 'aod-pill-soon';
        return '';
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 ORDER SCANNER
    // ═══════════════════════════════════════════════════════════════════════════

    function getStatus(box) {
        const selectors = [
            '.yohtmlc-shipment-status-primaryText',
            '.delivery-box__primary-text',
            '.yohtmlc-order-status',
            '.a-size-medium',
            '.a-color-success',
            '.a-color-secondary'
        ];
        for (const sel of selectors) {
            const el = $(sel, box);
            if (el) {
                const t = text(el);
                if (t) return t;
            }
        }
        return text(box).slice(0, 500);
    }

    function getProductInfo(box) {
        const titleEl = $('a[href*="/dp/"], a[href*="/product/"]', box);
        const imgEl = $('img[src*="images"]', box);
        if (!titleEl) return null;
        return {
            title: text(titleEl).replace(/\s+/g, ' '),
            link: titleEl.href,
            image: imgEl?.getAttribute('data-a-hires') || imgEl?.src
        };
    }

    function scanOrders() {
        const boxes = $$('.a-box-group, [data-order-id]').slice(0, 300);
        const result = { today: [], yesterday: [], arriving: [], tomorrow: [], returns: [] };

        for (const box of boxes) {
            const status = getStatus(box);
            const info = getProductInfo(box);
            if (!info) continue;

            // Check return first
            if (PATTERNS.openReturn.test(status) && !PATTERNS.refunded.test(status)) {
                info.due = parseReturnDeadline(status);
                result.returns.push(info);
                box.classList.add('aod-return');
                continue;
            }

            // Check delivery status
            if (PATTERNS.deliveredToday.test(status)) {
                result.today.push(info);
            } else if (PATTERNS.deliveredYesterday.test(status)) {
                result.yesterday.push(info);
            } else if (PATTERNS.deliveredDate.test(status)) {
                const [, month, day] = status.match(PATTERNS.deliveredDate);
                if (isDateYesterday(month, day)) result.yesterday.push(info);
            } else if (PATTERNS.arrivingToday.test(status)) {
                result.arriving.push(info);
            } else if (PATTERNS.arrivingTomorrow.test(status)) {
                result.tomorrow.push(info);
            }
        }

        // Dedupe all
        for (const key of Object.keys(result)) {
            result[key] = dedupeByASIN(result[key]);
        }

        // Check addresses
        $$('.displayAddressDiv, .ship-address').forEach(addr => {
            if (!text(addr).toLowerCase().includes('israel')) {
                addr.closest('.a-box-group')?.classList.add('aod-addr-alert');
            }
        });

        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎛️ PANEL MANAGER
    // ═══════════════════════════════════════════════════════════════════════════

    function createPanel(id, header, items, parent) {
        if (!items.length) return null;

        const panel = document.createElement('div');
        panel.id = id;
        panel.className = 'aod-panel';
        panel.innerHTML = `
            <h3>${header} <span class="aod-count">(${items.length})</span></h3>
            <ul class="aod-list">${items.map(item => `
                <li class="aod-item">
                    ${item.image ? `<img class="aod-img" src="${item.image}" alt="">` : ''}
                    <a class="aod-link" href="${item.link}" data-asin="${extractASIN(item.link) || ''}" title="${item.title}">
                        ${item.title.length > 60 ? item.title.slice(0, 60) + '…' : item.title}
                    </a>
                    ${item.due ? `<span class="aod-pill ${getPillClass(item.due)}">${item.due}</span>` : ''}
                </li>
            `).join('')}</ul>
        `;

        parent.appendChild(panel);

        // Restore minimized state
        if (GM_getValue(`min_${id}`, false)) {
            panel.classList.add('aod-min');
        }

        // Setup dragging
        setupDrag(panel, parent);

        // Double-click to minimize
        panel.querySelector('h3').addEventListener('dblclick', () => {
            panel.classList.toggle('aod-min');
            GM_setValue(`min_${id}`, panel.classList.contains('aod-min'));
        });

        return panel;
    }

    function setupDrag(panel, parent) {
        const handle = panel.querySelector('h3');
        let dragging = false, startX, startY, initLeft, initTop;

        handle.addEventListener('mousedown', e => {
            dragging = true;
            document.body.style.userSelect = 'none';
            const pRect = parent.getBoundingClientRect();
            const panelRect = panel.getBoundingClientRect();
            initLeft = panelRect.left - pRect.left;
            initTop = panelRect.top - pRect.top;
            startX = e.pageX;
            startY = e.pageY;
        });

        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const newLeft = clamp(initLeft + e.pageX - startX, 0, parent.clientWidth - panel.offsetWidth - 10);
            const newTop = clamp(initTop + e.pageY - startY, 10, parent.scrollHeight - panel.offsetHeight - 10);
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            document.body.style.userSelect = '';
            GM_setValue(`pos_${panel.id}`, { left: parseInt(panel.style.left), top: parseInt(panel.style.top) });
        });
    }

    function positionPanels(panels, parent) {
        let currentTop = 150;
        for (const panel of panels) {
            const saved = GM_getValue(`pos_${panel.id}`);
            if (saved) {
                panel.style.left = saved.left + 'px';
                panel.style.top = saved.top + 'px';
            } else {
                panel.style.left = '12px';
                panel.style.top = currentTop + 'px';
            }
            currentTop += panel.offsetHeight + 20;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 HOVER HIGHLIGHT
    // ═══════════════════════════════════════════════════════════════════════════

    function setupHoverHighlight() {
        let lastHighlight = null;

        document.addEventListener('mouseenter', e => {
            const link = e.target.closest('.aod-link');
            if (!link) return;

            if (lastHighlight) lastHighlight.classList.remove('aod-hi');

            const asin = link.dataset.asin;
            if (!asin) return;

            const orderBox = $(`a[href*="/dp/${asin}"]`)?.closest('.a-box-group');
            if (orderBox) {
                orderBox.classList.add('aod-hi');
                lastHighlight = orderBox;
            }
        }, true);

        document.addEventListener('mouseleave', e => {
            if (e.target.closest('.aod-link') && lastHighlight) {
                lastHighlight.classList.remove('aod-hi');
                lastHighlight = null;
            }
        }, true);

        document.addEventListener('click', e => {
            const link = e.target.closest('.aod-link');
            if (!link || e.ctrlKey || e.metaKey) return;

            const asin = link.dataset.asin;
            if (!asin) return;

            const orderBox = $(`a[href*="/dp/${asin}"]`)?.closest('.a-box-group');
            if (orderBox) {
                e.preventDefault();
                orderBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                orderBox.classList.add('aod-hi');
                setTimeout(() => orderBox.classList.remove('aod-hi'), 1500);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧹 CLEANUP
    // ═══════════════════════════════════════════════════════════════════════════

    function removeClutter() {
        $$('.right-rail, .js-yo-right-rail, .bia-content, [class*="column--right"]').forEach(el => el.remove());
        $$('h3').forEach(h => {
            if (text(h) === 'Buy it again') h.closest('.a-box')?.remove();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    function init() {
        console.log('[Amazon Orders v28] 🚀 Initializing...');

        removeClutter();

        const parent = $('#a-page') || $('#ordersContainer') || document.body;
        parent.style.position = parent.style.position || 'relative';

        const data = scanOrders();
        const panels = [];

        const todayPanel = createPanel(PANEL_IDS.TODAY, '📦 Delivered Today', data.today, parent);
        const yesterdayPanel = createPanel(PANEL_IDS.YESTERDAY, '📅 Delivered Yesterday', data.yesterday, parent);
        const arrivingPanel = createPanel(PANEL_IDS.ARRIVING, '📬 Arriving Today', data.arriving, parent);
        const tomorrowPanel = createPanel(PANEL_IDS.TOMORROW, '🚚 Arriving Tomorrow', data.tomorrow, parent);
        const returnsPanel = createPanel(PANEL_IDS.RETURNS, '🔁 Returns', data.returns, parent);

        [todayPanel, yesterdayPanel, arrivingPanel, tomorrowPanel, returnsPanel].forEach(p => p && panels.push(p));

        positionPanels(panels, parent);
        setupHoverHighlight();

        // Update title if returns exist
        if (data.returns.length) {
            document.title = `🔁 ${document.title.replace(/^🔁\s*/, '')}`;
        }

        // Observe for new content
        const observer = new MutationObserver(removeClutter);
        observer.observe(document.body, { childList: true, subtree: true });

        console.log('[Amazon Orders v28] ✅ Ready!', data);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();