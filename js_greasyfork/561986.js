// ==UserScript==
// @name         Torn Weapons/Armor/Temporary Loan Inspector Pro
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Responsive Loan Inspector with TXT export (All/Loaned), precision retrieval, and scroll fixes. Fixed for 2026 Layout.
// @author       LOKaa [2834316]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561986/Torn%20WeaponsArmorTemporary%20Loan%20Inspector%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561986/Torn%20WeaponsArmorTemporary%20Loan%20Inspector%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- State Management ---
    const STORAGE_KEY_MINIMIZED = 'TORN_LOAN_PRO_MINIMIZED';
    let isMinimized = localStorage.getItem(STORAGE_KEY_MINIMIZED) === 'true';
    let savedScrollTop = 0; // To fix the scroll jumping issue

    // --- Advanced CSS ---
    GM_addStyle(`
        /* Dashboard Container */
        .lip-dashboard {
            background: #121212;
            border: 1px solid #333;
            border-radius: 8px;
            margin: 15px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: 13px;
            color: #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Header */
        .lip-header {
            background: linear-gradient(to right, #222, #1a1a1a);
            padding: 12px 15px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .lip-title {
            font-weight: 700;
            font-size: 14px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .lip-badge {
            background: #007bff;
            color: #fff;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Controls */
        .lip-controls {
            display: flex;
            gap: 8px;
        }
        .lip-btn {
            background: #333;
            border: 1px solid #444;
            color: #ddd;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
        }
        .lip-btn:hover { background: #444; color: #fff; border-color: #666; }

        .lip-btn-export-loan { color: #ff9800; border-color: #f57c00; background: rgba(255, 152, 0, 0.1); }
        .lip-btn-export-loan:hover { background: #e65100; color: #fff; }

        .lip-btn-export-all { color: #4caf50; border-color: #2e7d32; background: rgba(76, 175, 80, 0.1); }
        .lip-btn-export-all:hover { background: #2e7d32; color: #fff; }

        /* Content Area */
        .lip-content {
            transition: max-height 0.3s ease-out;
            max-height: 600px;
            overflow: hidden;
            background: #181818;
        }
        .lip-content.minimized {
            max-height: 0;
        }

        /* Table Wrapper with Scroll Fixes */
        .lip-table-wrapper {
            overflow-y: auto;
            overflow-x: auto;
            max-height: 400px;
            border-top: 1px solid #222;
            overscroll-behavior: contain; /* Prevents parent page scroll when hitting bottom/top */
        }

        /* Custom Scrollbar */
        .lip-table-wrapper::-webkit-scrollbar { width: 8px; height: 8px; }
        .lip-table-wrapper::-webkit-scrollbar-track { background: #111; }
        .lip-table-wrapper::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        .lip-table-wrapper::-webkit-scrollbar-thumb:hover { background: #555; }

        /* Table */
        .lip-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px; /* Ensures layout stability on small screens */
        }
        .lip-table th {
            position: sticky;
            top: 0;
            background: #252525;
            z-index: 5;
            text-align: left;
            padding: 10px;
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            border-bottom: 2px solid #333;
            box-shadow: 0 2px 2px rgba(0,0,0,0.2); /* Visual separator for sticky header */
        }
        .lip-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #2a2a2a;
            vertical-align: middle;
        }
        .lip-table tr:hover { background: #222; }

        /* Data Styles */
        .lip-item-name { color: #fff; font-weight: 600; }
        .lip-bonus { font-size: 11px; color: #aaa; max-width: 250px; }
        .lip-quality { font-family: 'Consolas', monospace; font-weight: bold; }
        .lip-quality.q-yellow { color: #ffd700; }
        .lip-quality.q-orange { color: #ff9800; }
        .lip-quality.q-red { color: #ff5252; }
        .lip-member a { color: #00c0ff; text-decoration: none; font-weight: bold; }
        .lip-member a:hover { text-decoration: underline; }

        /* Retrieve Button */
        .lip-btn-retrieve {
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid #d32f2f;
            color: #ff5252;
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            width: 100%;
            white-space: nowrap;
        }
        .lip-btn-retrieve:hover { background: #d32f2f; color: #fff; }

        /* Animation */
        @keyframes lip-flash {
            0% { background: rgba(255, 215, 0, 0.3); box-shadow: inset 0 0 0 2px #ffd700; }
            100% { background: transparent; }
        }
        .lip-target-active { animation: lip-flash 2.5s ease-out; }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
            .lip-header { flex-direction: column; align-items: stretch; gap: 10px; }
            .lip-title { justify-content: center; }
            .lip-controls { justify-content: space-between; overflow-x: auto; padding-bottom: 5px; }
            .lip-btn { flex: 1; justify-content: center; }
        }
    `);

    // --- Helpers ---

    // FIX: Updated to detect active tab via aria-hidden attribute instead of fixed IDs
    function getActiveTabType() {
        const activePanel = document.querySelector('#faction-armoury-tabs .ui-tabs-panel[aria-hidden="false"]');
        if (!activePanel) return null;

        if (activePanel.classList.contains('armoury-weapons-wrap')) return 'weapons';
        if (activePanel.classList.contains('armoury-armour-wrap')) return 'armor';
        if (activePanel.classList.contains('armoury-temporary-wrap')) return 'temporary';

        return null;
    }

    function saveMinimizeState(state) {
        isMinimized = state;
        localStorage.setItem(STORAGE_KEY_MINIMIZED, state);
    }

    // --- Data Scrapers ---

    function getQualityFromRow(li) {
        // Quality usually in aria-label of hidden elements or color classes
        // FIX: Check IMG tag specifically for glow classes
        let color = '';
        const imgEl = li.querySelector('.img-wrap img');
        if (imgEl) {
            if (imgEl.classList.contains('glow-yellow')) color = 'q-yellow';
            else if (imgEl.classList.contains('glow-orange')) color = 'q-orange';
            else if (imgEl.classList.contains('glow-red')) color = 'q-red';
        }

        // Check aria-label inside hidden view-info
        let text = '-';
        const qualityLabel = li.querySelector('[aria-label*="Quality"]');
        if (qualityLabel) {
            text = qualityLabel.textContent.trim();
        } else {
            // Fallback map if text missing but color present
            if (color === 'q-yellow') text = 'Yellow';
            else if (color === 'q-orange') text = 'Orange';
            else if (color === 'q-red') text = 'Red';
        }
        return { text, color };
    }

    function getBonusesFromRow(li) {
        const bonuses = [];
        const icons = li.querySelectorAll('ul.bonuses i');
        icons.forEach(icon => {
            const title = icon.getAttribute('title');
            if (title) {
                const match = title.match(/<b>(.*?)<\/b>/);
                if (match) bonuses.push(match[1]);
                else bonuses.push(title.replace(/<[^>]+>/g, '').trim());
            }
        });
        return bonuses.length ? bonuses.join(', ') : '-';
    }

    // --- Main Logic ---

    function scanAndRender() {
        const type = getActiveTabType();
        if (!type) return;

        // FIX: Use the robust selector for the active container
        const container = document.querySelector('#faction-armoury-tabs .ui-tabs-panel[aria-hidden="false"]');
        if (!container) return;

        // Find Injection Point
        const listHeader = container.querySelector('ul.list-title');
        if (!listHeader) return;

        // --- Dashboard Setup ---
        let dash = document.getElementById('lip-dashboard');

        // Save scroll position if dash exists
        const scrollContainer = dash ? dash.querySelector('.lip-table-wrapper') : null;
        if (scrollContainer) {
            savedScrollTop = scrollContainer.scrollTop;
        }

        // Handle tab switching (move dash if needed)
        if (dash && dash.parentNode !== container) {
            dash.remove();
            dash = null;
            savedScrollTop = 0; // Reset scroll on tab switch
        }

        if (!dash) {
            dash = document.createElement('div');
            dash.id = 'lip-dashboard';
            dash.className = 'lip-dashboard';
            container.insertBefore(dash, listHeader);
        }

        // --- Data Extraction ---
        const items = container.querySelectorAll('ul.item-list > li');
        const loanList = [];
        const allDataForExport = [];

        items.forEach((li, idx) => {
            // Basic Info
            const nameEl = li.querySelector('.name');
            const rawName = nameEl ? nameEl.textContent.trim() : 'Unknown';
            const name = rawName.split(' x')[0]; // Clean Quantity

            const imgWrap = li.querySelector('.img-wrap');
            const itemId = imgWrap ? imgWrap.getAttribute('data-itemid') : idx;
            const armoryId = imgWrap ? imgWrap.getAttribute('data-armoryid') : idx;

            // Loan Status
            const loanDiv = li.querySelector('.loaned');
            const loanLink = loanDiv ? loanDiv.querySelector('a') : null;
            const isLoaned = !!loanLink;

            let memberName = 'Available';
            let memberId = '';
            let memberHtml = '-';

            if (isLoaned) {
                memberName = loanLink.textContent.trim();
                memberHtml = loanLink.outerHTML;
                const href = loanLink.getAttribute('href');
                const midMatch = href.match(/XID=(\d+)/);
                if (midMatch) memberId = midMatch[1];
            }

            // Details
            let quality = { text: '-', color: '' };
            let bonus = '-';

            if (type !== 'temporary') {
                quality = getQualityFromRow(li);
                bonus = getBonusesFromRow(li);
            }

            const rowObj = {
                id: itemId,
                aid: armoryId,
                name: name,
                type: type,
                bonus: bonus,
                quality: quality.text,
                qColor: quality.color,
                loaned: isLoaned,
                memberName: memberName,
                memberId: memberId,
                memberHtml: memberHtml
            };

            allDataForExport.push(rowObj);
            if (isLoaned) loanList.push(rowObj);
        });

        // --- Render UI ---
        // Headers
        let thHtml = '';
        if (type === 'temporary') {
            thHtml = `<th style="width:40%">Item</th><th style="width:40%">Loaned To</th><th style="width:20%; text-align:right">Action</th>`;
        } else {
            thHtml = `<th style="width:25%">Item</th><th style="width:25%">Bonus</th><th style="width:15%">Qual</th><th style="width:20%">Loaned To</th><th style="width:15%; text-align:right">Action</th>`;
        }

        // Body
        let bodyHtml = '';
        if (loanList.length === 0) {
            bodyHtml = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #666;">No loaned items found on this page.</td></tr>`;
        } else {
            loanList.forEach(item => {
                const btn = `<button class="lip-btn-retrieve" data-aid="${item.aid}" data-mid="${item.memberId}">Retrieve</button>`;

                if (type === 'temporary') {
                    bodyHtml += `<tr>
                        <td class="lip-item-name">${item.name}</td>
                        <td class="lip-member">${item.memberHtml}</td>
                        <td style="text-align:right">${btn}</td>
                    </tr>`;
                } else {
                    bodyHtml += `<tr>
                        <td class="lip-item-name">${item.name}</td>
                        <td class="lip-bonus">${item.bonus}</td>
                        <td class="lip-quality ${item.qColor}">${item.quality}</td>
                        <td class="lip-member">${item.memberHtml}</td>
                        <td style="text-align:right">${btn}</td>
                    </tr>`;
                }
            });
        }

        dash.innerHTML = `
            <div class="lip-header">
                <div class="lip-title">
                    <span>Loan Inspector</span>
                    <span class="lip-badge">${type.toUpperCase()}</span>
                </div>
                <div class="lip-controls">
                    <button class="lip-btn lip-btn-export-loan" id="lip-export-loan">
                        ⬇ Loaned
                    </button>
                    <button class="lip-btn lip-btn-export-all" id="lip-export-all">
                        ⬇ All
                    </button>
                    <button class="lip-btn" id="lip-toggle">
                        ${isMinimized ? 'Show' : 'Hide'}
                    </button>
                </div>
            </div>
            <div class="lip-content ${isMinimized ? 'minimized' : ''}">
                <div class="lip-table-wrapper" id="lip-scroll-box">
                    <table class="lip-table">
                        <thead><tr>${thHtml}</tr></thead>
                        <tbody>${bodyHtml}</tbody>
                    </table>
                </div>
            </div>
        `;

        // --- Restore Scroll Position ---
        const newScrollBox = dash.querySelector('#lip-scroll-box');
        if (newScrollBox && savedScrollTop > 0) {
            newScrollBox.scrollTop = savedScrollTop;
        }

        // --- Bind Events ---
        document.getElementById('lip-toggle').onclick = (e) => {
            e.preventDefault();
            const content = dash.querySelector('.lip-content');
            isMinimized = !isMinimized;
            saveMinimizeState(isMinimized);
            content.classList.toggle('minimized', isMinimized);
            e.target.textContent = isMinimized ? 'Show' : 'Hide';
        };

        // Export Buttons
        document.getElementById('lip-export-loan').onclick = (e) => {
            e.preventDefault();
            generateTxtExport(loanList, type, 'Loaned');
        };

        document.getElementById('lip-export-all').onclick = (e) => {
            e.preventDefault();
            generateTxtExport(allDataForExport, type, 'All');
        };

        // Retrieval Logic
        const retBtns = dash.querySelectorAll('.lip-btn-retrieve');
        retBtns.forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const aid = this.getAttribute('data-aid');

                // Find Target
                const targetLi = container.querySelector(`.img-wrap[data-armoryid="${aid}"]`)?.closest('li');

                if (targetLi) {
                    targetLi.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Visual Flash
                    targetLi.classList.remove('lip-target-active');
                    void targetLi.offsetWidth; // Trigger reflow
                    targetLi.classList.add('lip-target-active');

                    // Click the native button
                    const retLink = targetLi.querySelector('.retrieve');
                    if (retLink) retLink.click();
                } else {
                    alert('Item row not found. Please refresh the list/page.');
                }
            };
        });
    }

    // --- Export Logic ---
    function generateTxtExport(data, type, suffix) {
        let content = "Item Name\tType\tBonus\tQuality\tStatus\tLoaned To\tMember ID\n";
        data.forEach(row => {
            content += `${row.name}\t${type}\t${row.bonus}\t${row.quality}\t${row.loaned ? 'Loaned' : 'Available'}\t${row.memberName}\t${row.memberId || ''}\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Torn_${type}_${suffix}_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Observer (The Engine) ---
    // Watches for DOM changes (Tab switches, Pagination) to trigger re-scans.
    let debounceTimer = null;
    const observer = new MutationObserver((mutations) => {
        // 1. Ignore changes happening INSIDE our own dashboard
        const isInternalChange = mutations.every(m => {
            return m.target.closest('#lip-dashboard');
        });
        if (isInternalChange) return;

        // 2. Ignore 'data-loaded' attribute changes on images (Torn lazy loading)
        const onlyLazyLoad = mutations.every(m => {
            return m.type === 'attributes' && m.attributeName === 'data-loaded';
        });
        if (onlyLazyLoad) return;

        // 3. Debounce the scan
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            scanAndRender();
        }, 250);
    });

    function init() {
        const target = document.getElementById('faction-armoury-tabs');
        if (target) {
            // Watch children (pagination) and attributes (tab switching)
            observer.observe(target, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['style', 'class', 'aria-expanded', 'aria-hidden']
            });
            setTimeout(scanAndRender, 500); // Initial scan
        } else {
            // Retry if page isn't ready
            setTimeout(init, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();