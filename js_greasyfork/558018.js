// ==UserScript==
// @name         Spankbang BYPASS
// @namespace    http://tampermonkey.net/
// @description  Age restriction bypass
// @author       Orgacord
// @version      1.0.6
// @match        https://spankbang.com/*
// @match        https://spankbang.party/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558018/Spankbang%20BYPASS.user.js
// @updateURL https://update.greasyfork.org/scripts/558018/Spankbang%20BYPASS.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent = `
        .strong-blur { filter: none !important; backdrop-filter: none !important; }
        html, body { overflow: auto !important; position: static !important; }
        .i_icon-lock-18, svg .i_icon-lock-18 { display: none !important; }
        [aria-label="Explicit content locked"] {display: none !important;}
        .bg-surface-black\/40 {visibility: hidden !important;}
        div[x-show^="elementHasToWait == 'recommended_video_"] {display: none !important;}
    `;
    document.documentElement.appendChild(style);

    const removeLocks = () => {
        document.querySelectorAll("div[aria-label='Explicit content locked']").forEach(el => {
            if (el.parentElement) el.parentElement.remove();
        });

        document.querySelectorAll(".i_icon-lock-18, svg .i_icon-lock-18").forEach(el => el.remove());

        document.querySelectorAll("img.strong-blur").forEach(img => img.classList.remove("strong-blur"));
        
        document.querySelectorAll("div[x-show^=\"elementHasToWait == 'recommended_video_\"]").forEach(el => {el.remove();});
        document.querySelectorAll('.bg-surface-black\\/40').forEach(el => el.remove());

        document.documentElement.classList.remove("overflow-hidden");
        document.body.classList.remove("overflow-hidden");
    };

    removeLocks();
    new MutationObserver(removeLocks).observe(document.documentElement, { childList: true, subtree: true });
})();