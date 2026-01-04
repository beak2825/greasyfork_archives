// ==UserScript==
// @name         Torn Crimes - Recruiting tab with checkbox by OC ID
// @namespace    https://torn.com
// @version      1.4
// @description  Adds a checkbox to each card with data-oc-id in the Recruiting and Planning (Crimes) tabs and stores its state in localStorage.
// @author       JohnNash
// @match        https://www.torn.com/factions.php*step=your*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553308/Torn%20Crimes%20-%20Recruiting%20tab%20with%20checkbox%20by%20OC%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/553308/Torn%20Crimes%20-%20Recruiting%20tab%20with%20checkbox%20by%20OC%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_crimes_oc_checked_map'; // simple map: { [ocId: string]: boolean }
    const STORAGE_KEY_PLAN = 'torn_crimes_oc_checked_map_plan'; // simple map: { [ocId: string]: boolean }

    let active_tab = ''; //check which tab is open

    /** Utils: read/write localStorage **/
    function readMap() {
        try {
            const is_plan = (active_tab === 'planning')
            const raw = localStorage.getItem(is_plan? STORAGE_KEY_PLAN : STORAGE_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            console.warn('[TORN][Crimes OC] Error reading storage:', e);
            return {};
        }
    }

    function writeMap(map) {
        try {
            if(active_tab === 'recruiting'){
                localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
            } else {
                localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(map));
            }
        } catch (e) {
            console.warn('[TORN][Crimes OC] Error writing storage:', e);
        }
    }


    /** Checks if the Recruiting or Planning tab is active **/
    function isRelevantTabActive() {
        const container = document.querySelector('div[class^="buttonsContainer___"]');
        if (!container) return false;

        const activeBtn = container.querySelector('button[class*="active___"]');
        if (!activeBtn) return false;

        const nameSpan = activeBtn.querySelector('span[class^="tabName___"]');
        const tabName = nameSpan ? nameSpan.textContent.trim().toLowerCase() : '';

        active_tab = tabName;

        return tabName === 'recruiting' || tabName === 'planning';
    }

    /** Checks if the Recruiting tab is active **/
    function isRecruitingActive() {
        const container = document.querySelector('div[class^="buttonsContainer___"]');
        if (!container) return false;

        const firstBtn = container.querySelector('button[class^="button___"]');
        if (!firstBtn) return false;

        const hasActiveClass = [...firstBtn.classList].some(c => c.startsWith('active___'));

        const nameSpan = firstBtn.querySelector('span[class^="tabName___"]');
        const isRecruitingText = nameSpan ? /Recruiting/i.test(nameSpan.textContent || '') : true;

        return hasActiveClass && isRecruitingText;
    }

    /** Injects checkbox into every card with data-oc-id **/
    function processCards() {
        if (!isRelevantTabActive()) return;
        const stateMap = readMap();
        const cards = document.querySelectorAll('[data-oc-id]');
        cards.forEach(card => {
            const ocId = card.getAttribute('data-oc-id');
            if (!ocId) return;
            if (card.querySelector('.torn-oc-checkbox')) return;
            const panelBody = card.querySelector('div[class^="panelBody___"]');
            if (!panelBody) return;
            // create checkbox container
            const wrap = document.createElement('div');
            wrap.className = 'torn-oc-checkbox';
            wrap.style.display = 'flex';
            wrap.style.alignItems = 'center';
            wrap.style.gap = '6px';

            const cbId = `torn-oc-${ocId}`;

            const label = document.createElement('label');
            label.setAttribute('for', cbId);
            if(!!stateMap[ocId]){
                if(active_tab === 'recruiting')
                {
                    label.textContent = 'Unavailable';
                } else {
                    label.textContent = 'Planned';
                }
            } else {
                if(active_tab === 'recruiting')
                {
                    label.textContent = 'Available';
                } else {
                    label.textContent = 'Plan';
                }
            }
            label.style.cursor = 'pointer';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = cbId;
            input.checked = !!stateMap[ocId];
            input.addEventListener('change', () => {
                const map = readMap();
                map[ocId] = input.checked;
                writeMap(map);
                if(input.checked){
                    if(active_tab === 'recruiting')
                    {
                        label.textContent = 'Unavailable';
                    } else {
                        label.textContent = 'Planned';
                    }
                } else {
                    if(active_tab === 'recruiting')
                    {
                        label.textContent = 'Available';
                    } else {
                        label.textContent = 'Plan';
                    }
                }
            });

            wrap.appendChild(input);
            wrap.appendChild(label);


            // prepend instead of append
            panelBody.insertBefore(wrap, panelBody.firstChild);
        });
    }

    /** Simple debounce to avoid excessive runs **/
    function debounce(fn, delay) {
        let t;
        return function(...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const run = debounce(() => {
        try {
            processCards();
        } catch (e) {
            console.warn('[TORN][Crimes OC] error in processCards', e);
        }
    }, 150);

    // Observe DOM mutations (Torn is a SPA)
    const observer = new MutationObserver(run);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    run();

    // Optional: console helpers for export/import/clear
    window.TORN_CRIMES_OC = {
        export () {
            return JSON.stringify(readMap());
        },
        import(json) {
            try {
                writeMap(JSON.parse(json));
                run();
            } catch (e) {
                console.error('Invalid JSON');
            }
        },
        clear() {
            writeMap({});
            run();
        }
    };
})();