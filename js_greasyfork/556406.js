// ==UserScript==
// @name         Torn - Hospital Filters (Status / Faction / Remove Disabled Revives)
// @namespace    http://www.torn.com
// @version      1.0
// @description  Hospital Filters (Status / Faction / Remove Disabled Revives)
// @author       JohnNash
// @match        https://www.torn.com/hospitalview.php*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556406/Torn%20-%20Hospital%20Filters%20%28Status%20%20Faction%20%20Remove%20Disabled%20Revives%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556406/Torn%20-%20Hospital%20Filters%20%28Status%20%20Faction%20%20Remove%20Disabled%20Revives%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GM_addStyle = function (s) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = s;
        document.head.appendChild(style);
    };

    GM_addStyle(`
    .hospital-filters {
        padding: 8px 10px;
        margin: 10px 0;
        border-radius: 4px;
        background: rgba(0,0,0,0.2);
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        align-items: center;
        font-size: 12px;
    }

    .hospital-filters__group {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .hospital-filters strong {
        margin-right: 4px;
    }

    .hospital-filters input[type="text"] {
        padding: 2px 4px;
        border-radius: 3px;
        border: 1px solid #555;
        background: #111;
        color: #eee;
        font-size: 11px;
    }

    .filtered-row {
        display: none !important;
    }
    `);

    function getRows() {
        return document.querySelectorAll(
            '.userlist-wrapper.hospital-list-wrapper ul.user-info-list-wrap > li'
        );
    }

    function getStatus(row) {
        const icon = row.querySelector('li.iconShow');
        if (!icon) return null;
        const t = (icon.getAttribute('title') || '').toLowerCase();
        if (t.includes('online')) return 'Online';
        if (t.includes('idle')) return 'Idle';
        if (t.includes('offline')) return 'Offline';
        return null;
    }

    function getFactionTag(row) {
        const img = row.querySelector('.user-wrap.user-faction img');
        if (!img) return '';
        return (img.getAttribute('alt') || '').trim().toLowerCase();
    }

    function hasRevivesDisabled(row) {
        return !!row.querySelector('.reviveNotAvailable');
    }

    function applyFilters() {
        const filtersEl = document.getElementById('hospital-filters');
        if (!filtersEl) return;

        const statusCheckboxes = filtersEl.querySelectorAll(
            'input[type="checkbox"][data-status]'
        );
        const selectedStatuses = Array.from(statusCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.getAttribute('data-status'));

        const factionInput = filtersEl.querySelector('#faction-filter');
        const factionSearch = factionInput
            ? factionInput.value.trim().toLowerCase()
            : '';

        const removeDisabledRevives =
            filtersEl.querySelector('#revives-disabled-checkbox')?.checked;

        const rows = getRows();
        rows.forEach(row => {
            let visible = true;

            const rowStatus = getStatus(row);
            if (selectedStatuses.length > 0 && rowStatus !== null) {
                if (!selectedStatuses.includes(rowStatus)) {
                    visible = false;
                }
            }

            if (visible && factionSearch) {
                const tag = getFactionTag(row);
                if (!tag || !tag.includes(factionSearch)) {
                    visible = false;
                }
            }

            if (visible && removeDisabledRevives) {
                if (hasRevivesDisabled(row)) {
                    visible = false;
                }
            }

            row.classList.toggle('filtered-row', !visible);
        });
    }

    function setupFilters() {
        if (document.getElementById('hospital-filters')) {
            applyFilters();
            return;
        }

        const wrapper = document.querySelector('.userlist-wrapper.hospital-list-wrapper');
        if (!wrapper) return;

        const list = wrapper.querySelector('ul.user-info-list-wrap');
        if (!list) return;

        const filters = document.createElement('div');
        filters.id = 'hospital-filters';
        filters.className = 'hospital-filters';
        filters.innerHTML = `
            <div class="hospital-filters__group">
                <strong>Status:</strong>
                <label><input type="checkbox" data-status="Online" checked> Online</label>
                <label><input type="checkbox" data-status="Idle" checked> Idle</label>
                <label><input type="checkbox" data-status="Offline" checked> Offline</label>
            </div>

            <div class="hospital-filters__group">
                <strong>Faction Tag:</strong>
                <input type="text" id="faction-filter" placeholder="[TAG]" />
            </div>

            <div class="hospital-filters__group">
                <strong>Revives:</strong>
                <label><input type="checkbox" id="revives-disabled-checkbox"> Hide disabled revives</label>
            </div>
        `;

        wrapper.insertBefore(filters, list);

        filters.addEventListener('change', applyFilters);
        filters.addEventListener('keyup', e => {
            if (e.target.id === 'faction-filter') applyFilters();
        });

        applyFilters();
        observeListChanges();
    }

    function observeListChanges() {
        if (window.__hospitalFilterObserver) return;

        const list = document.querySelector(
            '.userlist-wrapper.hospital-list-wrapper ul.user-info-list-wrap'
        );
        if (!list) return;

        const observer = new MutationObserver(() => applyFilters());
        observer.observe(list, { childList: true });
        window.__hospitalFilterObserver = observer;
    }

    const init = setInterval(() => {
        const wrapper = document.querySelector('.userlist-wrapper.hospital-list-wrapper');
        if (wrapper) {
            clearInterval(init);
            setupFilters();
        }
    }, 300);
})();
