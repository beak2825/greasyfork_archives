// ==UserScript==
// @name         Supersport Fixtures – API Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       JV
// @license      MIT
// @description  Tlačítka pro kriket a rugby
// @match        https://supersport.com/rugby/fixtures*
// @match        https://supersport.com/rugby/results*
// @match        https://supersport.com/cricket/fixtures*
// @match        https://supersport.com/cricket/results*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558407/Supersport%20Fixtures%20%E2%80%93%20API%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558407/Supersport%20Fixtures%20%E2%80%93%20API%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function makeLink(text, url) {
        const a = document.createElement("a");
        a.textContent = text;
        a.href = url;
        a.target = "_blank";

        a.style.fontSize = "12px";
        a.style.padding = "6px 14px";
        a.style.borderRadius = "8px";
        a.style.background = "#d1d5db";
        a.style.color = "#000";
        a.style.fontWeight = "600";
        a.style.textDecoration = "none";
        a.style.border = "1px solid #9ca3af";
        a.style.cursor = "pointer";
        a.style.whiteSpace = "nowrap";
        a.style.transition = "0.15s";

        a.onmouseenter = () => {
            a.style.background = "#2563eb";
            a.style.color = "white";
            a.style.borderColor = "#1d4ed8";
        };
        a.onmouseleave = () => {
            a.style.background = "#d1d5db";
            a.style.color = "#000";
            a.style.borderColor = "#9ca3af";
        };

        return a;
    }

    function processLinks() {
        document.querySelectorAll('a[href*="/rugby/match/"]:not([data-api-buttons])').forEach(a => {
            const uuid = a.href.match(/rugby\/match\/([a-f0-9\-]{36})/i)?.[1];
            if (!uuid) return;

            a.setAttribute("data-api-buttons", "1");

            const statsUrl   = `https://supersport.com/apix/rugby/v5.1/match/${uuid}/stats`;
            const detailsUrl = `https://supersport.com/apix/rugby/v5/matches/${uuid}/details`;

            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.justifyContent = "center";
            wrap.style.gap = "10px";
            wrap.style.marginTop = "6px";

            wrap.appendChild(makeLink("STATS", statsUrl));
            wrap.appendChild(makeLink("SCORE", detailsUrl));

            a.insertAdjacentElement("afterend", wrap);
        });

        document.querySelectorAll('a[href*="/cricket/match/"]:not([data-api-buttons])').forEach(a => {
            const uuid = a.href.match(/cricket\/match\/([a-f0-9\-]{36})/i)?.[1];
            if (!uuid) return;

            a.setAttribute("data-api-buttons", "1");

            const scoreUrl = `https://supersport.com/apix/cricket/v5/score/${uuid}/summary`;

            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.justifyContent = "center";
            wrap.style.gap = "10px";
            wrap.style.marginTop = "6px";

            wrap.appendChild(makeLink("SCORE", scoreUrl));

            a.insertAdjacentElement("afterend", wrap);
        });
    }

    const observer = new MutationObserver(processLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    processLinks();
})();