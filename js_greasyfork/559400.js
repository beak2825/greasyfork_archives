// ==UserScript==
// @name         Bloxd.io – YouTube Rank Badge (MemerX Style)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Adds a red YouTube-style badge next to your name in Bloxd.io (chat, leaderboard, nametag)
// @match        *://bloxd.io/*
// @match        *://*.bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559400/Bloxdio%20%E2%80%93%20YouTube%20Rank%20Badge%20%28MemerX%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559400/Bloxdio%20%E2%80%93%20YouTube%20Rank%20Badge%20%28MemerX%20Style%29.meta.js
// ==/UserScript==

(function() {
    const YOUR_NAME = ""; // Optional: set your exact Bloxd username here

    const YT_BADGE = `
        <span class="yt-rank-badge" style="
            display:inline-block;
            vertical-align:middle;
            margin-right:4px;
        ">
            <svg width="40" height="16" viewBox="0 0 40 16" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="40" height="16" rx="6" fill="#FF0000"/>
                <polygon points="16,4 26,8 16,12" fill="white"/>
            </svg>
        </span>
    `;

    function detectName() {
        if (YOUR_NAME) return YOUR_NAME;
        const el = document.querySelector("#hud-username, .hud-username, .username");
        return el ? el.textContent.trim() : null;
    }

    function applyBadge() {
        const name = detectName();
        if (!name) return;

        const selectors = [
            ".chat-message-username",
            ".leaderboard-name",
            ".nametag-name",
            ".player-name",
            ".username"
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.dataset.ytRankApplied) return;
                if (el.textContent.trim() === name) {
                    el.innerHTML = YT_BADGE + el.innerHTML;
                    el.dataset.ytRankApplied = "true";
                }
            });
        });
    }

    const observer = new MutationObserver(() => applyBadge());
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(applyBadge, 500);
})();
