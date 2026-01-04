// ==UserScript==
// @name         Torn Custom Race Filter (Docks 100 Any Car Free)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show only Docks 100-lap, Any car, 100-driver, $0 races on Torn custom races page
// @author       KingLouisCLXXII [2070312]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/558339/Torn%20Custom%20Race%20Filter%20%28Docks%20100%20Any%20Car%20Free%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558339/Torn%20Custom%20Race%20Filter%20%28Docks%20100%20Any%20Car%20Free%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let filterEnabled = true; // default ON

    function applyFilter() {
        if (!filterEnabled) {
            document.querySelectorAll('.custom-events-wrap .events-list > li')
                .forEach(li => li.style.display = '');
            return;
        }

        const eventsList = document.querySelector('.custom-events-wrap .events-list');
        if (!eventsList) return;

        const items = Array.from(eventsList.children).filter(
            (el) => el.nodeType === 1 && el.tagName === 'LI'
        );

        items.forEach((eventEl) => {
            let keep = true;

            // Password-protected
            const passwordLi = eventEl.querySelector('.event-header li.password.protected');
            if (passwordLi) keep = false;

            // Track + laps
            if (keep) {
                const trackLi = eventEl.querySelector('.event-header li.track');
                if (!trackLi) keep = false;
                else {
                    const nameNode = Array.from(trackLi.childNodes).find(
                        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
                    );
                    const trackName = nameNode ? nameNode.textContent.trim() : '';
                    const lapsText = trackLi.querySelector('.laps')?.textContent.trim() ?? '';

                    if (trackName !== 'Docks') keep = false;
                    if (!lapsText.includes('100 laps')) keep = false;
                }
            }

            // Max drivers = 100
            if (keep) {
                const driversLi = eventEl.querySelector('.acc-body li.drivers');
                if (!driversLi) keep = false;
                else {
                    const txt = driversLi.textContent.replace(/\s+/g, ' ');
                    const match = txt.match(/\/\s*(\d+)/);
                    const maxDrivers = match ? parseInt(match[1], 10) : null;

                    if (maxDrivers !== 100) keep = false;
                }
            }

            // Car = Any car
            if (keep) {
                const carText = eventEl.querySelector('.event-header li.car span.t-hide')
                    ?.textContent.trim();
                if (carText !== 'Any car') keep = false;
            }

            // Fee = $0
            if (keep) {
                const feeLi = eventEl.querySelector('.acc-body li.fee');
                const match = feeLi?.textContent.match(/\$[\d,]+/);
                const numeric = match ? match[0].replace(/[^\d]/g, '') : null;

                if (numeric !== '0') keep = false;
            }

            eventEl.style.display = keep ? '' : 'none';
        });
    }

    // Adds the toggle button directly above .custom-events-wrap
    function insertToggle() {
        const container = document.querySelector('.custom-events-wrap');
        if (!container || document.getElementById('raceFilterToggle')) return;

        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '8px';

        const btn = document.createElement('button');
        btn.id = 'raceFilterToggle';
        btn.textContent = 'Filter: ON';
        btn.style.padding = '6px 12px';
        btn.style.background = '#444';
        btn.style.color = '#fff';
        btn.style.border = '1px solid #222';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';

        btn.addEventListener('click', () => {
            filterEnabled = !filterEnabled;
            btn.textContent = filterEnabled ? 'Filter: ON' : 'Filter: OFF';
            applyFilter();
        });

        wrapper.appendChild(btn);

        // Insert ABOVE the race list container
        container.parentNode.insertBefore(wrapper, container);
    }

    function observeChanges() {
        const obs = new MutationObserver(() => {
            insertToggle();
            applyFilter();
        });

        obs.observe(document.body, { childList: true, subtree: true });
    }

    function onReady(fn) {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    onReady(() => {
        insertToggle();
        applyFilter();
        observeChanges();
    });
})();