// ==UserScript==
// @name         Torn Dump Instant Search
// @match        https://www.torn.com/dump.php*
// @grant        none
// @description  Quickly spam searching the dump
// @author       Manuel [3747263]
// @license      MIT
// @version 0.0.1.20251214114927
// @namespace https://greasyfork.org/users/1480021
// @downloadURL https://update.greasyfork.org/scripts/558903/Torn%20Dump%20Instant%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/558903/Torn%20Dump%20Instant%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const RFCV = window.rfcv;

    function instantSearch() {
        fetch(`/dump.php?step=search&rfcv=${RFCV}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(r => r.json()).then(() => {
            // instantly restore UI so you can click again
            unlockSearchUI();
        });
    }

    function unlockSearchUI() {
        // remove animation / glow
        document.querySelectorAll(
            '.timeout_glow, .search-progress-wrap, .searcher'
        ).forEach(e => {
            e.classList.remove('in-progress', 'item-found', 'glow');
            e.style.display = 'none';
        });

        // re-enable SEARCH button
        const searchWrap = document.querySelector('.btn-wrap.search');
        if (searchWrap) {
            searchWrap.style.display = 'block';
            searchWrap.classList.remove('disabled');
        }
    }

    document.addEventListener('click', e => {
        const btn = e.target.closest('a[href*="step=search"]');
        if (!btn) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        instantSearch();
    }, true);
})();
