// ==UserScript==
// @name         WST Live URL Button
// @namespace    https://wst.tv/
// @license      MIT
// @author       JV
// @version      1.0
// @description  Přidá LIVE tlačítko do API k zápasům na wst.tv
// @match        https://www.wst.tv/matches*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559352/WST%20Live%20URL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559352/WST%20Live%20URL%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LIVE_BASE = 'https://matches.snooker.web.gc.wstservices.co.uk/v2/';

    function addLiveButtons() {
        const matchLinks = document.querySelectorAll('a[href^="/match-centre/"]');

        matchLinks.forEach(link => {
            // už má LIVE tlačítko → skip
            if (link.dataset.liveAdded) return;

            const matchId = link.getAttribute('href').split('/match-centre/')[1];
            if (!matchId) return;

            const liveUrl = LIVE_BASE + matchId;

            const liveBtn = document.createElement('a');
            liveBtn.href = liveUrl;
            liveBtn.target = '_blank';
            liveBtn.textContent = 'API';
            liveBtn.style.marginLeft = '8px';
            liveBtn.style.padding = '4px 8px';
            liveBtn.style.background = '#d40000';
            liveBtn.style.color = '#fff';
            liveBtn.style.borderRadius = '4px';
            liveBtn.style.fontSize = '12px';
            liveBtn.style.textDecoration = 'none';

            link.parentElement.appendChild(liveBtn);
            link.dataset.liveAdded = 'true';
        });
    }

    // initial run
    addLiveButtons();

    // protože stránka je SPA
    const observer = new MutationObserver(addLiveButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();