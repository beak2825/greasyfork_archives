// ==UserScript==
// @name         Torn - Elimination Team Status Filter (Online / Idle / Offline / Okay)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds Online / Idle / Offline / Okay filters to the Elimination team page based on icons + status column, without fighting React.
// @author       whiskey_jack helper
// @match        https://www.torn.com/page.php?sid=competition*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558533/Torn%20-%20Elimination%20Team%20Status%20Filter%20%28Online%20%20Idle%20%20Offline%20%20Okay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558533/Torn%20-%20Elimination%20Team%20Status%20Filter%20%28Online%20%20Idle%20%20Offline%20%20Okay%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[ELIM FILTER]';

    console.log(`${LOG_PREFIX} 🚀 Elimination Filter Script Started`);

    // --- Utilities ---------------------------------------------------------

    function waitForElement(selector, timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            const start = performance.now();

            const check = () => {
                const el = document.querySelector(selector);
                if (el) {
                    return resolve(el);
                }
                if (performance.now() - start > timeoutMs) {
                    return reject(new Error(`Timeout waiting for ${selector}`));
                }
                requestAnimationFrame(check);
            };

            check();
        });
    }

    // Collapse / expand helpers so the list doesn't leave visible rows
    // NOTE: we DO NOT remove rows here; React owns this list.
    function collapseRow(row) {
        // fully hide, let React keep the node
        row.style.display = 'none';
        row.style.height = '0px';
        row.style.padding = '0';
        row.style.margin = '0';
        row.style.overflow = 'hidden';
    }

    function expandRow(row) {
        row.style.removeProperty('height');
        row.style.removeProperty('padding');
        row.style.removeProperty('margin');
        row.style.removeProperty('overflow');
        row.style.display = '';
    }

    // Determine the live status (online / idle / offline) from the icon tray
    function getRowStatus(row) {
        try {
            const iconsContainer = row.querySelector('.icons ul#iconTray, .icons ul');
            if (!iconsContainer) return null;

            const lis = iconsContainer.querySelectorAll('li[title]');
            let status = null;

            lis.forEach(li => {
                const title = li.getAttribute('title') || '';
                if (/Online/i.test(title)) {
                    status = 'online';
                } else if (/Idle/i.test(title)) {
                    status = 'idle';
                } else if (/Offline/i.test(title)) {
                    status = 'offline';
                }
            });

            return status;
        } catch (e) {
            console.warn(`${LOG_PREFIX} getRowStatus error`, e);
            return null;
        }
    }

    // Determine if row has status "Okay" in the status column
    function isRowOkay(row) {
        try {
            const statusCell =
                row.querySelector('.dataGridData___dV6BM.status___w4nOU span') ||
                row.querySelector('[class*="status___"] span');

            if (!statusCell) return false;

            const txt = (statusCell.textContent || '').trim().toLowerCase();
            return txt === 'okay';
        } catch (e) {
            console.warn(`${LOG_PREFIX} isRowOkay error`, e);
            return false;
        }
    }

    // Apply filters to all current rows
    function applyFilters() {
        try {
            const gridBody = document.querySelector('.dataGridBody___Y9aVA');
            if (!gridBody) {
                console.warn(`${LOG_PREFIX} ⚠ dataGridBody not found when applying filters`);
                return;
            }

            const okCb      = document.getElementById('show-available-targets'); // repurposed as "Only show Okay targets"
            const onlineCb  = document.getElementById('filter-online');
            const idleCb    = document.getElementById('filter-idle');
            const offlineCb = document.getElementById('filter-offline');

            if (!okCb || !onlineCb || !idleCb || !offlineCb) {
                console.warn(`${LOG_PREFIX} ⚠ Filter checkboxes not found when applying filters`);
                return;
            }

            const filterOkay    = okCb.checked;
            const filterOnline  = onlineCb.checked;
            const filterIdle    = idleCb.checked;
            const filterOffline = offlineCb.checked;

            const anyFilterActive = filterOkay || filterOnline || filterIdle || filterOffline;

            const rows = gridBody.querySelectorAll('.dataGridRow___FAAJF.teamRow___R3ZLF');
            let shown = 0;
            let hidden = 0;

            rows.forEach(row => {
                // If nothing is checked, show everything and restore normal layout
                if (!anyFilterActive) {
                    expandRow(row);
                    shown++;
                    return;
                }

                // 1) "Okay" status filter via status column
                if (filterOkay && !isRowOkay(row)) {
                    collapseRow(row);
                    hidden++;
                    return;
                }

                // 2) Online/Idle/Offline filters via icon tray
                let shouldShowByIcon = true;

                if (filterOnline || filterIdle || filterOffline) {
                    const iconStatus = getRowStatus(row); // 'online'/'idle'/'offline'/null
                    shouldShowByIcon = false;

                    if (iconStatus === 'online'  && filterOnline)  shouldShowByIcon = true;
                    if (iconStatus === 'idle'    && filterIdle)    shouldShowByIcon = true;
                    if (iconStatus === 'offline' && filterOffline) shouldShowByIcon = true;
                }

                if (shouldShowByIcon) {
                    expandRow(row);
                    shown++;
                } else {
                    collapseRow(row);
                    hidden++;
                }
            });

            console.log(`${LOG_PREFIX} Filters applied. Shown: ${shown}, Hidden: ${hidden}, Active:`, {
                okay: filterOkay,
                online: filterOnline,
                idle: filterIdle,
                offline: filterOffline
            });
        } catch (e) {
            console.error(`${LOG_PREFIX} Error applying filters`, e);
        }
    }

    // Attach mutation observer so new rows also get filtered
    function setupRowObserver() {
        const gridBody = document.querySelector('.dataGridBody___Y9aVA');
        if (!gridBody) {
            console.warn(`${LOG_PREFIX} ⚠ Cannot setup row observer, dataGridBody missing`);
            return;
        }

        const virtualContainer = gridBody.querySelector('.virtualContainer___Ft72x') || gridBody;

        const observer = new MutationObserver((mutations) => {
            let rowsChanged = false;
            for (const m of mutations) {
                if ((m.addedNodes && m.addedNodes.length > 0) ||
                    (m.removedNodes && m.removedNodes.length > 0)) {
                    rowsChanged = true;
                    break;
                }
            }
            if (rowsChanged) {
                applyFilters();
            }
        });

        observer.observe(virtualContainer, {
            childList: true,
            subtree: true
        });

        console.log(`${LOG_PREFIX} ✅ Row MutationObserver attached`);
    }

    // Build the Online / Idle / Offline checkboxes and inject them under the "Okay" filter
    function buildStatusFilters(card) {
        if (!card) return;

        if (card.querySelector('#status-filter-wrapper')) {
            console.log(`${LOG_PREFIX} Status filter wrapper already exists, skipping build`);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'status-filter-wrapper';
        wrapper.style.marginTop = '10px';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '4px';
        wrapper.style.alignItems = 'flex-start';

        const makeChoice = (id, labelText) => {
            const cc = document.createElement('div');
            cc.className = 'choice-container';
            cc.style.display = 'flex';
            cc.style.alignItems = 'center';
            cc.style.justifyContent = 'flex-start';
            cc.style.width = '100%';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'checkbox-css';
            input.id = id;
            input.style.marginRight = '4px';

            const label = document.createElement('label');
            label.className = 'marker-css';
            label.htmlFor = id;
            label.textContent = labelText;

            cc.appendChild(input);
            cc.appendChild(label);
            return cc;
        };

        wrapper.appendChild(makeChoice('filter-online', 'Online'));
        wrapper.appendChild(makeChoice('filter-idle', 'Idle'));
        wrapper.appendChild(makeChoice('filter-offline', 'Offline'));

        const firstChoice = card.querySelector('.choice-container');
        if (firstChoice && firstChoice.parentElement === card) {
            firstChoice.insertAdjacentElement('afterend', wrapper);
        } else {
            card.appendChild(wrapper);
        }

        const onlineCb  = wrapper.querySelector('#filter-online');
        const idleCb    = wrapper.querySelector('#filter-idle');
        const offlineCb = wrapper.querySelector('#filter-offline');

        [onlineCb, idleCb, offlineCb].forEach(cb => {
            cb.addEventListener('change', applyFilters);
        });

        console.log(`${LOG_PREFIX} ✅ Online/Idle/Offline filters added`);
    }

    // Main init
    async function init() {
        try {
            const filterCard = await waitForElement('.card___VUoAc.filterContainer___hjP9P');
            console.log(`${LOG_PREFIX} ✅ Found filter card`, filterCard);

            // Let height expand & left-align vertically
            filterCard.style.minHeight = 'auto';
            filterCard.style.height = 'auto';
            filterCard.style.paddingBottom = filterCard.style.paddingBottom || '10px';
            filterCard.style.display = 'flex';
            filterCard.style.flexDirection = 'column';
            filterCard.style.alignItems = 'flex-start';

            // Replace label text:
            // "Only show available targets" → "Only show Okay targets"
            const availableLabel = filterCard.querySelector('label[for="show-available-targets"]');
            if (availableLabel) {
                availableLabel.textContent = 'Only show Okay targets';
            }

            const availableChoice = filterCard.querySelector('.choice-container');
            if (availableChoice) {
                availableChoice.style.display = 'flex';
                availableChoice.style.alignItems = 'center';
                availableChoice.style.justifyContent = 'flex-start';
                availableChoice.style.width = '100%';
            }

            const okCheckbox = filterCard.querySelector('#show-available-targets');
            if (okCheckbox) {
                okCheckbox.addEventListener('change', applyFilters);
            }

            buildStatusFilters(filterCard);
            setupRowObserver();

            // Rebuild if Torn re-renders the card
            const parent = filterCard.parentElement || document.body;
            const cardObserver = new MutationObserver(() => {
                const existingCard = document.querySelector('.card___VUoAc.filterContainer___hjP9P');
                if (existingCard && !existingCard.querySelector('#status-filter-wrapper')) {
                    console.log(`${LOG_PREFIX} ℹ Filter card re-render detected, rebuilding status filters`);

                    existingCard.style.display = 'flex';
                    existingCard.style.flexDirection = 'column';
                    existingCard.style.alignItems = 'flex-start';

                    const label = existingCard.querySelector('label[for="show-available-targets"]');
                    if (label) {
                        label.textContent = 'Only show Okay targets';
                    }

                    const firstChoice = existingCard.querySelector('.choice-container');
                    if (firstChoice) {
                        firstChoice.style.display = 'flex';
                        firstChoice.style.alignItems = 'center';
                        firstChoice.style.justifyContent = 'flex-start';
                        firstChoice.style.width = '100%';
                    }

                    const okCb2 = existingCard.querySelector('#show-available-targets');
                    if (okCb2) {
                        okCb2.addEventListener('change', applyFilters);
                    }

                    buildStatusFilters(existingCard);
                    applyFilters();
                }
            });

            cardObserver.observe(parent, {
                childList: true,
                subtree: true
            });

            applyFilters();

            console.log(`${LOG_PREFIX} 🎯 Init complete`);
        } catch (e) {
            console.error(`${LOG_PREFIX} ❌ Init failed`, e);
        }
    }

    init();

})();
