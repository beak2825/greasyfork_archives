// ==UserScript==
// @name         Elimination Hitters Highligher
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Highlights green any player who is ONLINE and has 30+ attacks
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=competition*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558776/Elimination%20Hitters%20Highligher.user.js
// @updateURL https://update.greasyfork.org/scripts/558776/Elimination%20Hitters%20Highligher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const attacksmin = 30;
    const color = 'green';

    let observer = null;

    const TABLE_WRAPPER = '.dataGrid___cmuUc.tableWrapper___GQU3t';

    function highlightAllVisibleRows() {
        document.querySelectorAll('.dataGridRow___FAAJF').forEach(row => {
            row.style.removeProperty('background-color');

            const onlineIcon = row.querySelector('li[id^="icon1_"]');
            if (!onlineIcon) return;

            const attacksCell = row.querySelector('.attacks___IJtzw span, .attacks___WfTnp span');
            if (!attacksCell) return;

            const attacks = parseInt(attacksCell.textContent.replace(/\D/g, ''), 10);
            if (isNaN(attacks) || attacks < attacksmin) return;

            row.style.backgroundColor = color;
            row.style.transition = `background-color: ${color} !important;`;
        });
    }

    function attachToTable(table) {
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            clearTimeout(window._tornCompHL);
            window._tornCompHL = setTimeout(highlightAllVisibleRows, 80);
        });

        observer.observe(table, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'transform']
        });

        setTimeout(highlightAllVisibleRows, 100);

        console.log('[Torn Comp Highlight] Observer attached');
    }

    function startWatching() {
        setInterval(() => {
            const table = document.querySelector(TABLE_WRAPPER);

            if (table && table !== observer?.takeRecords) {
                attachToTable(table);
            } else if (!table && observer) {
                observer.disconnect();
                observer = null;
            }
        }, 700);
    }

    startWatching();

    window.addEventListener('popstate', () => setTimeout(startWatching, 500));
    window.addEventListener('hashchange', () => setTimeout(startWatching, 500));

    if (document.readyState !== 'loading') {
        setTimeout(startWatching, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(startWatching, 1000));
    }

})();